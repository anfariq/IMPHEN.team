
import numpy as np
import tensorflow as tf

from fastapi import FastAPI
from pydantic import BaseModel, Field


@tf.keras.utils.register_keras_serializable(package="Kalories")
class MacroCalorieFeatureLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        protein = inputs[:, 0:1]
        lemak = inputs[:, 1:2]
        karbohidrat = inputs[:, 2:3]

        macro_formula = (
            protein * 4.0 +
            lemak * 9.0 +
            karbohidrat * 4.0
        )

        return tf.concat([inputs, macro_formula], axis=1)


MODEL_PATH = "/content/kalories-ai/artifacts/model.keras"

model = tf.keras.models.load_model(MODEL_PATH)

app = FastAPI(
    title="Kalories AI API",
    description="REST API untuk memprediksi kalori makanan berdasarkan kandungan nutrisi.",
    version="1.0.0"
)


class NutritionInput(BaseModel):
    protein: float = Field(..., ge=0, description="Jumlah protein per 100 gram")
    lemak: float = Field(..., ge=0, description="Jumlah lemak per 100 gram")
    karbohidrat: float = Field(..., ge=0, description="Jumlah karbohidrat per 100 gram")
    total_nutrisi: float = Field(..., ge=0, description="Total nutrisi per 100 gram")
    gram: float = Field(100, gt=0, description="Ukuran porsi makanan dalam gram")


def get_calorie_category(calories):
    if calories < 200:
        return "Rendah"
    elif calories <= 400:
        return "Sedang"
    return "Tinggi"


@app.get("/")
def home():
    return {
        "message": "Kalories AI API is running",
        "model": "TensorFlow Functional API Regression Model",
        "endpoint": "/predict-calories"
    }


@app.post("/predict-calories")
def predict_calories(data: NutritionInput):
    input_data = np.array(
        [[data.protein, data.lemak, data.karbohidrat, data.total_nutrisi]],
        dtype=np.float32
    )

    predicted_calories_per_100g = float(
        model.predict(input_data, verbose=0)[0][0]
    )

    predicted_calories_per_100g = max(predicted_calories_per_100g, 0)

    portion_calories = (data.gram / 100) * predicted_calories_per_100g

    return {
        "input": {
            "Protein": data.protein,
            "Lemak": data.lemak,
            "Karbohidrat": data.karbohidrat,
            "Total Nutrisi": data.total_nutrisi,
            "Gram": data.gram
        },
        "predicted_calories_per_100g": round(predicted_calories_per_100g, 2),
        "portion_calories": round(portion_calories, 2),
        "category": get_calorie_category(portion_calories)
    }
