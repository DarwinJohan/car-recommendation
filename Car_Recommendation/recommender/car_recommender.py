# import pandas as pd
# import re
# from sentence_transformers import SentenceTransformer, util

# # Load CSV dan buat deskripsi
# df = pd.read_csv("car.csv")

# def create_description(row):
#     fuel = str(row.get('Fuel Type', '')).lower()
#     trans = str(row.get('Transmission', '')).lower()
#     seats = str(row.get('Seating Capacity', ''))
#     engine = str(row.get('Engine', ''))
#     power = str(row.get('Max Power', ''))
#     torque = str(row.get('Max Torque', ''))
#     drivetrain = str(row.get('Drivetrain', '')).upper()

#     return f"A {fuel} car with {trans} transmission, {seats} seats, {engine} engine, {power} power, {torque} torque, and {drivetrain} drivetrain."

# df["description"] = df.apply(create_description, axis=1)

# # Load model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# # Pre-encode semua deskripsi untuk efisiensi
# corpus = df["description"].tolist()
# corpus_embeddings = model.encode(corpus, convert_to_tensor=True)

# def extract_filters(text):
#     filters = {}
#     text = text.lower()

#     if "petrol" in text: filters["Fuel Type"] = "Petrol"
#     elif "diesel" in text: filters["Fuel Type"] = "Diesel"
#     elif "electric" in text: filters["Fuel Type"] = "Electric"
#     elif "cng" in text: filters["Fuel Type"] = "CNG"

#     if "automatic" in text: filters["Transmission"] = "Automatic"
#     elif "manual" in text: filters["Transmission"] = "Manual"

#     match = re.search(r"(\d+)[ ]?seats?", text)
#     if match:
#         filters["Seating Capacity"] = int(match.group(1))

#     return filters

# def recommend_car(user_input, top_n=5):
#     filters = extract_filters(user_input)
#     filtered_df = df.copy()

#     # Filter DataFrame berdasarkan filter yang di-extract
#     for key, value in filters.items():
#         filtered_df = filtered_df[filtered_df[key] == value]

#     # Jika hasil filter kosong, pakai semua data (corpus asli)
#     if filtered_df.empty:
#         filtered_df = df.copy()
#         embeddings = corpus_embeddings
#     else:
#         # Encode ulang embedding untuk subset data yang sudah difilter
#         embeddings = model.encode(filtered_df["description"].tolist(), convert_to_tensor=True)

#     # Encode query user
#     query_embedding = model.encode(user_input, convert_to_tensor=True)

#     # Hitung cosine similarity
#     scores = util.cos_sim(query_embedding, embeddings)[0]

#     # Ambil top N hasil terbaik
#     top_results = scores.topk(k=min(top_n, len(scores)))

#     return filtered_df.iloc[top_results.indices.tolist()][[
#         "Make", "Model", "Fuel Type", "Transmission", "Color", "Seating Capacity", "Engine", "Price", "Year"
#     ]]

# # Contoh panggilan fungsi (jika ingin test langsung di script)
# if __name__ == "__main__":
#     user_desc = "I want a diesel car with automatic transmission and 5 seats"
#     results = recommend_car(user_desc)
#     print(results.to_json(orient="records", indent=2))


import pandas as pd
import re
import os
import torch
from sentence_transformers import SentenceTransformer, util

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load CSV
df = pd.read_csv("car.csv")

# Cek apakah sudah ada kolom 'description'
if "description" not in df.columns:
    def create_description(row):
        fuel = str(row.get('Fuel Type', '')).lower()
        trans = str(row.get('Transmission', '')).lower()
        seats = str(row.get('Seating Capacity', ''))
        engine = str(row.get('Engine', ''))
        power = str(row.get('Max Power', ''))
        torque = str(row.get('Max Torque', ''))
        drivetrain = str(row.get('Drivetrain', '')).upper()

        return f"A {fuel} car with {trans} transmission, {seats} seats, {engine} engine, {power} power, {torque} torque, and {drivetrain} drivetrain."

    df["description"] = df.apply(create_description, axis=1)
    df.to_csv("car.csv", index=False)  # overwrite file with new 'description' column

# Load atau generate embeddings
if os.path.exists("embeddings.pt"):
    corpus_embeddings = torch.load("embeddings.pt")
else:
    corpus_embeddings = model.encode(df["description"].tolist(), convert_to_tensor=True)
    torch.save(corpus_embeddings, "embeddings.pt")

# Extract filter dari input
def extract_filters(text):
    filters = {}
    text = text.lower()

    if "petrol" in text: filters["Fuel Type"] = "Petrol"
    elif "diesel" in text: filters["Fuel Type"] = "Diesel"
    elif "electric" in text: filters["Fuel Type"] = "Electric"
    elif "cng" in text: filters["Fuel Type"] = "CNG"

    if "automatic" in text: filters["Transmission"] = "Automatic"
    elif "manual" in text: filters["Transmission"] = "Manual"

    match = re.search(r"(\d+)[ ]?seats?", text)
    if match:
        filters["Seating Capacity"] = int(match.group(1))

    return filters

# Fungsi utama untuk rekomendasi
def recommend_car(user_input, top_n=5):
    filters = extract_filters(user_input)
    filtered_df = df.copy()

    for key, value in filters.items():
        filtered_df = filtered_df[filtered_df[key] == value]

    if filtered_df.empty:
        used_df = df
        embeddings = corpus_embeddings
    else:
        used_df = filtered_df
        embeddings = model.encode(used_df["description"].tolist(), convert_to_tensor=True)

    query_embedding = model.encode(user_input, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, embeddings)[0]
    top_results = scores.topk(k=min(top_n, len(scores)))

    return used_df.iloc[top_results.indices.tolist()][[
        "Make", "Model", "Fuel Type", "Transmission", "Color", "Seating Capacity", "Engine", "Price", "Year"
    ]]

# Jika dijalankan langsung
if __name__ == "__main__":
    import sys
    user_input = sys.argv[1] if len(sys.argv) > 1 else "I want a petrol automatic car with 5 seats"
    results = recommend_car(user_input)
    print(results.to_json(orient="records", indent=2))
