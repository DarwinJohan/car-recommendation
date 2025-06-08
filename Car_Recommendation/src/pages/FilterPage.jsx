"use client";
import { useState } from "react";
import "./FilterPage.css";

export default function FilterPage() {
  const [filters, setFilters] = useState({
    fuel: "",
    transmission: "",
    seats: "",
    color: "",
    priceOption: "more",  // pilihannya: more or less
    priceValue: "",       // input harga dinamis
    owner: "",
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
      });
      const cars = await res.json();
      setResults(cars);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="recommendation-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Car <span className="section-title-highlight">Recommendation</span>
          </h2>
          <p className="section-subtitle">Filter cars based on your preferences</p>
        </div>

        <div className="recommendation-form">
          <select
            name="fuel"
            className="recommendation-select"
            value={filters.fuel}
            onChange={handleChange}
          >
            <option value="">Any Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>

          <select
            name="transmission"
            className="recommendation-select"
            value={filters.transmission}
            onChange={handleChange}
          >
            <option value="">Any Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input
            type="number"
            name="seats"
            className="recommendation-input"
            placeholder="Seats"
            value={filters.seats}
            onChange={handleChange}
          />

          <input
            type="text"
            name="color"
            className="recommendation-input"
            placeholder="Color"
            value={filters.color}
            onChange={handleChange}
          />

          <div className="price-filter-group">
            <select
              name="priceOption"
              className="recommendation-dropdown"
              value={filters.priceOption}
              onChange={handleChange}
            >
              <option value="more">More Than</option>
              <option value="less">Less Than</option>
            </select>

            </div>
            <input
              type="number"
              name="priceValue"
              className="recommendation-input"
              placeholder="Enter Price"
              value={filters.priceValue}
              onChange={handleChange}
              min="0"
            />
          

          <select
            name="owner"
            className="recommendation-select"
            value={filters.owner}
            onChange={handleChange}
          >
            <option value="">Any Owner</option>
            <option value="First">First</option>
            <option value="Second">Second</option>
          </select>
        </div>

        <button
          className="recommendation-button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Find Car"}
        </button>

        <div className="results-grid" style={{ marginTop: "3rem" }}>
          {results.map((car, i) => (
            <div key={i} className="car-card">
              <div className="car-header">
                <h3>{car.Make} {car.Model}</h3>
                <div className="car-price">$ {car.Price?.toLocaleString() || "-"}</div>
              </div>
              <div className="car-details">
                <div className="car-detail"><strong>Fuel:</strong> {car["Fuel Type"]}</div>
                <div className="car-detail"><strong>Transmission:</strong> {car.Transmission}</div>
                <div className="car-detail"><strong>Seats:</strong> {car["Seating Capacity"]}</div>
                <div className="car-detail"><strong>Owner:</strong> {car.Owner}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
