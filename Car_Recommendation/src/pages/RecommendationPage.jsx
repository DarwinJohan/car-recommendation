"use client";
import { useState } from "react";
import "./RecommendationPage.css";

export default function RecommendationPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [images, setImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    setImages({});

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });
      const cars = await res.json();

      if (cars.error) {
        console.error("Error from recommend API:", cars.error);
        setIsLoading(false);
        return;
      }

      setResults(cars);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recommendation-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-title-highlight">Car</span> Recommendation
          </h2>
          <p className="section-subtitle">
            Describe your needs and we'll find the perfect vehicle for you
          </p>
        </div>

        <div className="recommendation-input-group">
          <textarea
            placeholder="Example: 'I need a fuel-efficient family car under $30k with good safety ratings'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="recommendation-textarea"
            rows={5}
          />
          <button 
            className="button hero-cta-button" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Find My Car"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="results-grid">
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

        )}
      </div>
    </div>
  );
}
