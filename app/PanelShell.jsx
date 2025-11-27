// app/PanelShell.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PanelShell({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { href: "/", label: "Overview" },
    { href: "/settings", label: "Bot Settings" },
    { href: "/commands", label: "Commands" },
    { href: "/logs", label: "Logs" }
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar atas */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          padding: "0 1rem",
          zIndex: 50
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            marginRight: "0.75rem",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1"
          }}
        >
          ☰
        </button>
        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Bot Control Panel</span>
      </header>

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 60,
          bottom: 0,
          left: open ? 0 : -260,
          width: 240,
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "1.25rem 1rem",
          boxShadow: open ? "0 0 30px rgba(15,23,42,0.15)" : "none",
          transition: "left 0.25s ease",
          zIndex: 40
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            margin: "0 0 1.2rem"
          }}
        >
          Navigation
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            fontSize: "0.9rem"
          }}
        >
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "0.45rem 0.7rem",
                  borderRadius: "0.6rem",
                  textDecoration: "none",
                  color: active ? "#111827" : "#4b5563",
                  backgroundColor: active ? "#e5f0ff" : "transparent",
                  fontWeight: active ? 600 : 500
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay klik untuk nutup sidebar (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 60,
            backgroundColor: "rgba(15,23,42,0.35)",
            zIndex: 30
          }}
        />
      )}

      {/* Konten utama */}
      <main
        style={{
          paddingTop: 70,
          paddingBottom: 24,
          paddingLeft: 16,
          paddingRight: 16,
          maxWidth: 960,
          margin: "0 auto"
        }}
      >
        {children}
      </main>
    </div>
  );
}
