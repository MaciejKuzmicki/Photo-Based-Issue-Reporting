import torch
import torch.nn as nn
import torch.nn.functional as F
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from torchvision import models, transforms
from typing import Optional

app = FastAPI(title="Multi-Model Prediction Server")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CATEGORIES = ["Słupy Elektryczne", "Uszkodzona droga", "Uszkodzony Znak", "Powalone drzewa", "Smieci", "Graffiti"]
NUM_CLASSES = len(CATEGORIES)

MODEL_PATHS = {
    "resnet18": "Best_Model_R18.pth",
    "resnet50": "Best_Model_R50.pth",
    "efficientnet": "Best_Model_EffNet.pth"
}

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

loaded_models = {}

def get_model(model_name: str):
    if model_name in loaded_models:
        return loaded_models[model_name]
    
    path = MODEL_PATHS.get(model_name)
    if not path or not torch.os.path.exists(path):
        raise ValueError(f"Brak wag dla modelu: {model_name}")

    print(f"Ładowanie modelu {model_name}...")
    
    if model_name == "resnet18":
        model = models.resnet18(weights=None)
        model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
    elif model_name == "resnet50":
        model = models.resnet50(weights=None)
        model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
    elif model_name == "efficientnet":
        model = models.efficientnet_b0(weights=None)
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
    else:
        raise ValueError("Nieobsługiwana architektura")

    model.load_state_dict(torch.load(path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    
    loaded_models[model_name] = model
    return model

class PredictionRequest(BaseModel):
    url: str
    model_type: Optional[str] = "resnet50"

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        model = get_model(request.model_type)
        
        response = requests.get(request.url, timeout=10)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        
        img_tensor = test_transforms(img).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            conf, class_idx = torch.max(probabilities, 0)
        
        return {
            "model_used": request.model_type,
            "category": CATEGORIES[class_idx],
            "confidence": round(conf.item() * 100, 2),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    try: get_model("resnet50") 
    except: print("Ostrzeżenie: Nie udało się załadować domyślnego modelu przy starcie.")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)