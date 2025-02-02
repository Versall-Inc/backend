# File: src/models/schemas.py

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union

# Assessment Models
class Answer(BaseModel):
    """Model for student answers"""
    question_id: int = Field(..., description="The ID of the question being answered")
    answer: Union[str, int] = Field(..., description="The student's answer")

class Question(BaseModel):
    """Model for assessment questions"""
    id: int = Field(..., description="Question ID")
    question: str = Field(..., description="Question text")
    type: str = Field(..., description="Question type")
    options: Optional[List[str]] = Field(default=None, description="Multiple choice options")
    correct_answer: str = Field(..., description="Correct answer")
    points: int = Field(..., description="Points value")
    explanation: Optional[str] = Field(default=None, description="Answer explanation")

class Assessment(BaseModel):
    """Model for assessments"""
    title: str = Field(..., description="Assessment title")
    type: str = Field(..., description="Type of assessment")
    questions: List[Question] = Field(..., description="List of questions")
    total_points: int = Field(..., description="Total possible points")
    instructions: str = Field(..., description="Assessment instructions")
    duration_minutes: int = Field(..., description="Time allowed for completion")

# Request Models
class CoursePromptRequest(BaseModel):
    """Model for course generation request"""
    prompt: str = Field(..., description="The prompt to generate the course from")
    category: str = Field(..., description="The category of the course")
    subcategory: str = Field(..., description="The subcategory of the course")
    difficulty: str = Field(..., description="The difficulty level of the course")
    material_types: List[str] = Field(..., description="The types of materials to include in the course either video, reading")
    assignment_types: List[str] = Field(..., description="The types of assignments to include in the course either quiz, writing")

class AssessmentRequest(BaseModel):
    """Model for assessment generation request"""
    unit_content: Dict[str, Any] = Field(..., description="The unit content to generate assessment from")
    num_questions: int = Field(default=3, description="Number of questions to generate")
    assessment_type: str = Field(..., description="Type of assessment to generate (quiz or assignment)")

class GradingRequest(BaseModel):
    """Model for grading request"""
    student_answers: List[Answer] = Field(..., description="List of student answers")
    assessment_data: Dict[str, Any] = Field(..., description="The original assessment data with correct answers")
    assessment_type: str = Field(..., description="Type of assessment (quiz or assignment)")

# Response Models
class GradingFeedback(BaseModel):
    """Model for individual question feedback"""
    question_id: int = Field(..., description="Question ID")
    points_earned: float = Field(..., description="Points earned")
    max_points: float = Field(..., description="Maximum points possible")
    feedback: Optional[str] = Field(default=None, description="Feedback comment")

class GradingResponse(BaseModel):
    """Model for grading response"""
    total_score: float = Field(..., description="Total score earned")
    max_score: float = Field(..., description="Maximum possible score")
    percentage: float = Field(..., description="Percentage score")
    feedback: List[GradingFeedback] = Field(..., description="Detailed feedback")
    passed: bool = Field(..., description="Whether the assessment was passed")

class AssessmentResponse(BaseModel):
    """Model for assessment response"""
    title: str = Field(..., description="Assessment title")
    type: str = Field(..., description="Type of assessment")
    questions: List[Question] = Field(..., description="List of questions")
    total_points: int = Field(..., description="Total possible points")
    instructions: str = Field(..., description="Assessment instructions")
    duration_minutes: int = Field(..., description="Time allowed for completion")




# ---------------------------------
# QUESTION SCHEMA
# ---------------------------------
class Question(BaseModel):
    """
    Represents a single question in a quiz or assignment.
    """
    type: str = Field(..., description="Question type, e.g. multiple_choice, true_false, short_answer, essay")
    question: str = Field(..., description="The question text")
    options: List[str] = Field(..., description="Possible answer options (e.g. for multiple_choice)")
    correct_answer: int = Field(..., description="Index of the correct option, or 0/1 for true_false")
    explanation: str = Field(..., description="Explanation for the correct answer, if applicable")
    points: float = Field(..., description="Point value of the question")

