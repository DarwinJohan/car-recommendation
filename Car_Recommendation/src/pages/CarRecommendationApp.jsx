"use client";
import { useState } from "react";
import FilterPage from "./FilterPage";
import RecommendationPage from "./RecommendationPage";
import "./CarRecommendationApp.css";

export default function CarRecommendationApp() {
  const [activeTab, setActiveTab] = useState("filter"); // 'filter' atau 'text'

  return (
    <div>
      <nav className="navbar">
        <button
          className={`nav-button ${activeTab === "filter" ? "active" : ""}`}
          onClick={() => setActiveTab("filter")}
        >
          Filter
        </button>
        <button
          className={`nav-button ${activeTab === "text" ? "active" : ""}`}
          onClick={() => setActiveTab("text")}
        >
          Text
        </button>
      </nav>

      <main>
        {activeTab === "filter" && <FilterPage />}
        {activeTab === "text" && <RecommendationPage />}
      </main>
    </div>
  );
}
