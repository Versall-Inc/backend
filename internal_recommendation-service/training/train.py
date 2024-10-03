# recommendation-service/training/train.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

# Load the dataset
data = pd.read_csv('../data/data.csv')

# Features we use for training
X = data[['userId', 'age', 'location', 'expertiseLevel', 'courseTags', 'courseDifficulty', 'timeSpent', 'trendingScore']]

# Target (ratings)
y = data['rating']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model: Random Forest for now, can be replaced with more complex models like Neural Networks
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
with open('../models/recommendation_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print('Model training complete and saved to ../models/recommendation_model.pkl')
