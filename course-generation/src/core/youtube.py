import aiohttp
from youtube_transcript_api import YouTubeTranscriptApi
import asyncio
from config.settings import GOOGLE_API_KEY
from src.core.gpt import strict_output

async def search_youtube(search_query):
    encoded_query = search_query.replace(" ", "+")
    url = (
        f"https://www.googleapis.com/youtube/v3/search?key={GOOGLE_API_KEY}"
        f"&q={encoded_query}&videoDuration=medium&videoEmbeddable=true"
        f"&type=video&maxResults=5"
    )
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            data = await resp.json()
            items = data.get("items", [])
            for item in items:
                video_id = item["id"].get("videoId")
                if video_id:
                    transcript_available = await check_transcript(video_id)
                    if transcript_available:
                        return video_id
    return None

async def check_transcript(video_id):
    try:
        await get_transcript(video_id)
        return True
    except:
        return False

async def get_transcript(video_id):
    loop = asyncio.get_event_loop()
    transcript_list = await loop.run_in_executor(
        None, YouTubeTranscriptApi.get_transcript, video_id
    )
    transcript = " ".join([t["text"] for t in transcript_list])
    return transcript

async def get_questions_from_transcript(transcript: str, course_title: str):
    if not transcript:
        return []
        
    prompt = f"""
    Based on this transcript about {course_title}, generate 5 multiple-choice questions.
    Make the questions challenging but fair, and ensure they cover key concepts from the video.
    
    Transcript: {transcript[:2000]}  # Using first 2000 chars to stay within token limits
    """
    
    questions = await strict_output(
        system_prompt="You are an expert educator who creates engaging and informative video-based questions.",
        user_prompts=prompt,
        output_format={
            "questions": [
                {
                    "question": "string",
                    "correct_answer": "string",
                    "options": ["string", "string", "string", "string"],
                    "explanation": "string",
                }
            ]
        },
        api_key="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"
    )
    
    if isinstance(questions, dict) and "questions" in questions:
        return questions["questions"]
    elif isinstance(questions, list):
        return questions
    else:
        return []