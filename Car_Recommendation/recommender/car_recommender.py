import pandas as pd
import re
import os
import torch
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

df = pd.read_csv("car.csv")

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
    df.to_csv("car.csv", index=False)  

if os.path.exists("embeddings.pt"):
    corpus_embeddings = torch.load("embeddings.pt")
else:
    corpus_embeddings = model.encode(df["description"].tolist(), convert_to_tensor=True)
    torch.save(corpus_embeddings, "embeddings.pt")

def extract_filters(text):
    filters = {}
    text = text.lower()

    for fuel in ["petrol", "diesel", "electric", "cng", "lpg"]:
        if fuel in text:
            filters["Fuel Type"] = fuel.capitalize()
            break

    for trans in ["automatic", "manual"]:
        if trans in text:
            filters["Transmission"] = trans.capitalize()
            break

    match = re.search(r"(\d+)[ ]?seats?", text)
    if match:
        filters["Seating Capacity"] = int(match.group(1))

    for color in df["Color"].dropna().unique():
        if color.lower() in text:
            filters["Color"] = color
            break

    for owner in df["Owner"].dropna().unique():
        if owner.lower() in text:
            filters["Owner"] = owner
            break

    for seller in df["Seller Type"].dropna().unique():
        if seller.lower() in text:
            filters["Seller Type"] = seller
            break

    for drive in df["Drivetrain"].dropna().unique():
        if drive.lower() in text:
            filters["Drivetrain"] = drive
            break

    for loc in df["Location"].dropna().unique():
        if loc.lower() in text:
            filters["Location"] = loc
            break

    for make in df["Make"].dropna().unique():
        if make.lower() in text:
            filters["Make"] = make
            break

    for model in df["Model"].dropna().unique():
        if model.lower() in text:
            filters["Model"] = model
            break

    match = re.search(r"(\d{3,5})\s?cc", text)
    if match:
        filters["Engine"] = f"{match.group(1)} cc"

    match = re.search(r"(\d{2,3})\s?bhp", text)
    if match:
        filters["Max Power"] = f"{match.group(1)} bhp"

    match = re.search(r"(\d{2,4})\s?nm", text)
    if match:
        filters["Max Torque"] = f"{match.group(1)}Nm"

    match = re.search(r"(\d{1,2})\s?(litres|liter|l)", text)
    if match:
        filters["Fuel Tank Capacity"] = float(match.group(1))

    match = re.search(r"(19|20)\d{2}", text)
    if match:
        filters["Year"] = int(match.group(0))

    match = re.search(r"(?:under|less than|below|<)\s?([\d,\.]+)\s?(km|kilometers?)", text)
    if match:
        filters["Kilometer"] = int(re.sub(r"[^\d]", "", match.group(1)))

    match = re.search(r"(?:under|below|less than|<)\s?rp[\s\.]?(?:[\d.,]+)", text)
    if match:
        price = re.sub(r"[^\d]", "", match.group(0))
        if price:
            filters["Price"] = int(price)

    return filters


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
