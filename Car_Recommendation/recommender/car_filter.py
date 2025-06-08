import sys
import pandas as pd
import json

df = pd.read_csv("car.csv")

def recommend_car_from_filters(filter_json):
    filters = json.loads(filter_json)
    filtered_df = df.copy()

    if filters.get("fuel"):
        filtered_df = filtered_df[filtered_df["Fuel Type"] == filters["fuel"]]
    if filters.get("transmission"):
        filtered_df = filtered_df[filtered_df["Transmission"] == filters["transmission"]]
    if filters.get("seats"):
        filtered_df = filtered_df[filtered_df["Seating Capacity"] == int(filters["seats"])]
    if filters.get("color"):
        filtered_df = filtered_df[filtered_df["Color"].str.lower() == filters["color"].lower()]

    if filters.get("price"):
        if ">" in filters["price"]:
            min_price = int(filters["price"].replace(">", ""))
            filtered_df = filtered_df[filtered_df["Price"] > min_price]
        elif "<" in filters["price"]:
            max_price = int(filters["price"].replace("<", ""))
            filtered_df = filtered_df[filtered_df["Price"] < max_price]

    if filters.get("owner"):
        filtered_df = filtered_df[filtered_df["Owner"] == filters["owner"]]


    result = filtered_df[["Make", "Model", "Fuel Type", "Transmission", "Seating Capacity", "Color", "Price", "Owner"]]
    return result.head(5).to_json(orient="records")

if __name__ == "__main__":
    input_json = sys.argv[1]
    output = recommend_car_from_filters(input_json)
    print(output)
