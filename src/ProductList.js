export default function ProductList({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>{title}</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {products.map(p => (
          <li key={p.id} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
            <strong>{p.name}</strong> — ${p.price} ({p.category})
          </li>
        ))}
      </ul>
    </div>
  );
}
