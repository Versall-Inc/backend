#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API base URL
API_URL="http://localhost:8000/api/v1"

# Function to print section header
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to print success/failure
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ Success: $2${NC}"
    else
        echo -e "${RED}✗ Failed: $2${NC}"
    fi
}

# Test 1: Generate Course
test_generate_course() {
    print_header "Testing Course Generation API"
    
    echo "Test 1.1: Valid course generation"
    response=$(curl -s -X POST "$API_URL/generate-course" \
        -H "Content-Type: application/json" \
        -d '{"prompt": "Create a Python programming course"}')
    print_result $? "Generate course with valid prompt"
    echo "Response: $response"
    
    echo -e "\nTest 1.2: Empty prompt (should fail)"
    response=$(curl -s -X POST "$API_URL/generate-course" \
        -H "Content-Type: application/json" \
        -d '{"prompt": ""}')
    print_result $? "Generate course with empty prompt"
    echo "Response: $response"
}

# Test 2: Generate Assignment
test_generate_assignment() {
    print_header "Testing Assignment Generation API"
    
    echo "Test 2.1: Valid assignment generation"
    response=$(curl -s -X POST "$API_URL/generate-assignment" \
        -H "Content-Type: application/json" \
        -d '{
            "chapter_content": {
                "chapter_title": "Introduction to Python",
                "summary": "Basic Python concepts and syntax",
                "youtube_search_query": "python basics tutorial"
            },
            "num_questions": 3
        }')
    print_result $? "Generate assignment with valid input"
    echo "Response: $response"
    
    echo -e "\nTest 2.2: Invalid number of questions (should fail)"
    response=$(curl -s -X POST "$API_URL/generate-assignment" \
        -H "Content-Type: application/json" \
        -d '{
            "chapter_content": {
                "chapter_title": "Introduction to Python",
                "summary": "Basic Python concepts",
                "youtube_search_query": "python basics"
            },
            "num_questions": 0
        }')
    print_result $? "Generate assignment with invalid question count"
    echo "Response: $response"
}

# Test 3: Generate Quiz
test_generate_quiz() {
    print_header "Testing Quiz Generation API"
    
    echo "Test 3.1: Valid quiz generation"
    response=$(curl -s -X POST "$API_URL/generate-quiz" \
        -H "Content-Type: application/json" \
        -d '{
            "chapter_content": {
                "chapter_title": "Python Functions",
                "summary": "Understanding Python functions and their usage",
                "youtube_search_query": "python functions tutorial"
            },
            "num_questions": 5
        }')
    print_result $? "Generate quiz with valid input"
    echo "Response: $response"
    
    echo -e "\nTest 3.2: Missing chapter content (should fail)"
    response=$(curl -s -X POST "$API_URL/generate-quiz" \
        -H "Content-Type: application/json" \
        -d '{
            "chapter_content": {},
            "num_questions": 5
        }')
    print_result $? "Generate quiz with missing chapter content"
    echo "Response: $response"
}

# Test 4: Grade Assignment
test_grade_assignment() {
    print_header "Testing Assignment Grading API"
    
    echo "Test 4.1: Valid assignment grading"
    response=$(curl -s -X POST "$API_URL/grade-assignment" \
        -H "Content-Type: application/json" \
        -d '{
            "student_answers": [
                {"question_id": 1, "answer": "This is my answer to question 1"},
                {"question_id": 2, "answer": "This is my answer to question 2"}
            ],
            "assessment_data": {
                "questions": [
                    {
                        "id": 1,
                        "type": "short_answer",
                        "question": "Explain Python variables",
                        "correct_answer": "Sample answer",
                        "points": 5
                    },
                    {
                        "id": 2,
                        "type": "short_answer",
                        "question": "What are Python functions?",
                        "correct_answer": "Sample answer",
                        "points": 5
                    }
                ],
                "total_points": 10
            }
        }')
    print_result $? "Grade assignment with valid input"
    echo "Response: $response"
    
    echo -e "\nTest 4.2: Invalid question ID (should fail)"
    response=$(curl -s -X POST "$API_URL/grade-assignment" \
        -H "Content-Type: application/json" \
        -d '{
            "student_answers": [
                {"question_id": 999, "answer": "This is my answer"}
            ],
            "assessment_data": {
                "questions": [
                    {
                        "id": 1,
                        "type": "short_answer",
                        "question": "Explain Python variables",
                        "correct_answer": "Sample answer",
                        "points": 5
                    }
                ],
                "total_points": 5
            }
        }')
    print_result $? "Grade assignment with invalid question ID"
    echo "Response: $response"
}

# Test 5: Grade Quiz
test_grade_quiz() {
    print_header "Testing Quiz Grading API"
    
    echo "Test 5.1: Valid quiz grading"
    response=$(curl -s -X POST "$API_URL/grade-quiz" \
        -H "Content-Type: application/json" \
        -d '{
            "student_answers": [
                {"question_id": 1, "answer": 0},
                {"question_id": 2, "answer": 1}
            ],
            "assessment_data": {
                "questions": [
                    {
                        "id": 1,
                        "type": "multiple_choice",
                        "question": "What is Python?",
                        "options": ["Programming language", "Snake", "Game", "Food"],
                        "correct_answer": 0,
                        "points": 2
                    },
                    {
                        "id": 2,
                        "type": "multiple_choice",
                        "question": "What is a variable?",
                        "options": ["A number", "A storage container", "A function", "A loop"],
                        "correct_answer": 1,
                        "points": 2
                    }
                ],
                "total_points": 4
            }
        }')
    print_result $? "Grade quiz with valid input"
    echo "Response: $response"
    
    echo -e "\nTest 5.2: Missing answers (should fail)"
    response=$(curl -s -X POST "$API_URL/grade-quiz" \
        -H "Content-Type: application/json" \
        -d '{
            "student_answers": [],
            "assessment_data": {
                "questions": [
                    {
                        "id": 1,
                        "type": "multiple_choice",
                        "question": "What is Python?",
                        "options": ["Programming language", "Snake", "Game", "Food"],
                        "correct_answer": 0,
                        "points": 2
                    }
                ],
                "total_points": 2
            }
        }')
    print_result $? "Grade quiz with missing answers"
    echo "Response: $response"
}

# Main execution
echo -e "${YELLOW}Starting API Tests${NC}"
echo -e "${YELLOW}=================${NC}"

# Run all tests
test_generate_course
test_generate_assignment
test_generate_quiz
test_grade_assignment
test_grade_quiz

echo -e "\n${YELLOW}API Tests Completed${NC}"