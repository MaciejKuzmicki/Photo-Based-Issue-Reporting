import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
import json
import os
import random

BASE_DIR = os.path.abspath(os.path.join(os.getcwd(), ".."))
IMG_DIR = os.path.join(BASE_DIR, 'data/images')
TRAIN_JSON = os.path.join(BASE_DIR, 'data/labels', 'train_map.json')
TEST_JSON = os.path.join(BASE_DIR, 'data/labels', 'test_map.json') 

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

train_transforms = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.4, 1.0)), 
    transforms.RandomPerspective(distortion_scale=0.3, p=0.5),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.2),
    transforms.RandomGrayscale(p=0.1), 
    transforms.GaussianBlur(kernel_size=(3, 5), sigma=(0.1, 2.0)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

TRANSLATE_MAP = {
    "FallenTrees": "Powalone drzewa",
    "Graffitti": "Graffiti",
    "DamagedRoad": "Uszkodzona droga",
    "Garbage": "Smieci",
    "DamagedRoadSigns": "Uszkodzony Znak",
    "DamagedElectricalPoles": "Słupy Elektryczne"
}

CATEGORIES = ["Słupy Elektryczne", "Uszkodzona droga", "Uszkodzony Znak", "Powalone drzewa", "Smieci", "Graffiti"]

class BalancedUrbanDataset(Dataset):
    def __init__(self, json_file, img_dir, samples_per_class=4000, transform=None):
        with open(json_file, 'r') as f:
            full_map = json.load(f)
        
        self.img_dir = img_dir
        self.transform = transform
        
        cat_to_paths = {}
        for path, cat in full_map.items():
            if cat not in cat_to_paths: cat_to_paths[cat] = []
            cat_to_paths[cat].append(path)
        
        self.categories = sorted(list(cat_to_paths.keys()))
        self.class_to_idx = {cat: i for i, cat in enumerate(self.categories)}
        
        self.final_samples = []
        for cat in self.categories:
            paths = cat_to_paths.get(cat, [])
            if not paths: continue
            
            for i in range(samples_per_class):
                chosen_path = paths[i % len(paths)]
                self.final_samples.append((chosen_path, self.class_to_idx[cat]))
                
        print(f"Załadowano {len(self.final_samples)} obrazów (wyrównano do {samples_per_class} na klasę).")

    def __len__(self):
        return len(self.final_samples)

    def __getitem__(self, idx):
        path, label = self.final_samples[idx]
        img = Image.open(os.path.join(self.img_dir, path)).convert('RGB')
        if self.transform:
            img = self.transform(img)
        return img, label

def get_model(num_classes):
    model = models.resnet18(weights='IMAGENET1K_V1')
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, num_classes)
    return model.to(DEVICE)

def quick_private_test(model, device, categories, labels_json, img_dir, translate_map):
    model.eval()
    t = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    with open(labels_json, 'r', encoding='utf-8') as f:
        true_labels_map = json.load(f)

    correct_count = 0
    total = len(true_labels_map)

    with torch.no_grad():
        for img_name, raw_true_class in true_labels_map.items():
            img_path = os.path.join(img_dir, img_name)
            if not os.path.exists(img_path): continue
            
            true_class = translate_map.get(raw_true_class, raw_true_class)
            img = Image.open(img_path).convert('RGB')
            img_tensor = t(img).unsqueeze(0).to(device)

            outputs = model(img_tensor)
            _, predicted_idx = torch.max(outputs, 1)
            if categories[predicted_idx.item()] == true_class:
                correct_count += 1
                
    model.train()
    return correct_count, total

def main():
    print(f"Praca na urządzeniu: {DEVICE}")

    train_dataset = BalancedUrbanDataset(TRAIN_JSON, IMG_DIR, samples_per_class=4100, transform=train_transforms)
    train_loader = DataLoader(
        train_dataset, 
        batch_size=80, 
        shuffle=True, 
        pin_memory=True, 
        num_workers=6
    )

    test_dataset = BalancedUrbanDataset(TEST_JSON, IMG_DIR, samples_per_class=600, transform=test_transforms)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False, num_workers=6)

    num_classes = len(train_dataset.categories)
    model = get_model(num_classes)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.000005, weight_decay=0.01)

    print(f"\nRozpoczynam trening: {len(train_dataset)} obrazów, {num_classes} klas.")
    best_accuracy = 0.0
    epochs = 5

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        
        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            
            if (i + 1) % 40 == 0: 
                processed_images = (i + 1) * images.size(0)
                total_images = len(train_loader.dataset)
                progress = 100 * (i + 1) / len(train_loader)
                
                print(f"Batch [{i+1}/{len(train_loader)}] | "
                      f"Progress: {progress:.1f}% | "
                      f"Loss: {loss.item():.4f} | "
                      f"Img: {processed_images}/{total_images}")
        
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        test_acc = 100 * correct / total
        avg_loss = running_loss / len(train_loader)
        
        print(f"\n>>> Epoka [{epoch+1}/{epochs}] | Avg Loss: {avg_loss:.4f} | Test Acc: {test_acc:.2f}%")
        
        if test_acc > best_accuracy:
            best_accuracy = test_acc
            torch.save(model.state_dict(), "Best_Model.pth")
            print(f"  *** ZAPISANO NOWY NAJLEPSZY MODEL! (Acc: {best_accuracy:.2f}%) ***\n")

            correct, total = quick_private_test(
                model, DEVICE, CATEGORIES, 
                '../data/labels/final_test_map.json', 
                '../data/finaltestimages',
                TRANSLATE_MAP
            )
            accuracy = (correct / total) * 100 if total > 0 else 0
            print(f"   SKUTECZNOŚĆ KOŃCOWA: {accuracy:.2f}% ({correct}/{total})\n")

    torch.save(model.state_dict(), "Final_Model.pth")
    print(f"\nTrening zakończony. Najlepsza celność: {best_accuracy:.2f}%")

if __name__ == '__main__':
    main()