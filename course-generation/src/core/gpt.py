import openai
import io
import aiohttp
import asyncio
from urllib.parse import quote
import logging
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from src.models.schemas import (
    CourseSkeletonSchema,
    ChapterSchema,      
    QuizSchema,
    AssignmentSchema,
    CourseMetadataSchema,
    GradingResultSchema
)
from src.utils.textExtractors import extract_content_from_file
import os
from fastapi import UploadFile
from youtube_search import YoutubeSearch



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# ---------------------------
# STRICT OUTPUT LOGIC
# ---------------------------
async def strict_output(
    system_prompt: str,
    user_prompts: str,
    output_format: BaseModel,
    api_key: str,
    model: str = os.getenv("GPT_MODEL", "gpt-4"),
    temperature: float = 1.0
) -> Dict[str, Any]:
    """
    Calls OpenAI's API asynchronously using asyncio.to_thread to offload
    the synchronous client execution.
    """
    start_time = datetime.now()

    def call_openai():
        try:
            client = openai.Client(api_key=api_key)
            completion = client.beta.chat.completions.parse(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompts}
                ],
                response_format=output_format
            )
            return completion.choices[0].message.parsed.model_dump()
        except Exception as e:
            logger.error(f"Error in strict_output: {str(e)}")
            return None

    response_data = await asyncio.to_thread(call_openai)

    if response_data is None:
        response_data = {
            "title": f"{user_prompts.strip().title()} Course",
            "overview": f"Introduction to {user_prompts.strip().title()}",
            "units": [
                {
                    "title": "Introduction",
                    "chapters": [
                        {
                            "title": "Getting Started",
                            "content": "Basic introduction fallback",
                        }
                    ]
                }
            ],
            "metadata": {
                "created_at": datetime.now().isoformat(),
                "prompt": user_prompts,
                "version": "1.0.0",
                "error": "Failed to fetch data from OpenAI API"
            }
        }

    # Add metadata
    response_data["metadata"] = {
        "created_at": datetime.now().isoformat(),
        "prompt": user_prompts,
        "version": "1.0.0"
    }

    duration = datetime.now() - start_time
    logger.info(f"strict_output completed in {duration}")

    return response_data

# ---------------------------
# COURSE METADATA GENERATION
# ---------------------------
async def generate_course_metadata(
    prompt: str,
    category: str,
    subcategory: str,
    difficulty: str,
    assignment_types: List[str],
    material_types: List[str],
    api_key: str,
    temperature: float
) -> Dict[str, Any]:
    """
    Generates the course skeleton, including title, overview, and units (with titles and number of chapters).
    Does NOT generate chapters, quizzes, or assignments.
    """
    # STEP 1: SKELETON
    skeleton_system_prompt = """You are an expert course creator.
Only produce the top-level course info (title, overview, total_units, max_chapters_per_unit).
DO NOT list individual units or chapters. 
Return total_units as an integer. 
Also return max_chapters_per_unit as an integer.
"""

    skeleton_user_prompt = f"""
Topic: {prompt}
Category: {category}
Subcategory: {subcategory}
Difficulty: {difficulty}
Assignment Types: {assignment_types}
Material Types: {material_types}

Please provide:
1) title (course title)
2) overview (short description)
3) total_units (int)
4) max_chapters_per_unit (int)
"""

    skeleton_data = await strict_output(
        system_prompt=skeleton_system_prompt,
        user_prompts=skeleton_user_prompt,
        output_format=CourseSkeletonSchema,
        api_key=api_key,
        temperature=temperature
    )

    total_units = max(1, skeleton_data.get("total_units", 1))
    total_units = min(10, total_units)  # cap at 10
    max_chapters_per_unit = max(1, skeleton_data.get("max_chapters_per_unit", 2))
    max_chapters_per_unit = min(5, max_chapters_per_unit)

    # Define a minimal schema to parse unit information
    class UnitMinimalSchema(BaseModel):
        title: str
        num_chapters: int

    # STEP 2: Parallelize unit title and chapters generation
    unit_tasks = [
        strict_output(
            system_prompt="""You are an expert course creator.
The user needs a single unit's title and how many chapters to create (<= max_chapters_per_unit).
""",
            user_prompts=f"""
We have a course titled "{skeleton_data['title']}" (overview: {skeleton_data['overview']}).
This is Unit #{u_idx+1} out of {total_units}, with {difficulty} difficulty.

Return:
1) title (string): The name of this unit.
2) num_chapters (int): how many chapters you'll create (1 <= num_chapters <= {max_chapters_per_unit}).
No quiz or assignment here yet.
""",
            output_format=UnitMinimalSchema,
            api_key=api_key,
            temperature=temperature
        )
        for u_idx in range(total_units)
    ]

    # Run all unit generation tasks concurrently
    units = await asyncio.gather(*unit_tasks)

    # Construct the metadata without chapters, quizzes, or assignments
    course_metadata = {
        "title": skeleton_data["title"],
        "overview": skeleton_data["overview"],
        "units": [
            {
                "title": unit["title"],
                "num_chapters": unit["num_chapters"]
            }
            for unit in units
        ]
    }

    # Validate with your GeneratedCourseSchema (excluding chapters)
    try:
        final_parsed = CourseMetadataSchema(**course_metadata)
        logger.info("Course metadata generation completed.")
        return final_parsed.dict()
    except Exception as e:
        logger.error(f"Error in generate_course_metadata: {str(e)}")
        raise

