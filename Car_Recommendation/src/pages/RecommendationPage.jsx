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
              <div key={i} className="feature-card car-card">
                <div className="car-header">
                  <h3 className="feature-card-title">
                    {car.Make} {car.Model}
                  </h3>
                  <span className="car-price">${car.Price}</span>
                </div>

                <div className="car-details">
                  <div className="car-detail">
                    {car["Fuel Type"]}
                  </div>
                  <div className="car-detail">

                    {car.Transmission}
                  </div>
                  {car["Engine Size"] && (
                    <div className="car-detail">
                      <svg className="icon-placeholder-default icon-sky mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 48 48" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {car["Engine Size"]}L Engine
                    </div>
                  )}
                  {car.MPG && (
                    <div className="car-detail">
                      <svg className="icon-placeholder-default icon-sky mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 48 48" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {car.MPG} MPG
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
