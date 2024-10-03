# recommendation-service/app/model_loader.py

import pickle

def load_model():
    with open('../models/recommendation_model.pkl', 'rb') as f:
        model = pickle.load(f)
    return model
