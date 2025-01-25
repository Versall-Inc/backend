import os
from fastapi import  UploadFile

class GradingService:
    async def grade_writing_assignment(self, file: UploadFile, assignment_overview: str) -> dict:
        """
        A placeholder logic for grading a writing assignment based on 
        an uploaded .docx or .txt file plus an assignment_overview text.
        """
        try:
            # Basic checks: extension must be .docx or .txt
            filename = file.filename.lower()
            allowed_extensions = (".docx", ".txt")
            if not filename.endswith(allowed_extensions):
                raise ValueError(f"Only {allowed_extensions} files are allowed for writing assignments.")
            
            # We read the file content just to demonstrate
            file_contents = await file.read()
            # In a real system, parse docx or analyze text from .txt

            # Placeholder scoring logic
            max_score = 100.0
            # For example, let's say we award partial credit if file size > 0
            if len(file_contents) > 0:
                scored_points = 80.0  # partial credit
            else:
                scored_points = 0.0

            percentage = (scored_points / max_score) * 100
            passed = (percentage >= 70.0)

            # Provide some feedback
            feedback_text = (
                f"Assignment Overview: {assignment_overview[:100]}...\n"
                f"File '{filename}' was uploaded.\n"
                f"Awarded partial credit for a successful file submission!"
            )

            return {
                "total_score": scored_points,
                "max_score": max_score,
                "percentage": round(percentage, 2),
                "feedback": feedback_text,
                "passed": passed
            }
        except Exception as e:
            logger.error(f"Error in grade_writing_assignment: {str(e)}")
            raise
