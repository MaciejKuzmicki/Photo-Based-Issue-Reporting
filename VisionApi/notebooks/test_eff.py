import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import os
import torch.nn.functional as F
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "Best_EfficientNet_B0.pth"
IMG_DIR = "../data/finaltestimages"
LABELS_JSON = "../data/labels/final_test_map.json"
RESULTS_JSON = "results_efficientnet.json"

CATEGORIES = ["Słupy Elektryczne", "Uszkodzona droga", "Uszkodzony Znak", "Powalone drzewa", "Smieci", "Graffiti"]

TRANSLATE_MAP = {
    "FallenTrees": "Powalone drzewa",
    "Graffitti": "Graffiti",
    "DamagedRoad": "Uszkodzona droga",
    "Garbage": "Smieci",
    "DamagedRoadSigns": "Uszkodzony Znak",
    "DamagedElectricalPoles": "Słupy Elektryczne"
}

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_model_eff(path, num_classes):
    model = models.efficientnet_b0(weights=None)
    num_ftrs = model.classifier[1].in_features
    
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(num_ftrs, num_classes)
    )
    
    model.load_state_dict(torch.load(path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

def run_analysis():
    if not os.path.exists(IMG_DIR) or not os.path.exists(LABELS_JSON):
        print(f"Błąd: Nie znaleziono katalogu {IMG_DIR} lub pliku {LABELS_JSON}")
        return

    model = load_model_eff(MODEL_PATH, len(CATEGORIES))
    
    with open(LABELS_JSON, 'r', encoding='utf-8') as f:
        true_labels_map = json.load(f)

    y_true = []
    y_pred = []
    results_details = []

    print(f"\n{'Plik':<30} | {'Przewidywana':<18} | {'Prawdziwa':<18} | {'Pewność'}")
    print("-" * 100)

    with torch.no_grad():
        for img_name, raw_true_class in true_labels_map.items():
            img_path = os.path.join(IMG_DIR, img_name)
            if not os.path.exists(img_path):
                print(f"Pominięto: {img_name} (brak pliku)")
                continue
            
            true_class = TRANSLATE_MAP.get(raw_true_class, raw_true_class)
            
            img = Image.open(img_path).convert('RGB')
            img_tensor = test_transforms(img).unsqueeze(0).to(DEVICE)

            outputs = model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            conf, class_idx = torch.max(probabilities, 0)
            
            predicted_class = CATEGORIES[class_idx.item()]
            conf_val = conf.item() * 100
            
            y_true.append(true_class)
            y_pred.append(predicted_class)

            is_correct = (predicted_class == true_class)
            status = "OK" if is_correct else "BŁĄD"
            
            print(f"{img_name:<30} | {predicted_class:<18} | {true_class:<18} | {conf_val:>6.2f}% [{status}]")

            results_details.append({
                "plik": img_name,
                "przewidywana": predicted_class,
                "prawdziwa": true_class,
                "pewnosc": round(conf_val, 2),
                "poprawnie": is_correct
            })

    with open(RESULTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(results_details, f, indent=4, ensure_ascii=False)

    plt.figure(figsize=(12, 10))
    cm = confusion_matrix(y_true, y_pred, labels=CATEGORIES)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=CATEGORIES, yticklabels=CATEGORIES)
    plt.title('Macierz Pomyłek - EfficientNet-B0')
    plt.ylabel('Klasa Prawdziwa')
    plt.xlabel('Klasa Przewidziana')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('confusion_matrix_eff.png')
    
    total = len(results_details)
    correct = sum(1 for r in results_details if r['poprawnie'])
    accuracy = (correct / total) * 100 if total > 0 else 0
    
    print("-" * 100)
    print(f"ANALIZA ZAKOŃCZONA")
    print(f"Skuteczność: {accuracy:.2f}% ({correct}/{total})")
    print(f"Szczegóły zapisano w: {RESULTS_JSON}")
    print(f"Macierz pomyłek zapisano jako: confusion_matrix_eff.png")

if __name__ == "__main__":
    run_analysis()