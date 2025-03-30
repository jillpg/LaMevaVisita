import pandas as pd

# Cargar el archivo Excel
file_path = 'Base Flujo asistencial.xlsx'
df = pd.read_excel(file_path, sheet_name='malestares')

# Agrupar por las columnas 'TIPUS', 'ESPEC', 'CONDy', 'MM'
grouped = df.groupby(['TIPUS', 'ESPEC', 'COND', 'MM'])

# Crear un diccionario jerárquico
result_dict = {}

for (tipus, espec, condy, mm), group in grouped:
    # Para cada grupo, agregamos las filas restantes a la jerarquía
    group_dict = group.drop(columns=['TIPUS', 'ESPEC', 'COND', 'MM']).to_dict(orient='records')
    
    # Crear la estructura jerárquica
    if tipus not in result_dict:
        result_dict[tipus] = {}
    if espec not in result_dict[tipus]:
        result_dict[tipus][espec] = {}
    if condy not in result_dict[tipus][espec]:
        result_dict[tipus][espec][condy] = {}
    if mm not in result_dict[tipus][espec][condy]:
        result_dict[tipus][espec][condy][mm] = []

    # Añadir las filas del grupo al lugar correspondiente en la jerarquía
    result_dict[tipus][espec][condy][mm] = group_dict

# Convertir el diccionario resultante a JSON
import json
result_json = json.dumps(result_dict, ensure_ascii=False, indent=4)

# Guardar el archivo JSON
with open('malestares.json', 'w', encoding='utf-8') as f:
    f.write(result_json)

print("El archivo JSON jerárquico ha sido creado con éxito.")


import pandas as pd

# Cargar el archivo Excel
file_path = 'Base Flujo asistencial.xlsx'
df = pd.read_excel(file_path, sheet_name='Altres')

# Agrupar por las columnas 'TIPUS', 'ESPEC', 'CONDy', 'MM'
grouped = df.groupby(['TIPUS', 'ESPEC'])

# Crear un diccionario jerárquico
result_dict = {}

for (tipus, espec), group in grouped:
    # Para cada grupo, agregamos las filas restantes a la jerarquía
    group_dict = group.drop(columns=['TIPUS', 'ESPEC']).to_dict(orient='records')
    
    # Crear la estructura jerárquica
    if tipus not in result_dict:
        result_dict[tipus] = {}
    if espec not in result_dict[tipus]:
        result_dict[tipus][espec] = {}
  

    # Añadir las filas del grupo al lugar correspondiente en la jerarquía
    result_dict[tipus][espec] = group_dict

# Convertir el diccionario resultante a JSON
import json
result_json = json.dumps(result_dict, ensure_ascii=False, indent=4)

# Guardar el archivo JSON
with open('altres.json', 'w', encoding='utf-8') as f:
    f.write(result_json)

print("El archivo JSON jerárquico ha sido creado con éxito.")


