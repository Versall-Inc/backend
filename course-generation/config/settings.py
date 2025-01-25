import os

# API Keys
OPENAI_API_KEY =os.getenv("OPENAI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

# Model Configuration
GPT_MODEL = os.getenv("GPT_MODEL")
TEMPERATURE = os.getenv("TEMPERATURE")

# Assessment Configuration
QUIZ_DURATION = os.getenv("QUIZ_DURATION")  # minutes
ASSIGNMENT_DURATION = os.getenv("ASSIGNMENT_DURATION") 
QUIZ_QUESTIONS = os.getenv("QUIZ_QUESTIONS")
ASSIGNMENT_QUESTIONS = os.getenv("ASSIGNMENT_QUESTIONS")

# YouTube Configuration
MAX_VIDEO_RESULTS = os.getenv("MAX_VIDEO_RESULTS")
VIDEO_DURATION = os.getenv("VIDEO_DURATION")

PORT = os.getenv("PORT")