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

def extract_filters(text):
    filters = {}
    text = text.lower()

    # Fuel Type
    for fuel in ["petrol", "diesel", "electric", "cng", "lpg"]:
        if fuel in text:
            filters["Fuel Type"] = fuel.capitalize()
            break

    # Transmission
    for trans in ["automatic", "manual"]:
        if trans in text:
            filters["Transmission"] = trans.capitalize()
            break

    # Seating Capacity
    match = re.search(r"(\d+)[ ]?seats?", text)
    if match:
        filters["Seating Capacity"] = int(match.group(1))

    # Color
    for color in df["Color"].dropna().unique():
        if color.lower() in text:
            filters["Color"] = color
            break

    # Owner
    for owner in df["Owner"].dropna().unique():
        if owner.lower() in text:
            filters["Owner"] = owner
            break

    # Seller Type
    for seller in df["Seller Type"].dropna().unique():
        if seller.lower() in text:
            filters["Seller Type"] = seller
            break

    # Drivetrain
    for drive in df["Drivetrain"].dropna().unique():
        if drive.lower() in text:
            filters["Drivetrain"] = drive
            break

    # Location
    for loc in df["Location"].dropna().unique():
        if loc.lower() in text:
            filters["Location"] = loc
            break

    # Make
    for make in df["Make"].dropna().unique():
        if make.lower() in text:
            filters["Make"] = make
            break

    # Model
    for model in df["Model"].dropna().unique():
        if model.lower() in text:
            filters["Model"] = model
            break

    # Engine (e.g., 1197 cc)
    match = re.search(r"(\d{3,5})\s?cc", text)
    if match:
        filters["Engine"] = f"{match.group(1)} cc"

    # Max Power (e.g., 83 bhp)
    match = re.search(r"(\d{2,3})\s?bhp", text)
    if match:
        filters["Max Power"] = f"{match.group(1)} bhp"

    # Max Torque (e.g., 113Nm)
    match = re.search(r"(\d{2,4})\s?nm", text)
    if match:
        filters["Max Torque"] = f"{match.group(1)}Nm"

    # Fuel Tank Capacity (e.g., 35 litres)
    match = re.search(r"(\d{1,2})\s?(litres|liter|l)", text)
    if match:
        filters["Fuel Tank Capacity"] = float(match.group(1))

    # Year
    match = re.search(r"(19|20)\d{2}", text)
    if match:
        filters["Year"] = int(match.group(0))

    # Kilometer (e.g., below 50000 km)
    match = re.search(r"(?:under|less than|below|<)\s?([\d,\.]+)\s?(km|kilometers?)", text)
    if match:
        filters["Kilometer"] = int(re.sub(r"[^\d]", "", match.group(1)))

    # Price (e.g., under Rp 1000000)
    match = re.search(r"(?:under|below|less than|<)\s?rp[\s\.]?(?:[\d.,]+)", text)
    if match:
        price = re.sub(r"[^\d]", "", match.group(0))
        if price:
            filters["Price"] = int(price)

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
