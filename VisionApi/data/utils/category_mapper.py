import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.absolute()

BASE_DIR = SCRIPT_DIR.parent

BASE_IMG_DIR = BASE_DIR / "images"
OUTPUT_DIR = BASE_DIR / "labels"

def generate_split_maps(img_dir, out_dir):
    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        print(f"Folder na JSONy: {out_dir}")
    except PermissionError:
        print(f"BŁĄD: Brak uprawnień do zapisu w {out_dir}.")
        print("Spróbuj uruchomić terminal jako Administrator lub zmień uprawnienia folderu.")
        return

    train_data = {}
    test_data = {}

    if not img_dir.exists():
        print(f"BŁĄD: Folder ze zdjęciami nie istnieje pod adresem: {img_dir}")
        return

    categories = [d.name for d in img_dir.iterdir() if d.is_dir()]

    for cat in categories:
        cat_path = img_dir / cat
        
        for subset in ['train', 'test']:
            subset_path = cat_path / subset
            if subset_path.exists():
                files = [f.name for f in subset_path.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                
                for f in files:
                    relative_img_path = f"{cat}/{subset}/{f}"
                    if subset == 'train':
                        train_data[relative_img_path] = cat
                    else:
                        test_data[relative_img_path] = cat

    with open(out_dir / 'train_map.json', 'w', encoding='utf-8') as f:
        json.dump(train_data, f, indent=4, ensure_ascii=False)
    
    with open(out_dir / 'test_map.json', 'w', encoding='utf-8') as f:
        json.dump(test_data, f, indent=4, ensure_ascii=False)

    print(f"\nSukces!")
    print(f"Zmapowano do treningu: {len(train_data)} zdjęć")
    print(f"Zmapowano do testów: {len(test_data)} zdjęć")

if __name__ == "__main__":
    generate_split_maps(BASE_IMG_DIR, OUTPUT_DIR)