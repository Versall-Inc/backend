from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from datetime import datetime
from src.models.schemas import (
    CoursePromptRequest, AssessmentRequest, 
    CourseResponse, AssessmentResponse, GradingRequest,
    GradingResponse, CourseUnit, Assessment, Question
)
from src.services.course import generate_course_from_prompt
from src.services.assessment import AssessmentGenerator
from src.services.grading import GradingService
from pydantic import ValidationError
import logging
from functools import wraps
from config.settings import OPENAI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
assessment_generator = AssessmentGenerator()
grading_service = GradingService()

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

@router.post("/generate-course", response_model=CourseResponse)
@error_handler
async def generate_course(request: CoursePromptRequest):
    """Generate a course from a prompt"""
    validate_course_request(request.prompt)
    
    try:
        logger.info(f"Generating course for prompt: {request.prompt}")
        course = await generate_course_from_prompt(request.prompt, OPENAI_API_KEY)
        return CourseResponse(**course)
    except Exception as e:
        logger.error(f"Error generating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate course: {str(e)}"
        )

@router.post("/generate-assessment", response_model=AssessmentResponse)
@error_handler
async def generate_assessment(request: AssessmentRequest):
    """Generate an assessment for a unit"""
    validate_assessment_request(request)
    validate_unit_content(request.unit_content)
    
    assessment = await assessment_generator.generate_assessment(
        unit_content=request.unit_content,
        assessment_type=request.assessment_type,
        num_questions=request.num_questions
    )
    return AssessmentResponse(**assessment)

@router.post("/grade-assessment", response_model=GradingResponse)
@error_handler
async def grade_assessment(request: GradingRequest):
    """Grade a submitted assessment"""
    try:
        # Validate assessment data
        if not isinstance(request.assessment_data, dict):
            raise APIError(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="assessment_data must be an object"
            )
            
        if 'questions' not in request.assessment_data:
            raise APIError(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="assessment_data must contain questions"
            )
            
        # Validate that student answers match questions
        question_ids = {q.get('id') for q in request.assessment_data['questions']}
        for answer in request.student_answers:
            if answer.question_id not in question_ids:
                raise APIError(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Question ID {answer.question_id} not found in assessment"
                )
        
        # Grade the assessment
        grading_result = await grading_service.grade_assessment(
            student_answers=request.student_answers,
            assessment_data=request.assessment_data,
            assessment_type=request.assessment_type
        )
        
        # Convert to response model
        return GradingResponse(
            total_score=grading_result['total_score'],
            max_score=grading_result['max_score'],
            percentage=grading_result['percentage'],
            feedback=grading_result['feedback'],
            passed=grading_result['passed']
        )
        
    except Exception as e:
        logger.error(f"Error grading assessment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to grade assessment: {str(e)}"
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