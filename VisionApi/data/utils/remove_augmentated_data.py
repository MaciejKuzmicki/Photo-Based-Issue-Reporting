import os

# --- KONFIGURACJA ---
# Ścieżka do folderu ze zdjęciami
TARGET_DIR = ".../augmented_images"  # <-- Zmień na swoją ścieżkę

def remove_duplicate_basenames(directory):
    if not os.path.exists(directory):
        print(f"BŁĄD: Folder {directory} nie istnieje!")
        return

    seen_basenames = set()
    removed_count = 0
    files_processed = 0

    files = os.listdir(directory)
    
    print(f"Rozpoczynam analizę {len(files)} plików...")

    for filename in files:
        file_path = os.path.join(directory, filename)
        if not os.path.isfile(file_path):
            continue
            
        files_processed += 1
  
        basename = filename.split('.')[0]

        if basename in seen_basenames:
            try:
                os.remove(file_path)
                print(f"Usunięto duplikat: {filename} (bazowa nazwa: {basename})")
                removed_count += 1
            except Exception as e:
                print(f"Nie udało się usunąć {filename}: {e}")
        else:
            seen_basenames.add(basename)

    print("\n--- PODSUMOWANIE ---")
    print(f"Przeanalizowano plików: {files_processed}")
    print(f"Usunięto duplikatów: {removed_count}")
    print(f"Pozostało unikalnych nazw: {len(seen_basenames)}")

if __name__ == "__main__":
    remove_duplicate_basenames(TARGET_DIR)