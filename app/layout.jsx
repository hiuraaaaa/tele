// app/layout.jsx

export const metadata = {
  title: 'Telegram Bot Panel',
  description: 'Dashboard pengaturan bot Telegram yang jalan di Pterodactyl'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Font mirip style contoh (Space Grotesk) */}
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
          minHeight: '100vh',
          backgroundColor: '#f3f4f6', // abu terang (light)
          fontFamily: '"Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: '#111827'
        }}
      >
        {children}
      </body>
    </html>
  );
}
