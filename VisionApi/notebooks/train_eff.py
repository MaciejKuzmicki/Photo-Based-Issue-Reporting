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
EPOCHS = 5
BATCH_SIZE = 48
LEARNING_RATE = 1e-4

CATEGORIES = ["Słupy Elektryczne", "Uszkodzona droga", "Uszkodzony Znak", "Powalone drzewa", "Smieci", "Graffiti"]

train_transforms = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.5, 1.0)), 
    transforms.RandomPerspective(distortion_scale=0.3, p=0.5),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.RandomGrayscale(p=0.1), 
    transforms.GaussianBlur(kernel_size=(3, 3), sigma=(0.1, 1.0)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class BalancedUrbanDataset(Dataset):
    def __init__(self, json_file, img_dir, samples_per_class=10000, transform=None):
        with open(json_file, 'r', encoding='utf-8') as f:
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
            random.shuffle(paths)
            num_to_take = min(samples_per_class, len(paths))
            for i in range(num_to_take):
                self.final_samples.append((paths[i], self.class_to_idx[cat]))
                
        print(f"Załadowano {len(self.final_samples)} obrazów. Klasy: {self.class_to_idx}")

    def __len__(self):
        return len(self.final_samples)

    def __getitem__(self, idx):
        path, label = self.final_samples[idx]
        try:
            img = Image.open(os.path.join(self.img_dir, path)).convert('RGB')
            if self.transform:
                img = self.transform(img)
            return img, label
        except Exception as e:
            print(f"Błąd ładowania {path}: {e}")
            return self.__getitem__(random.randint(0, len(self)-1))

def get_efficientnet_model(num_classes):
    print("Inicjalizacja modelu EfficientNet-B0...")
    model = models.efficientnet_b0(weights='IMAGENET1K_V1')
    
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.2, inplace=True),
        nn.Linear(num_ftrs, num_classes)
    )
    return model.to(DEVICE)

def main():
    print(f"Urządzenie: {DEVICE}")

    train_dataset = BalancedUrbanDataset(TRAIN_JSON, IMG_DIR, samples_per_class=4000, transform=train_transforms)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True)

    test_dataset = BalancedUrbanDataset(TEST_JSON, IMG_DIR, samples_per_class=1000, transform=test_transforms)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

    model = get_efficientnet_model(len(CATEGORIES))
    
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=0.01)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1) # Label smoothing poprawia generalizację
    
    scheduler = optim.lr_scheduler.OneCycleLR(
        optimizer, max_lr=LEARNING_RATE*10, 
        steps_per_epoch=len(train_loader), 
        epochs=EPOCHS
    )

    best_acc = 0.0

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        
        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            scheduler.step()
            
            running_loss += loss.item()
            
            if (i + 1) % 50 == 0:
                print(f"E{epoch+1} [{i+1}/{len(train_loader)}] Loss: {loss.item():.4f}")

        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(DEVICE), labels.to(DEVICE)
                outputs = model(images)
                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        accuracy = 100 * correct / total
        print(f"\n--- Epoka {epoch+1} zakończona | Acc: {accuracy:.2f}% | Avg Loss: {running_loss/len(train_loader):.4f} ---")

        if accuracy > best_acc:
            best_acc = accuracy
            torch.save(model.state_dict(), "Best_EfficientNet_B0.pth")
            print("Zapisano najlepszy model!")

    print(f"Trening ukończony. Najlepszy wynik: {best_acc:.2f}%")

if __name__ == '__main__':
    main()