# ---------------------------------
# QUIZ SCHEMA
# ---------------------------------
class QuizSchema(BaseModel):
    """
    Represents a single quiz within a unit.
    """
    title: str = Field(..., description="Title of the quiz")
    overview: str = Field(..., description="Short description or instructions for the quiz")
    questions: List[Question] = Field(..., description="Array of questions in this quiz")

# ---------------------------------
# ASSIGNMENT SCHEMA
# ---------------------------------
class AssignmentSchema(BaseModel):
    """
    Represents a single assignment within a unit.
    """
    title: str = Field(..., description="Title of the assignment")
    assignment_type: str = Field(..., description="Type of assignment, 'writing' or 'presentation'")
    overview: str = Field(..., description="Short description or instructions for the assignment")

# ---------------------------------
# CHAPTER SCHEMA
# ---------------------------------
class ChapterSchema(BaseModel):
    """
    Represents a single chapter or content item in a unit.
    """
    title: str = Field(..., description="Title of this chapter")
    content: str = Field(..., description="Textual content or summary for this chapter")
    youtube_query: Optional[str] = Field(
        None, 
        description="Used if 'video' is in material_types, to help find relevant YouTube content"
    )

# ---------------------------------
# UNIT SCHEMA
# ---------------------------------
class UnitSchema(BaseModel):
    """
    Represents a single unit with all details (chapters, optional quiz, optional assignment).
    """
    title: str = Field(..., description="Title of this unit")
    chapters: List[ChapterSchema] = Field(..., description="List of up to N chapters (ChapterSchema items)")
    quiz: Optional[QuizSchema] = Field(None, description="Optional quiz for this unit")
    assignment: Optional[AssignmentSchema] = Field(None, description="Optional assignment for this unit")
    youtube_link: Optional[str] = Field(None, description="Link to a YouTube video for the unit")

# ---------------------------------
# COURSE SKELETON SCHEMA
# ---------------------------------
class CourseSkeletonSchema(BaseModel):
    """
    The basic course info: title, overview, total_units, and max_chapters_per_unit.
    Does NOT contain the actual units.
    """
    title: str = Field(..., description="Course title")
    overview: str = Field(..., description="Short overview of the course")
    total_units: int = Field(..., description="How many units to create")
    max_chapters_per_unit: int = Field(..., description="Maximum number of chapters per unit")

# ---------------------------------
# FINAL COURSE SCHEMA
# ---------------------------------
class GeneratedCourseSchema(BaseModel):
    """
    Final combined course data with multiple units.
    """
    title: str
    overview: str
    units: List[UnitSchema]


class UnitPromptRequest(BaseModel):
    """Model for unit generation request"""
    unit: Dict[str, Any] = Field(..., description="The unit data to generate content for")
    prompt: str = Field(..., description="The prompt for generating the unit content")
    difficulty: str = Field(..., description="The difficulty level of the unit")
    material_types: List[str] = Field(..., description="The types of materials to include in the unit either video, reading")
    assignment_types: List[str] = Field(..., description="The types of assignments to include in the unit either quiz, writing")


class UnitMetadataSchema(BaseModel):
    title: str = Field(..., description="The title of the unit.")
    num_chapters: int = Field(ge=1, le=5)  # Ensure num_chapters is between 1-5


class CourseMetadataSchema(BaseModel):
    title: str = Field(..., description="The title of the course.")
    overview: str = Field(..., description="A short description of the course.")
    units: List[UnitMetadataSchema] = Field(..., description="A list of units within the course.")

class CompleteUnitSchema(BaseModel):
    title: str = Field(..., description="The title of the unit.")
    description: str = Field(
        ..., description="A summary description of the unit."
    )
    chapters: List[ChapterSchema] = Field(
        ..., description="A list of chapters within the unit."
    )
    quiz: Optional[QuizSchema] = Field(
        None, description="An optional quiz for the unit."
    )
    assignment: Optional[AssignmentSchema] = Field(
        None, description="An optional assignment for the unit."
    )