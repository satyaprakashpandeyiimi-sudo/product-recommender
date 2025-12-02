export async function getAIRecommendation(query, products) {
  const response = await fetch("https://your-backend-live-url/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, products })
  });

  const data = await response.json();
  return data.ids || [];
}
