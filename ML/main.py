from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel
from PIL import Image
import io
import json
import os
import pickle
import numpy as np
import torch
from torchvision import transforms, models

app = FastAPI()

# Load trained model & vectorizer
model = pickle.load(open("disease_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))


_img_checkpoint = None
_img_model = None
_img_classes = None


def _load_img_artifacts():
    global _img_checkpoint, _img_model, _img_classes
    if _img_model is not None and _img_classes is not None:
        return _img_model, _img_classes

    model_path = os.path.join(os.path.dirname(__file__), "img_model.pt")
    classes_path = os.path.join(os.path.dirname(__file__), "img_classes.json")

    if not os.path.exists(model_path) or not os.path.exists(classes_path):
        raise FileNotFoundError(
            "Image model not found. Train it first to generate ML/img_model.pt and ML/img_classes.json"
        )

    with open(classes_path, "r", encoding="utf-8") as f:
        _img_classes = json.load(f)

    _img_checkpoint = torch.load(model_path, map_location="cpu")
    num_classes = int(_img_checkpoint.get("num_classes", len(_img_classes)))
    arch = _img_checkpoint.get("arch", "resnet18")
    if arch != "resnet18":
        raise ValueError(f"Unsupported image model architecture: {arch}")

    weights = models.ResNet18_Weights.DEFAULT
    model = models.resnet18(weights=weights)
    in_features = model.fc.in_features
    model.fc = torch.nn.Linear(in_features, num_classes)
    model.load_state_dict(_img_checkpoint["state_dict"], strict=True)
    model.eval()
    _img_model = model
    return _img_model, _img_classes


def _img_transform(img_size: int):
    return transforms.Compose(
        [
            transforms.Resize(img_size + 32),
            transforms.CenterCrop(img_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

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
        ],
        "inputs": data.text,
        "predictions": [
            {"disease": d, "confidence": round(float(p) * 100, 2)}
            for d, p in top3
        ],
    }


@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    try:
        model, classes = _load_img_artifacts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        img = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")

    img_size = int(_img_checkpoint.get("img_size", 224)) if _img_checkpoint else 224
    x = _img_transform(img_size)(img).unsqueeze(0)

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).squeeze(0)
        topk = min(3, probs.numel())
        vals, idxs = torch.topk(probs, k=topk)

    preds = []
    for v, i in zip(vals.tolist(), idxs.tolist()):
        name = classes[i] if i < len(classes) else str(i)
        preds.append({"disease": name, "confidence": round(float(v) * 100, 2)})

    best = preds[0] if preds else {"disease": None, "confidence": 0.0}
    return {
        "disease": best["disease"],
        "confidence": best["confidence"],
        "predictions": preds,
    }
