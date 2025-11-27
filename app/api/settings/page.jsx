// app/settings/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function load() {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      alert("Pengaturan disimpan.");
    } catch (e) {
      alert("Gagal menyimpan: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Reset semua pengaturan ke default?")) return;
    setResetting(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true })
      });
      await load();
    } catch (e) {
      alert("Gagal reset: " + e.message);
    } finally {
      setResetting(false);
    }
  }

  if (!settings) return <p>Memuat pengaturan…</p>;

  return (
    <div>
      <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
        Home / <span style={{ color: "#4b5563" }}>Bot Settings</span>
      </div>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Bot Settings
      </h1>

      <form
        onSubmit={handleSave}
        style={{
          marginTop: "1rem",
          backgroundColor: "#ffffff",
          borderRadius: "1.2rem",
          border: "1px solid #e5e7eb",
          padding: "1.5rem",
          boxShadow: "0 14px 34px rgba(15,23,42,0.06)"
        }}
      >
        <Field
          label="Bot Name"
          value={settings.botName}
          onChange={(v) => setSettings({ ...settings, botName: v })}
        />

        <Field
          label="Prefix"
          value={settings.prefix}
          maxLength={3}
          style={{ maxWidth: "120px" }}
          onChange={(v) => setSettings({ ...settings, prefix: v })}
          help="Contoh: !, ?, ."
        />

        <Field
          label="Welcome Message"
          textarea
          value={settings.welcomeMessage}
          onChange={(v) => setSettings({ ...settings, welcomeMessage: v })}
        />

        <Field
          label="Auto Reply Message"
          textarea
          value={settings.autoReply}
          onChange={(v) => setSettings({ ...settings, autoReply: v })}
          help="Bisa dipakai sebagai pesan default kalau tidak ada command yang cocok."
        />

        <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            disabled={saving}
            style={btnPrimary}
          >
            {saving ? "Menyimpan…" : "Simpan Pengaturan"}
          </button>
          <button
            type="button"
            disabled={resetting}
            onClick={handleReset}
            style={btnDanger}
          >
            {resetting ? "Mereset…" : "Reset ke Default"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, textarea, help, maxLength, style }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{ fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: 4 }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inp, resize: "vertical", ...style }}
        />
      ) : (
        <input
          type="text"
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inp, ...style }}
        />
      )}
      {help && (
        <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 4 }}>{help}</div>
      )}
    </div>
  );
}

const inp = {
  display: "block",
  width: "100%",
  padding: "0.65rem 0.8rem",
  borderRadius: "0.7rem",
  border: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  fontSize: "0.9rem"
};

const btnPrimary = {
  padding: "0.7rem 1.4rem",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#3b82f6)",
  color: "#ffffff",
  fontWeight: 600,
  cursor: "pointer"
};

const btnDanger = {
  padding: "0.7rem 1.2rem",
  borderRadius: "999px",
  border: "1px solid #fecaca",
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  fontWeight: 500,
  cursor: "pointer"
};
