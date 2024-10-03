# recommendation-service/app/recommend.py

import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from .model_loader import load_model

app = Flask(__name__)

# Load the saved model
model = load_model()

@app.route('/recommend', methods=['POST'])
def recommend_course():
    data = request.json
    
    # Extract the features from the request
    user_features = {
        'userId': data['userId'],
        'age': data['age'],
        'location': data['location'],
        'expertiseLevel': data['expertiseLevel'],
        'courseTags': data['courseTags'],
        'courseDifficulty': data['courseDifficulty'],
        'timeSpent': data['timeSpent'],
        'trendingScore': data['trendingScore']
    }

    # Convert to a DataFrame
    user_df = pd.DataFrame([user_features])
    
    # Predict the rating for all available courses (dummy courses used here)
    course_ids = [101, 102, 103, 104]  # Dummy course ids
    predictions = []
    
    for course_id in course_ids:
        user_df['courseId'] = course_id
        predicted_rating = model.predict(user_df)[0]
        predictions.append((course_id, predicted_rating))
    
    # Sort courses by predicted rating (descending order)
    predictions.sort(key=lambda x: x[1], reverse=True)

    # Return the top recommendation
    top_course = predictions[0][0]
    return jsonify({'recommended_courseId': top_course, 'predicted_rating': predictions[0][1]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
