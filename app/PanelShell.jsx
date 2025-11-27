// app/PanelShell.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PanelShell({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup sidebar tiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const menu = [
    { href: "/", label: "Overview" },
    { href: "/settings", label: "Bot Settings" },
    { href: "/commands", label: "Commands" },
    { href: "/logs", label: "Logs" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6"
      }}
    >
      {/* NAVBAR */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid rgba(15,23,42,0.04)",
          boxShadow: "0 1px 0 rgba(15,23,42,0.03)",
          display: "flex",
          alignItems: "center",
          zIndex: 50
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1040,
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <button
            onClick={() => setOpen(!open)}
            aria-label="Open navigation"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ☰
          </button>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              color: "#111827"
            }}
          >
            Bot Control Panel
          </span>
        </div>
      </header>

      {/* SIDEBAR OVERLAY */}
      <aside
        style={{
          position: "fixed",
          top: 60,
          bottom: 0,
          left: open ? 0 : -260,
          width: 240,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(249,250,251,0.98))",
          borderRight: "1px solid #e5e7eb",
          padding: "1.25rem 1rem",
          boxShadow: open ? "0 18px 45px rgba(15,23,42,0.18)" : "none",
          transition: "left 0.25s ease",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}
      >
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#9ca3af",
            marginBottom: "0.3rem"
          }}
        >
          Navigation
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            fontSize: "0.9rem"
          }}
        >
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "0.45rem 0.75rem",
                  borderRadius: "0.7rem",
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

      {/* BACKDROP GELAP SAAT SIDEBAR BUKA */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 60,
            backgroundColor: "rgba(15,23,42,0.4)",
            zIndex: 30
          }}
        />
      )}

      {/* MAIN CONTENT */}
      <main
        style={{
          paddingTop: 76,
          paddingBottom: 24
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1040,
            margin: "0 auto",
            padding: "0 1rem"
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
