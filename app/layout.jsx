// app/layout.jsx
import PanelShell from "./PanelShell";

export const metadata = {
  title: "Bot Control Panel",
  description: "Dashboard pengaturan bot Telegram"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: "#f7f8fc",
          color: "#111827"
        }}
      >
        <PanelShell>{children}</PanelShell>
      </body>
    </html>
  );
}
