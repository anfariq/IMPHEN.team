from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

# load model dan scaler saat server menyala
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
except Exception as e:
    print(f"Error loading model or scaler: {e}")
    
# req body schema
class NutrientData(BaseModel):
    calories: float
    proteins: float
    fat: float
    carbohydrate: float
    total_nutrisi: float
    healthy_score: float

@app.get("/")
def read_root():
    return {"status": "Active", "message": "API AI Aktif"}

@app.post("/recommend")
def get_recommendation(data: NutrientData):
    try:
        features = np.array([[
            data.calories,
            data.proteins,
            data.fat,
            data.carbohydrate,
            data.total_nutrisi,
            data.healthy_score
        ]])

        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)
        return {"recommendation": int(prediction[0])}
    except Exception as e:
        return {"error": str(e)}