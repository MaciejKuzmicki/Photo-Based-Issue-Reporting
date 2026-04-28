from PIL import Image
from PIL.PngImagePlugin import PngInfo
import os

def add_gps_png_final_attempt(file_path, lat, lon):
    img = Image.open(file_path)
    metadata = PngInfo()

    metadata.add_text("GPS Latitude", f"{lat:.6f}")
    metadata.add_text("GPS Longitude", f"{lon:.6f}")
    metadata.add_text("Comment", f"GPS: {lat}, {lon}")
    
    directory = os.path.dirname(file_path)
    new_name = "FIXED_LOCATION_" + os.path.basename(file_path)
    new_path = os.path.join(directory, new_name)

    img.save(new_path, "PNG", pnginfo=metadata)
    print(f"Utworzono: {new_path}")
    print("WAŻNE: Sprawdź ten konkretny plik, nie oryginał!")

# Użycie
add_gps_png_final_attempt("../finaltestimages/Gemini_Generated_Image_Electrical_Damaged.png", 52.241517, 21.031023)