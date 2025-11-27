export default function Overview() {
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Overview</h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Ringkasan kondisi bot kamu.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Card title="Status Bot" value="Online" color="#22c55e" />
        <Card title="Total Commands" value="2" />
        <Card title="Commands Aktif" value="2" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        flex: "0 0 200px",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "1rem",
        padding: "1.2rem"
      }}
    >
      <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{title}</div>
      <div style={{ fontSize: "1.3rem", fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
