from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

# Load trained model & vectorizer
model = pickle.load(open("disease_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# Input schema
class Input(BaseModel):
    text: str

# Symptom normalization map
SYMPTOM_MAP = {
    "fever": "high_fever",
    "high temperature": "high_fever",
    "headache": "headache",
    "vomiting": "vomiting",
    "throwing up": "vomiting",
    "nausea": "vomiting",
    "cough": "cough",
    "chest pain": "chest_pain",
    "stomach pain": "abdominal_pain",
    "belly pain": "abdominal_pain",
    "skin rash": "skin_rash",
    "itching": "itching",
    "joint pain": "joint_pain",
    "yellow skin": "yellowing_of_eyes",
    "yellow eyes": "yellowing_of_eyes",
    "shortness of breath": "breathlessness",
    "breathing difficulty": "breathlessness",
}

# Normalize human text → dataset symptoms
def normalize(text):
    text = text.lower()
    for human, dataset in SYMPTOM_MAP.items():
        text = text.replace(human, dataset)
    return text

# Boost important symptoms
def boost(text):
    important = [
        "high_fever",
        "vomiting",
        "chest_pain",
        "breathlessness",
        "abdominal_pain",
        "yellowing_of_eyes",
        "joint_pain",
        "skin_rash",
        "itching",
    ]
    for k in important:
        if k in text:
            text += " " + k
    return text


def sharpen(probs, temperature=0.3):
    probs = np.array(probs)
    logits = np.log(probs + 1e-9)
    scaled = logits / temperature
    exp = np.exp(scaled)
    return exp / exp.sum()


@app.post("/predict")
def predict(data: Input):
    clean = normalize(data.text)
    boosted = boost(clean)

    vec = vectorizer.transform([boosted])

    raw_probs = model.predict_proba(vec)[0]
    probs = sharpen(raw_probs)

    idx = probs.argmax()

    top3 = sorted(
        zip(model.classes_, probs),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    return {
        "disease": model.classes_[idx],
        "confidence": round(float(probs[idx]) * 100, 2),
        "top3": [
            {"disease": d, "confidence": round(float(p) * 100, 2)}
            for d, p in top3
        ]
    }
