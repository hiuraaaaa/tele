// app/logs/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  async function load() {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setLogs(data.logs || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* breadcrumb */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#9ca3af",
          marginBottom: "0.25rem"
        }}
      >
        Home / <span style={{ color: "#4b5563" }}>Logs</span>
      </div>

      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          marginBottom: "0.4rem"
        }}
      >
        Panel Logs
      </h1>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "0.8rem"
        }}
      >
        Riwayat perubahan pengaturan yang dilakukan lewat panel ini. Log terbaru
        ada di paling atas.
      </p>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.2rem",
          border: "1px solid #e5e7eb",
          padding: "1.2rem 1.3rem",
          boxShadow: "0 12px 30px rgba(15,23,42,0.05)"
        }}
      >
        {logs.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Belum ada log. Coba simpan atau reset settings terlebih dahulu.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
              fontSize: "0.82rem"
            }}
          >
            {logs.map((log, index) => (
              <li
                key={index}
                style={{
                  padding: "0.45rem 0.5rem",
                  borderRadius: "0.6rem",
                  backgroundColor: index === 0 ? "#f9fafb" : "transparent"
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    marginRight: "0.45rem"
                  }}
                >
                  {new Date(log.time).toLocaleString()}
                </span>
                <span style={{ color: "#4b5563" }}>{log.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
