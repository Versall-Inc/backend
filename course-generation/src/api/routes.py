# File: src/api/routes.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
import asyncio

from typing import Dict, Any
from datetime import datetime
from src.models.schemas import (
    CoursePromptRequest,
    AssessmentRequest,
    UnitPromptRequest,
    CourseMetadataSchema,
    CompleteUnitSchema,
    GradingResultSchema,
    WritingAssessmentRequest
)
from src.core.gpt import generate_course_metadata, generate_unit_content, grade_writing_assignment
from src.services.assessment import AssessmentGenerator
from src.services.grading import GradingService
from pydantic import ValidationError
import logging
from functools import wraps
from config.settings import OPENAI_API_KEY, TEMPERATURE

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
assessment_generator = AssessmentGenerator()

class APIError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail

def validate_unit_content(unit_content: Dict[str, Any]) -> None:
    """Validate unit content structure"""
    required_fields = ['title', 'description', 'contents']
    for field in required_fields:
        if field not in unit_content:
            raise APIError(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Missing required field '{field}' in unit_content"
            )
    
    if not isinstance(unit_content['contents'], list):
        raise APIError(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="contents must be a list"
        )

    for content in unit_content['contents']:
        if not isinstance(content, dict):
            raise APIError(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="each content item must be an object"
            )
            
        if 'title' not in content or 'content' not in content:
            raise APIError(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="content items must contain title and content"
            )

def validate_assessment_request(request: AssessmentRequest) -> None:
    """Validate assessment generation request"""
    if request.num_questions < 1:
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of questions must be at least 1"
        )
    
    max_questions = 20 if request.assessment_type == 'quiz' else 10
    if request.num_questions > max_questions:
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Number of questions cannot exceed {max_questions} for {request.assessment_type}"
        )

def validate_course_request(prompt: str) -> None:
    """Validate course generation request"""
    if not prompt.strip():
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    if len(prompt) < 10:
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must be at least 10 characters long"
        )
        
    if len(prompt) > 500:
        raise APIError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must not exceed 500 characters"
        )

def error_handler(func):
    """Decorator for consistent error handling"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except ValidationError as e:
            logger.error(f"Validation error in {func.__name__}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e)
            )
        except APIError as e:
            logger.error(f"API error in {func.__name__}: {e.detail}")
            raise HTTPException(
                status_code=e.status_code,
                detail=e.detail
            )
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Internal server error: {str(e)}"
            )
    return wrapper

@router.post("/generate-course-outline", response_model=CourseMetadataSchema)
@error_handler
async def generate_course_outline_endpoint(request: CoursePromptRequest):
    """Generate a course from a prompt"""
    validate_course_request(request.prompt)

    try:
        logger.info(f"Generating course for prompt: {request.prompt}")
        print('hi')
        # Run course metadata generation as a background task
        task = asyncio.create_task(generate_course_metadata(
            request.prompt, request.category, request.subcategory,
            request.difficulty, request.assignment_types, request.material_types,
            OPENAI_API_KEY, TEMPERATURE
        ))

        return await task  # Await task completion
    except Exception as e:
        logger.error(f"Error generating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )

@router.post("/generate-unit-content", response_model=CompleteUnitSchema)
@error_handler
async def generate_unit_content_endpoint(request: UnitPromptRequest):
    """Generate a course from a prompt"""
    validate_course_request(request.prompt)

    try:
        logger.info(f"Generating unit content for prompt: {request.prompt}")

        # Run unit content generation as a background task
        task = asyncio.create_task(generate_unit_content(
            request.unit, request.prompt, request.difficulty,
            request.material_types, request.assignment_types,
            OPENAI_API_KEY, TEMPERATURE
        ))

        return await task  # Await task completion
    except Exception as e:
        logger.error(f"Error generating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )
    
# Endpoint to grade a writing assignment
@router.post("/grade-writing-assignment", response_model=GradingResultSchema)
async def grade_writing_assignment_endpoint(
    assignment_overview: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Endpoint to grade a writing assignment by extracting content from the uploaded file,
    generating feedback, and grading it based on the evaluation.
    """
    # Call the grading function
    try:
        # Directly await the grading function instead of creating a task
        result = await grade_writing_assignment(
            file=file,
            assignment_overview=assignment_overview,
            api_key=OPENAI_API_KEY,
            temperature=TEMPERATURE
        )
        return result  # Return the result

    except Exception as e:
        logger.error(f"Error generating feedback: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate feedback: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "services": {
            "course_generator": "available",
            "assessment_generator": "available",
            "grading_service": "available"
        }
    }