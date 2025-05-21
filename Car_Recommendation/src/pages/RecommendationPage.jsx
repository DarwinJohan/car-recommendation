"use client";
import { useState, useEffect } from "react";
import "./RecommendationPage.css";

export default function RecommendationPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });
      const data = await res.json();
      setResults(data);
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
                    <svg className="icon-placeholder-default icon-sky mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 48 48" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    {car["Fuel Type"]}
                  </div>
                  <div className="car-detail">
                    <svg className="icon-placeholder-default icon-sky mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 48 48" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
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