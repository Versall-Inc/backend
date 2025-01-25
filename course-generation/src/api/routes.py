# File: src/api/routes.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status


from typing import Dict, Any
from datetime import datetime
from src.models.schemas import (
    CoursePromptRequest,
    GeneratedCourseSchema,
    AssessmentRequest,
    GradingResponse
)
from src.core.gpt import generate_course
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

@router.post("/generate-course", response_model=GeneratedCourseSchema)
@error_handler
async def generate_course_endpoint(request: CoursePromptRequest):
    """Generate a course from a prompt"""
    validate_course_request(request.prompt)
    
    try:
        logger.info(f"Generating course for prompt: {request.prompt}")
        return await generate_course(request.prompt, request.category, request.subcategory, request.difficulty,request.material_types, request.assignment_types, OPENAI_API_KEY, TEMPERATURE)
    except Exception as e:
        logger.error(f"Error generating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )

@router.post("/grade-assessment", response_model=GradingResponse)
@error_handler
async def grade_assessment_endpoint(
    assessment_type: str = Form(..., description="Either 'writing' or 'presentation'"),
    assignment_overview: str = Form(..., description="Text overview of the assignment"),
    file: UploadFile = File(..., description="Uploaded file (docx/txt for writing, video for presentation)")
):
    """
    Grade a submitted assignment based on a file (.docx or .txt if writing).
    Presentation is not ready yet => return 501.
    """
    # 1) Check assessment_type
    if assessment_type not in ("writing", "presentation"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="assessment_type must be either 'writing' or 'presentation'"
        )

    # 2) If "presentation", return 501
    if assessment_type == "presentation":
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Presentation grading is not ready yet."
        )

    # 3) Now handle writing    
    grading_service = GradingService()

    grading_result = await grading_service.grade_writing_assignment(file, assignment_overview)

    # 4) Return result as GradingResponse
    return GradingResponse(**grading_result)

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