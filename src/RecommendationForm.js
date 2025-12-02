import { useState } from "react";

export default function RecommendationForm({ onSubmit, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Type your preferences, e.g., 'I want a phone under $500'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button
        type="submit"
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#4CAF50",
          color: "#fff",
          cursor: "pointer"
        }}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Recommend"}
      </button>
    </form>
  );
}