# ---------------------------
# UNIT CONTENT GENERATION
# ---------------------------
async def generate_unit_content(
    unit: Dict[str, Any],
    prompt: str,
    difficulty: str,
    material_types: List[str],
    assignment_types: List[str],
    api_key: str,
    temperature: float,
) -> Dict[str, Any]:
    """
    Generates detailed content for a given unit, including chapters, quizzes, and assignments.
    """
    unit_title = unit["title"]
    num_chapters = unit["num_chapters"]

    # STEP 1: Generate Chapters
    chapters = []
    for c_idx in range(num_chapters):
        chap_system_prompt = """You are an expert course creator.
The user wants to generate exactly one chapter (content item). 
Output (title, content, optional youtube_query). 
"""

        chap_user_prompt = f"""
We have a unit titled "{unit_title}" in a {difficulty} difficulty course on "{prompt}".
{'' if c_idx == 0 else 'Previous chapters:' + ', '.join(str(i + 1) + "." + c['title'] for i, c in enumerate(chapters))}.
Chapter #{c_idx+1} out of {num_chapters}.
The user wants:
- a `title` (string),
- `content` (string)
  {('Detailed text with real-life examples.' if 'reading' in material_types else 'A concise summary focusing on key points.')}
- optionally `youtube_query` if you think a relevant video might help.

No quiz or assignment here. Return exactly one chapter object.
"""
        if "video" in material_types:
            chap_system_prompt = """You are an expert course creator.
The user wants to generate exactly one chapter (content item). 
Output (title, content, youtube_query). 
"""
            chap_user_prompt = f"""
We have a unit titled "{unit_title}" in a {difficulty} difficulty course on "{prompt}".
Chapter #{c_idx+1} out of {num_chapters}.
The user wants:
- a `title` (string),
- `content` (string)
  {('Detailed text with real-life examples.' if 'reading' in material_types else 'A concise summary focusing on key points.')}
- `youtube_query` (string) for a relevant video.

No quiz or assignment here. Return exactly one chapter object.
"""
            
        single_chapter = await strict_output(
            system_prompt=chap_system_prompt,
            user_prompts=chap_user_prompt,
            output_format=ChapterSchema,
            api_key=api_key,
            temperature=temperature
        )

        single_chapter["youtube_link"] = await search_youtube(single_chapter.get("youtube_query"))

        chapters.append(single_chapter)

    logger.info(f"Generated {len(chapters)} chapters for unit '{unit_title}'.")

    # STEP 2: Generate Quizzes and Assignments
    # Define the QuizAssignSchema inside this function
    class QuizAssignSchema(BaseModel):
        quiz: Optional[QuizSchema] = None
        assignment: Optional[AssignmentSchema] = None

    quiz_assign_system_prompt = """You are an expert course creator.
The user wants optional quiz/assignment for a single unit based on the Unit title and Chapters provided.
No chapter info here, just quiz or assignment or both.
"""

    quiz_assign_user_prompt = f"""
Unit title: {unit_title}.
Chapters: {", ".join(str(i + 1) + "." + c['title'] for i, c in enumerate(chapters))}.
Assignment types allowed: {assignment_types}.
If there's no quiz or assignment, return them as None.
No reading or video assigned as assignment_type.
"""

    quiz_assign_data = await strict_output(
        system_prompt=quiz_assign_system_prompt,
        user_prompts=quiz_assign_user_prompt,
        output_format=QuizAssignSchema,
        api_key=api_key,
        temperature=temperature
    )

    # Construct the complete unit with chapters, quiz, and assignment
    complete_unit = {
        "title": unit_title,
        "description": f"Auto-generated summary for unit '{unit_title}'",
        "chapters": chapters,
        "quiz": quiz_assign_data.get("quiz"),
        "assignment": quiz_assign_data.get("assignment")
    }

    return complete_unit


# ---------------------------
# Writing Assessment Grading
# ---------------------------
async def grade_writing_assignment(
    file: UploadFile,
    assignment_overview: str,
    api_key: str,
    temperature: float
) -> GradingResultSchema:
    """
    Grades a writing assignment by extracting content from the provided file 
    and using strict_output to provide feedback and grade.
    """
    content = await extract_content_from_file(file)
    
    feedback_system_prompt = """You are an expert writing evaluator. 
    Please analyze the following writing assignment and provide feedback on its strengths and areas of improvement. 
    The feedback should be a string formatted as 'Strengths: [strengths] Improvements: [improvements]'. 
    """

    feedback_user_prompt = f"""Here is the student's writing assignment:
    {assignment_overview}
    And Here is the students writing:
    {content}
    Provide feedback on its strengths and areas for improvement.
    """

    result = await strict_output(
        system_prompt=feedback_system_prompt,
        user_prompts=feedback_user_prompt,
        output_format=GradingResultSchema,
        api_key=api_key,
        temperature=temperature
    )

    try:
        final_parsed = GradingResultSchema(**result)
        logger.info("Grading completed.")
        return final_parsed.dict()
    except Exception as e:
        logger.error(f"Error in grade_writing_assignment: {str(e)}")
        raise



# ---------------------------
# YOUTUBE SEARCH
# ---------------------------
async def search_youtube(search_query):
    loop = asyncio.get_event_loop()
    results = await loop.run_in_executor(None, lambda: YoutubeSearch(search_query, max_results=1).to_dict())

    if not results:
        print("YouTube search returned no results")
        return ""

    return results[0]["id"]