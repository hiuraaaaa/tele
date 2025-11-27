// app/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function OverviewPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    }
    load();
  }, []);

  if (!settings) {
    return <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Memuat overview…</p>;
  }

  const totalCommands = settings.commands?.length || 0;
  const enabledCommands = settings.commands?.filter((c) => c.enabled).length || 0;

  return (
    <div>
      <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
        Home / <span style={{ color: "#4b5563" }}>Overview</span>
      </div>

      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Overview
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Ringkasan status bot Telegram yang berjalan di Pterodactyl.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <StatCard
          title="Status Bot"
          value={settings.status === "online" ? "Online" : "Unknown"}
          accent={settings.status === "online" ? "#22c55e" : "#f97316"}
        />
        <StatCard title="Total Commands" value={`${totalCommands}`} />
        <StatCard title="Commands Aktif" value={`${enabledCommands}`} />
      </div>
    </div>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <div
      style={{
        flex: "0 0 180px",
        backgroundColor: "#ffffff",
        borderRadius: "1rem",
        border: "1px solid #e5e7eb",
        padding: "1rem 1.2rem",
        boxShadow: "0 14px 30px rgba(15,23,42,0.05)"
      }}
    >
      <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: accent || "#111827"
        }}
      >
        {value}
      </div>
    </div>
  );
}
