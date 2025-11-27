// app/commands/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function CommandsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands: settings.commands })
      });
      alert("Commands disimpan.");
    } catch (e) {
      alert("Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  function toggleEnabled(index) {
    setSettings((prev) => {
      const copy = { ...prev };
      copy.commands = [...prev.commands];
      copy.commands[index] = {
        ...copy.commands[index],
        enabled: !copy.commands[index].enabled
      };
      return copy;
    });
  }

  if (!settings) return <p>Memuat commands…</p>;

  return (
    <div>
      <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
        Home / <span style={{ color: "#4b5563" }}>Commands</span>
      </div>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Commands
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "1rem" }}>
        Atur command mana yang aktif, dan lihat format lengkap command dengan prefix yang
        digunakan bot.
      </p>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.2rem",
          border: "1px solid #e5e7eb",
          padding: "1.2rem",
          boxShadow: "0 10px 24px rgba(15,23,42,0.04)"
        }}
      >
        {settings.commands.length === 0 && (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Belum ada commands. Kamu bisa tambahkan manual di file API nanti.
          </p>
        )}

        {settings.commands.map((cmd, i) => (
          <div
            key={cmd.key + i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.7rem 0.2rem",
              borderBottom:
                i === settings.commands.length - 1 ? "none" : "1px solid #f3f4f6"
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {settings.prefix}
                {cmd.key}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                {cmd.description}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleEnabled(i)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: "999px",
                border: cmd.enabled ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
                backgroundColor: cmd.enabled ? "#dcfce7" : "#ffffff",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: cmd.enabled ? "#166534" : "#6b7280",
                cursor: "pointer"
              }}
            >
              {cmd.enabled ? "Aktif" : "Nonaktif"}
            </button>
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              padding: "0.7rem 1.4rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: saving ? "wait" : "pointer"
            }}
          >
            {saving ? "Menyimpan…" : "Simpan Commands"}
          </button>
        </div>
      </div>
    </div>
  );
}
