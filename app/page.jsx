// app/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    return (
      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Memuat overview…</p>
    );
  }

  const totalCommands = settings.commands?.length || 0;
  const enabledCommands = settings.commands?.filter((c) => c.enabled).length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#9ca3af",
          marginBottom: "0.25rem"
        }}
      >
        Home / <span style={{ color: "#4b5563" }}>Overview</span>
      </div>

      {/* Header + hero card */}
      <section>
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 700,
            marginBottom: "0.4rem"
          }}
        >
          Overview
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.9rem",
            marginBottom: "1rem"
          }}
        >
          Ringkasan status bot Telegram yang berjalan di Pterodactyl, lengkap
          dengan konfigurasi utama dan aktivitas panel.
        </p>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "1.25rem",
            border: "1px solid #e5e7eb",
            padding: "1.4rem 1.5rem",
            boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem"
          }}
        >
          {/* Info bar atas */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                  marginBottom: "0.15rem"
                }}
              >
                Active bot
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {settings.botName || "Stella Bot"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center"
              }}
            >
              {/* status pill */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  backgroundColor:
                    settings.status === "online" ? "#dcfce7" : "#fee2e2",
                  color:
                    settings.status === "online" ? "#166534" : "#b91c1c",
                  fontSize: "0.8rem",
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    backgroundColor:
                      settings.status === "online" ? "#22c55e" : "#f97316"
                  }}
                />
                {settings.status === "online" ? "Online" : "Unknown"}
              </span>

              {/* prefix badge */}
              <span
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  fontSize: "0.78rem",
                  color: "#4b5563"
                }}
              >
                Prefix: <strong>{settings.prefix || "!"}</strong>
              </span>
            </div>
          </div>

          {/* Deskripsi + info cepat */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "0.5rem"
            }}
          >
            <p
              style={{
                flex: "1 1 200px",
                fontSize: "0.87rem",
                color: "#6b7280",
                margin: 0
              }}
            >
              Pengaturan yang kamu ubah dari panel ini akan dibaca secara
              berkala oleh bot di Pterodactyl melalui endpoint{" "}
              <code
                style={{
                  background: "#f3f4f6",
                  padding: "0.1rem 0.3rem",
                  borderRadius: "0.3rem",
                  fontSize: "0.78rem"
                }}
              >
                /api/settings
              </code>
              .
            </p>

            <div
              style={{
                flex: "0 0 190px",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                fontSize: "0.8rem"
              }}
            >
              <InfoRow label="Welcome message">
                {settings.welcomeMessage
                  ? settings.welcomeMessage.slice(0, 40) +
                    (settings.welcomeMessage.length > 40 ? "…" : "")
                  : "Belum diatur"}
              </InfoRow>
              <InfoRow label="Auto reply">
                {settings.autoReply
                  ? settings.autoReply.slice(0, 40) +
                    (settings.autoReply.length > 40 ? "…" : "")
                  : "Belum diatur"}
              </InfoRow>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.6rem"
          }}
        >
          Statistik Cepat
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <StatCard
            title="Status Bot"
            value={settings.status === "online" ? "Online" : "Unknown"}
            accent={settings.status === "online" ? "#22c55e" : "#f97316"}
          />
          <StatCard title="Total Commands" value={`${totalCommands}`} />
          <StatCard title="Commands Aktif" value={`${enabledCommands}`} />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.6rem"
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem" }}>
          <QuickLink
            href="/settings"
            title="Edit Bot Settings"
            desc="Ubah nama bot, prefix, welcome, dan auto reply."
          />
          <QuickLink
            href="/commands"
            title="Kelola Commands"
            desc="Aktif/nonaktifkan command yang tersedia."
          />
          <QuickLink
            href="/logs"
            title="Lihat Panel Logs"
            desc="Pantau riwayat perubahan pengaturan dari panel."
          />
        </div>
      </section>

      {/* Footer kecil */}
      <footer
        style={{
          marginTop: "0.5rem",
          fontSize: "0.75rem",
          color: "#9ca3af"
        }}
      >
        Bot Control Panel · Powered by Next.js & Telegram Bot API
      </footer>
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
      <div
        style={{
          fontSize: "0.8rem",
          color: "#9ca3af",
          marginBottom: "0.25rem"
        }}
      >
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

function QuickLink({ href, title, desc }) {
  return (
    <Link
      href={href}
      style={{
        flex: "1 1 220px",
        textDecoration: "none"
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          border: "1px solid #e5e7eb",
          padding: "0.9rem 1rem",
          boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem"
        }}
      >
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#111827"
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "#6b7280"
          }}
        >
          {desc}
        </div>
        <span
          style={{
            marginTop: "0.2rem",
            fontSize: "0.78rem",
            color: "#3b82f6",
            fontWeight: 500
          }}
        >
          Buka →
        </span>
      </div>
    </Link>
  );
}

function InfoRow({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          color: "#9ca3af"
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.8rem",
          color: "#4b5563"
        }}
      >
        {children}
      </span>
    </div>
  );
          }
