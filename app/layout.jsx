"use client";
import { useState } from "react";
import Link from "next/link";

export const metadata = {
  title: "Bot Panel",
  description: "Control panel bot Telegram"
};

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Space Grotesk", sans-serif',
          backgroundColor: "#f7f8fc",
          color: "#111827",
          display: "flex"
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: "240px",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: open ? 0 : "-260px",
            background: "white",
            borderRight: "1px solid #e5e7eb",
            padding: "1.5rem 1rem",
            boxShadow: open ? "0 0 20px rgba(0,0,0,0.10)" : "none",
            transition: "0.25s"
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontWeight: 700 }}>Bot Panel</h2>

          <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/">Overview</Link>
            <Link href="/settings">Bot Settings</Link>
            <Link href="/commands">Commands</Link>
            <Link href="/logs">Logs</Link>
          </nav>
        </div>

        {/* NAVBAR ATAS */}
        <div
          style={{
            width: "100%",
            padding: "1rem",
            borderBottom: "1px solid #e5e7eb",
            background: "white",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <button
            onClick={() => setOpen(!open)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ☰
          </button>
          <span style={{ fontWeight: 600 }}>Control Panel</span>
        </div>

        {/* KONTEN */}
        <main
          style={{
            marginTop: "70px",
            marginLeft: "240px",
            padding: "1.5rem",
            width: "100%"
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
