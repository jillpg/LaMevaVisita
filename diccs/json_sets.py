import unicodedata
import pandas as pd

def normalize_text(text):
    return text.lower()

def extract_unique_values(file_path, sheet_name, column_name):
    # Leer el archivo en un DataFrame desde la hoja especificada
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    # Verificar si la columna existe
    if column_name not in df.columns:
        print(f"La columna '{column_name}' no existe en la hoja '{sheet_name}'.")
        return None
    
    unique_values = set()
    for value in df[column_name].dropna():
        normalized_values = [normalize_text(v.strip()) for v in str(value).replace(', ', ' o ').split(' o ')]
        unique_values.update(normalized_values)
    
    # Crear diccionario con IDs
    unique_dict = {value: idx for idx, value in enumerate(sorted(unique_values), start=1)}
    
    # Guardar en un archivo JSON con el nombre de la columna
    output_filename = f"diccs/{sheet_name}_{column_name}_v2.json"
    pd.Series(unique_dict).to_json(output_filename, indent=4, force_ascii=False)
    print(f"Diccionario guardado en {output_filename}")

    return unique_dict

# Ejemplo de uso
file_path = "diccs/Base Flujo asistencial.xlsx"  # Archivo Excel
sheets = ["Altres", "malestares"]  # Hojas a analizar
columns = ["PROF", "COM", "T_VISITA"]  # Columnas a analizar

for sheet in sheets:
    for column in columns:
        extract_unique_values(file_path, sheet, column)
