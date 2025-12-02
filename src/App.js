import { useState } from "react";
import { products } from "./products";
import ProductList from "./ProductList";
import RecommendationForm from "./RecommendationForm";
import { getAIRecommendation } from "./api";

export default function App() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async (query) => {
    setLoading(true);
    setError("");
    try {
      const ids = await getAIRecommendation(query, products);
      const filtered = products.filter(p => ids.includes(p.id));
      setRecommended(filtered);
    } catch {
      setError("Failed to get recommendations. Please try again.");
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#333" }}>AI-Powered Product Recommendations</h2>
      <p style={{ color: "#555" }}>Tell me what you’re looking for, and I’ll suggest the best products for you!</p>

      <RecommendationForm onSubmit={handleRecommend} loading={loading} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ProductList title="All Products" products={products} />

      {recommended.length > 0 && (
        <ProductList title="Recommended for You" products={recommended} />
      )}
    </div>
  );
}
