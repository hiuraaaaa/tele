"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);

  async function load() {
    const r = await fetch("/api/settings");
    setSettings(await r.json());
  }

  async function save() {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    alert("Saved!");
  }

  async function reset() {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true })
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (!settings) return <div>Loading…</div>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Bot Settings</h1>

      {/* BOT NAME */}
      <Field
        label="Bot Name"
        value={settings.botName}
        onChange={(e) => setSettings({ ...settings, botName: e })}
      />

      {/* PREFIX */}
      <Field
        label="Prefix"
        value={settings.prefix}
        onChange={(e) => setSettings({ ...settings, prefix: e })}
      />

      {/* WELCOME */}
      <Field
        label="Welcome Message"
        textarea
        value={settings.welcomeMessage}
        onChange={(e) => setSettings({ ...settings, welcomeMessage: e })}
      />

      {/* AUTO REPLY */}
      <Field
        label="Auto Reply"
        textarea
        value={settings.autoReply}
        onChange={(e) => setSettings({ ...settings, autoReply: e })}
      />

      <button onClick={save} style={btnPrimary}>Save Settings</button>
      <button onClick={reset} style={btnDanger}>Reset to Default</button>
    </div>
  );
}

function Field({ label, value, onChange, textarea }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inp}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inp}
        />
      )}
    </div>
  );
}

const inp = {
  display: "block",
  width: "100%",
  marginTop: "0.4rem",
  padding: "0.7rem",
  borderRadius: "0.6rem",
  border: "1px solid #e5e7eb",
  background: "#f9fafb"
};

const btnPrimary = {
  padding: "0.7rem 1.4rem",
  borderRadius: "10px",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  border: "none",
  marginRight: "1rem",
  cursor: "pointer"
};

const btnDanger = {
  padding: "0.7rem 1.4rem",
  borderRadius: "10px",
  background: "#ef4444",
  color: "white",
  fontWeight: 600,
  border: "none",
  cursor: "pointer"
};
