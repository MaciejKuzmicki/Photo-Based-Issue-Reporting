import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import os
import torch.nn.functional as F
import json
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "Best_Model.pth"
IMG_DIR = "../data/finaltestimages"
LABELS_JSON = "../data/labels/final_test_map.json"
RESULTS_JSON = "results.json"

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

def load_model(path, num_classes):
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    model.load_state_dict(torch.load(path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model

def run_full_analysis(threshold_to_show=50.0):
    if not os.path.exists(IMG_DIR) or not os.path.exists(LABELS_JSON):
        print("Błąd: Sprawdź ścieżki!")
        return

    model = load_model(MODEL_PATH, len(CATEGORIES))
    with open(LABELS_JSON, 'r', encoding='utf-8') as f:
        true_labels_map = json.load(f)

    y_true = []
    y_pred = []
    results_details = []
    raw_stats = []

    print(f"{'Plik':<25} | {'Przewidywana':<18} | {'Prawdziwa':<18} | {'Pewność'}")
    print("-" * 95)

    with torch.no_grad():
        for img_name, raw_true_class in true_labels_map.items():
            img_path = os.path.join(IMG_DIR, img_name)
            if not os.path.exists(img_path): continue
            
            true_class = TRANSLATE_MAP.get(raw_true_class, raw_true_class)
            img = Image.open(img_path).convert('RGB')
            img_tensor = test_transforms(img).unsqueeze(0).to(DEVICE)

            outputs = model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            conf, class_idx = torch.max(probabilities, 0)
            
            predicted_class = CATEGORIES[class_idx]
            conf_val = conf.item() * 100
            
            y_true.append(true_class)
            y_pred.append(predicted_class)

            status = "OK" if predicted_class == true_class else "BŁĄD"
            print(f"{img_name:<25} | {predicted_class:<18} | {true_class:<18} | {conf_val:>6.2f}% [{status}]")

            results_details.append({
                "plik": img_name, "przewidywana": predicted_class, "prawdziwa": true_class,
                "pewnosc": conf_val, "poprawnie": predicted_class == true_class
            })
            raw_stats.append({"conf": conf_val, "correct": predicted_class == true_class})

    cm = confusion_matrix(y_true, y_pred, labels=CATEGORIES)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CATEGORIES, yticklabels=CATEGORIES)
    plt.title('Macierz Pomyłek (Confusion Matrix)')
    plt.ylabel('Klasa Prawdziwa')
    plt.xlabel('Klasa Przewidziana')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    print("\nWygenerowano: confusion_matrix.png")

    thresholds = np.arange(0, 101, 1)
    accuracies, coverages = [], []
    for t in thresholds:
        filtered = [p for p in raw_stats if p['conf'] >= t]
        acc = (sum(1 for p in filtered if p['correct']) / len(filtered)) * 100 if filtered else 100.0
        cov = (len(filtered) / len(raw_stats)) * 100
        accuracies.append(acc)
        coverages.append(cov)

    plt.figure(figsize=(10, 6))
    plt.plot(thresholds, accuracies, 'g-', label='Celność (Accuracy)')
    plt.plot(thresholds, coverages, 'b--', label='Pokrycie (Coverage)')
    plt.axvline(x=threshold_to_show, color='r', linestyle=':', label=f'Próg {threshold_to_show}%')
    plt.legend(); plt.grid(True); plt.savefig('wykres_progu.png')

    total = len(results_details)
    correct_total = sum(1 for r in results_details if r['poprawnie'])
    print(f"\nSKUTECZNOŚĆ BEZ PROGU: {correct_total/total*100:.2f}% ({correct_total}/{total})")

if __name__ == "__main__":
    run_full_analysis(threshold_to_show=50.0)