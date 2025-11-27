// app/settings/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  // --- State Management ---
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Logic Functions ---
  async function load() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Gagal load settings:", err);
      // Dummy data jika fetch gagal (untuk preview UI)
      setSettings({
        botName: "Stella Bot",
        prefix: "!",
        welcomeMessage: "Halo, aku Stella Bot. Siap membantu ✨",
        autoReply: "Terima kasih, pesanmu sudah diterima.",
      });
    } finally {
      setLoading(false);
    }
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
        body: JSON.stringify(settings),
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
        body: JSON.stringify({ reset: true }),
      });
      await load();
    } catch (e) {
      alert("Gagal reset: " + e.message);
    } finally {
      setResetting(false);
    }
  }

  // --- Global Styles Injection ---
  const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Helper class untuk responsivitas grid tanpa media query inline */
        .grid-responsive {
          display: grid;
          grid-template-columns: 1fr 100px; /* Rasio Name:Prefix (Prefix fix 100px) */
          gap: 16px;
        }
        @media (max-width: 400px) {
          .grid-responsive {
            grid-template-columns: 1fr; /* Stack ke bawah di layar sangat kecil */
          }
        }
      `
    }} />
  );

  // --- Loading State ---
  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <GlobalStyles />
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Memuat pengaturan…</p>
      </div>
    );
  }

  // --- Error State ---
  if (!settings) {
    return (
      <div style={styles.centerContainer}>
        <p style={styles.errorText}>
          Gagal memuat data pengaturan. Coba refresh halaman.
        </p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div style={styles.container}>
      <GlobalStyles />
      
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        Home / <span style={styles.breadcrumbActive}>Bot Settings</span>
      </nav>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Bot Settings</h1>
        <p style={styles.subtitle}>
          Kelola identitas bot dan pesan otomatis.
        </p>
      </header>

      {/* FORM CARD */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Konfigurasi Utama</h2>
          <p style={styles.cardDesc}>
            Pengaturan dasar identitas bot Anda.
          </p>
        </div>

        {/* ROW 1: Bot Name & Prefix (Fixed Layout) */}
        {/* Menggunakan className 'grid-responsive' yang didefinisikan di GlobalStyles */}
        <div className="grid-responsive" style={{ marginBottom: 20 }}>
          <Field
            label="Bot Name"
            value={settings.botName}
            onChange={(v) => setSettings({ ...settings, botName: v })}
            placeholder="Stella Bot"
            help="Nama tampilan bot."
          />
          <Field
            label="Prefix"
            value={settings.prefix}
            maxLength={3}
            centerText
            onChange={(v) => setSettings({ ...settings, prefix: v })}
            placeholder="!"
            help="Cth: ! / ."
          />
        </div>

        <Field
          label="Welcome Message"
          textarea
          value={settings.welcomeMessage}
          onChange={(v) => setSettings({ ...settings, welcomeMessage: v })}
          placeholder="Halo, aku Stella Bot. Siap membantu ✨"
        />

        <Field
          label="Auto Reply Message"
          textarea
          value={settings.autoReply}
          onChange={(v) => setSettings({ ...settings, autoReply: v })}
          placeholder="Terima kasih, pesanmu sudah diterima."
          help="Pesan default saat command tidak dikenal."
        />

        {/* Actions - Buttons dibuat Full Width & Rata */}
        <div style={styles.actionsRow}>
          <button
            type="submit"
            onClick={handleSave}
            disabled={saving}
            style={{...styles.btn, ...styles.btnPrimary}}
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
          
          <button
            type="button"
            disabled={resetting}
            onClick={handleReset}
            style={{...styles.btn, ...styles.btnDanger}}
          >
            {resetting ? "Mereset..." : "Reset Default"}
          </button>
        </div>
      </section>

      {/* PREVIEW CARD */}
      <section style={styles.previewCard}>
        <h2 style={styles.previewTitle}>Preview Live</h2>
        
        <div style={styles.previewRow}>
           {/* Simulasi Chat Bubble */}
           <PreviewBubble 
            label="/start"
            title={settings.botName || "Bot Name"}
            text={settings.welcomeMessage}
            footer={`Prefix: ${settings.prefix || "!"}`}
          />

          <PreviewBubble 
            label="Unknown Command"
            variant="secondary"
            text={settings.autoReply}
          />
        </div>
      </section>
    </div>
  );
}

// --- Sub-Components ---

function Field({ label, value, onChange, textarea, help, maxLength, placeholder, centerText }) {
  const InputComponent = textarea ? 'textarea' : 'input';
  
  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel}>{label}</label>
      <InputComponent
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        type={!textarea ? "text" : undefined}
        style={{
          ...styles.input,
          ...(textarea ? styles.textarea : {}),
          textAlign: centerText ? 'center' : 'left'
        }}
      />
      {help && <div style={styles.fieldHelp}>{help}</div>}
    </div>
  );
}

function PreviewBubble({ label, title, text, footer, variant = 'primary' }) {
  const bubbleStyle = variant === 'secondary' ? styles.previewBubbleSecondary : styles.previewBubble;
  
  return (
    <div style={styles.previewItem}>
      <span style={styles.previewLabel}>{label}</span>
      <div style={bubbleStyle}>
        {title && <p style={styles.previewBubbleTitle}>{title}</p>}
        <p style={styles.previewBubbleText}>{text}</p>
        {footer && <p style={styles.previewHint}>{footer}</p>}
      </div>
    </div>
  );
}

// --- Styles Object ---
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "100%",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1f2937",
  },
  
  // Loading & Error
  centerContainer: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { fontSize: "14px", color: "#6b7280" },
  errorText: { fontSize: "14px", color: "#ef4444", textAlign: "center", padding: "20px" },

  // Header
  breadcrumb: { fontSize: "12px", color: "#9ca3af", marginBottom: "4px" },
  breadcrumbActive: { color: "#4b5563", fontWeight: 600 },
  header: { marginBottom: "8px" },
  title: { fontSize: "24px", fontWeight: 800, color: "#111827", margin: "0 0 4px 0" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardHeader: { marginBottom: "20px" },
  cardTitle: { fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 4px 0" },
  cardDesc: { fontSize: "13px", color: "#6b7280", margin: 0 },

  // Inputs
  fieldWrapper: { display: "flex", flexDirection: "column", height: "100%" }, // Height 100% agar align
  fieldLabel: { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" },
  fieldHelp: { marginTop: "4px", fontSize: "11px", color: "#9ca3af" },
  
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box", // Penting agar padding tidak jebol
    transition: "border 0.2s",
  },
  textarea: { resize: "vertical", minHeight: "80px", lineHeight: 1.5, fontFamily: "inherit" },

  // Buttons
  actionsRow: { 
    marginTop: "24px", 
    display: "flex", 
    gap: "12px",
    // Membuat tombol responsive: wrap di layar kecil, tapi fill width
    flexWrap: "wrap",
  },
  btn: {
    flex: "1 1 auto", // Tombol akan mengisi ruang yang ada
    minWidth: "140px",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    textAlign: "center",
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  btnDanger: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },

  // Preview
  previewCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
  },
  previewTitle: { fontSize: "14px", fontWeight: 600, color: "#64748b", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.5px" },
  previewRow: { display: "flex", flexDirection: "column", gap: "16px" },
  previewItem: {},
  previewLabel: { fontSize: "11px", color: "#94a3b8", marginBottom: "4px", display: "block", fontWeight: 500 },
  
  previewBubble: {
    backgroundColor: "#ffffff",
    borderRadius: "0 12px 12px 12px",
    border: "1px solid #e5e7eb",
    padding: "12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    maxWidth: "90%",
  },
  previewBubbleSecondary: {
    backgroundColor: "#eff6ff",
    borderRadius: "12px 12px 12px 0",
    border: "1px solid #bfdbfe",
    padding: "12px",
    marginLeft: "auto", // Align right
    maxWidth: "90%",
  },
  previewBubbleTitle: { fontSize: "13px", fontWeight: 700, color: "#1e293b", margin: "0 0 2px 0" },
  previewBubbleText: { fontSize: "13px", color: "#475569", margin: "0 0 6px 0", lineHeight: 1.4 },
  previewHint: { fontSize: "11px", color: "#94a3b8", margin: 0, fontStyle: "italic" },
};

