import React from "react";
import "./ProductGrid.css";

const ProductGrid = ({ itemCount = 10 }) => {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);

  return (
    <div className="product-grid">
      {items.map((item) => (
        <div key={item} className="product-card">
          <span>Item {item}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
