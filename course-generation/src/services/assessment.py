from typing import Dict, Any, List
import asyncio
import logging
from datetime import datetime
from src.core.gpt import strict_output
from config.settings import QUIZ_DURATION, ASSIGNMENT_DURATION

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

class AssessmentGenerator:
    def __init__(self):
        """Initialize the AssessmentGenerator"""
        self.loop = None
        
    def _ensure_loop(self):
        """Ensure we have a valid event loop"""
        try:
            self.loop = asyncio.get_event_loop()
        except RuntimeError:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)

    async def generate_chapter_assessments(self, chapter_content: Dict[str, Any]) -> Dict[str, Any]:
        """Generate both quiz and assignment for a chapter"""
        logger.info(f"Generating assessments for chapter: {chapter_content.get('chapter_title', 'Unknown')}")
        start_time = datetime.now()
        
        try:
            self._ensure_loop()
            
            # Generate quiz and assignment in parallel
            quiz_task = self.generate_assessment(chapter_content, 'quiz', 5)
            assignment_task = self.generate_assessment(chapter_content, 'assignment', 3)
            
            quiz, assignment = await asyncio.gather(
                quiz_task, 
                assignment_task,
                return_exceptions=True
            )
            
            # Handle any exceptions in the results
            if isinstance(quiz, Exception):
                logger.error(f"Quiz generation failed: {str(quiz)}")
                quiz = self._generate_fallback_assessment('quiz', chapter_content['chapter_title'])
                
            if isinstance(assignment, Exception):
                logger.error(f"Assignment generation failed: {str(assignment)}")
                assignment = self._generate_fallback_assessment('assignment', chapter_content['chapter_title'])
            
            duration = datetime.now() - start_time
            logger.info(f"Generated assessments in {duration}")
            
            return {
                'quiz': quiz,
                'assignment': assignment
            }
            
        except Exception as e:
            logger.error(f"Error generating chapter assessments: {str(e)}")
            return {
                'quiz': self._generate_fallback_assessment('quiz', chapter_content.get('chapter_title', 'Unknown')),
                'assignment': self._generate_fallback_assessment('assignment', chapter_content.get('chapter_title', 'Unknown'))
            }

    async def generate_assessment(
        self, 
        chapter_content: Dict[str, Any], 
        assessment_type: str = 'quiz',
        num_questions: int = 5
    ) -> Dict[str, Any]:
        """Generate a single assessment with proper formatting"""
        logger.info(f"Generating {assessment_type} for chapter: {chapter_content.get('chapter_title', 'Unknown')}")
        
        try:
            question_types = (
                ['multiple_choice', 'true_false']
            )
            
            prompt = f"""
            Create {num_questions} {assessment_type} questions for:
            Title: {chapter_content['chapter_title']}
            Content: {chapter_content['summary']}
            Question types to use: {', '.join(question_types)}
            
            Generate appropriate questions with correct answers and explanations.
            Include varying difficulty levels.
            """
            
            questions_data = await strict_output(
                system_prompt="You are an expert education content creator specializing in assessment creation.",
                user_prompts=prompt,
                output_format={
                    "questions": [
                        {
                            "type": "string (multiple_choice/true_false)",
                            "question": "string",
                            "options": ["string"],
                            "correct_answer": "string or index",
                            "explanation": "string",
                            "points": "number",
                            "difficulty": "string (easy/medium/hard)"
                        }
                    ]
                },
                api_key="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"
            )
            
            questions = questions_data.get('questions', [])
            
            # Process and validate questions
            processed_questions = self._process_questions(questions)
            
            if not processed_questions:
                logger.warning(f"No valid questions generated for {assessment_type}, using fallback")
                return self._generate_fallback_assessment(assessment_type, chapter_content['chapter_title'])
            
            return {
                'title': f"{assessment_type.capitalize()}: {chapter_content['chapter_title']}",
                'type': assessment_type,
                'questions': processed_questions,
                'total_points': sum(q['points'] for q in processed_questions),
                'instructions': self._generate_instructions(assessment_type),
                'duration_minutes': QUIZ_DURATION if assessment_type == 'quiz' else ASSIGNMENT_DURATION
            }
            
        except Exception as e:
            logger.error(f"Error generating {assessment_type}: {str(e)}")
            return self._generate_fallback_assessment(assessment_type, chapter_content['chapter_title'])

    def _process_questions(self, questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process and validate questions with proper point allocation"""
        processed = []
        for q in questions:
            try:
                processed_q = q.copy()
                
                # Ensure required fields exist
                if not all(key in processed_q for key in ['type', 'question', 'correct_answer']):
                    continue
                    
                # Set points based on question type
                base_points = {
                    'multiple_choice': 2,
                    'true_false': 1,
                }.get(processed_q['type'], 2)
                
                # Apply difficulty multiplier
                multiplier = {
                    'hard': 1.5,
                    'medium': 1.0,
                    'easy': 0.8
                }.get(processed_q.get('difficulty', 'medium'), 1.0)
                
                processed_q['points'] = round(base_points * multiplier)
                
                # Ensure options exist for multiple choice
                if processed_q['type'] == 'multiple_choice' and not processed_q.get('options'):
                    processed_q['options'] = ['Option A', 'Option B', 'Option C']
                
                processed.append(processed_q)
                
            except Exception as e:
                logger.error(f"Error processing question: {str(e)}")
                continue
                
        return processed

    def _generate_fallback_assessment(self, assessment_type: str, chapter_title: str) -> Dict[str, Any]:
        """Generate a fallback assessment with proper structure"""
        is_quiz = assessment_type == 'quiz'
        
        fallback_question = {
            'type': 'multiple_choice' if is_quiz else 'short_answer',
            'question': f"Demonstrate your understanding of {chapter_title}",
            'options': ['Option A', 'Option B', 'Option C'] if is_quiz else [],
            'correct_answer': 'Option A' if is_quiz else 'Sample answer',
            'explanation': 'Basic understanding of core concepts',
            'points': 2,
            'difficulty': 'medium'
        }
        
        return {
            'title': f"{assessment_type.capitalize()}: {chapter_title}",
            'type': assessment_type,
            'questions': [fallback_question],
            'total_points': 2,
            'instructions': self._generate_instructions(assessment_type),
            'duration_minutes': QUIZ_DURATION if assessment_type == 'quiz' else ASSIGNMENT_DURATION
        }

    def _generate_instructions(self, assessment_type: str) -> str:
        """Generate appropriate instructions based on assessment type"""
        if assessment_type == 'quiz':
            return ("Complete all questions in the allotted time. "
                   "Read each question carefully before selecting your answer.")
        else:
            return ("Complete all questions thoroughly. Support your answers with "
                   "specific examples and explanations from the course material. "
                   "Pay attention to the point value and difficulty level of each question.")