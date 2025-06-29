"use client";
import { useState } from "react";
import RecommendationPage from "../src/pages/RecommendationPage.jsx"
import FilterPage from "../src/pages/FilterPage.jsx"
import Car from "../src/pages/CarRecommendationApp.jsx"
import CarRecommendationApp from "../src/pages/CarRecommendationApp.jsx";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: input }),
    });

    const data = await res.json();
    console.log("DEBUG response from API:", data);  
    setResults(data);
  };

  return (
    <CarRecommendationApp/> 

  );
}
