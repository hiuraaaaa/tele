"use client";

import { useEffect, useState } from "react";

// --- Main Component ---
export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data settings
  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial Load
  useEffect(() => {
    fetchSettings();
    injectSpinnerStyle(); // Inject CSS for spinner globally
  }, []);

  // Handler: Simpan Pengaturan
  async function onSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Pengaturan berhasil disimpan.");
    } catch (error) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Handler: Reset Pengaturan
  async function onReset() {
    if (!confirm("Apakah Anda yakin ingin mereset semua pengaturan ke default?")) return;
    
    setIsResetting(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      await fetchSettings(); // Reload data setelah reset
      alert("Pengaturan telah direset.");
    } catch (error) {
      alert("Gagal reset: " + error.message);
    } finally {
      setIsResetting(false);
    }
  }

  // --- Render States ---

  if (isLoading) return <LoadingState />;
  if (!settings) return <ErrorState />;

  return (
    <div style={styles.container}>
      <Breadcrumb />
      
      <Header 
        title="Bot Settings" 
        subtitle="Kelola identitas bot, prefix command, dan pesan otomatis yang akan dipakai langsung oleh bot di Pterodactyl."
      />

      <SettingsForm 
        settings={settings} 
        setSettings={setSettings} 
        onSave={onSave}
        onReset={onReset}
        isSaving={isSaving}
        isResetting={isResetting}
      />

      <PreviewSection settings={settings} />
    </div>
  );
}

// --- Sub-Components (UI Parts) ---

function Breadcrumb() {
  return (
    <nav style={styles.breadcrumb}>
      Home / <span style={styles.breadcrumbActive}>Bot Settings</span>
    </nav>
  );
}

function Header({ title, subtitle }) {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </header>
  );
}

function LoadingState() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Memuat pengaturan…</p>
    </div>
  );
}

function ErrorState() {
  return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>
        Gagal memuat data pengaturan. Silakan refresh halaman.
      </p>
    </div>
  );
}

function SettingsForm({ settings, setSettings, onSave, onReset, isSaving, isResetting }) {
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Konfigurasi Utama</h2>
        <p style={styles.cardDesc}>
          Ubah nama bot, prefix command, dan pesan bawaan yang akan dibaca oleh bot melalui endpoint <code style={styles.code}>/api/settings</code>.
        </p>
      </div>

      <div style={styles.fieldsRow}>
        <div style={styles.fieldCol}>
          <InputField
            label="Bot Name"
            value={settings.botName}
            onChange={(val) => handleChange("botName", val)}
            placeholder="Stella Bot"
            helpText="Nama ini akan muncul di pesan sambutan / informasi bot."
          />
        </div>
        <div style={styles.fieldColNarrow}>
          <InputField
            label="Prefix"
            value={settings.prefix}
            maxLength={3}
            onChange={(val) => handleChange("prefix", val)}
            placeholder="!"
            helpText="Contoh: !, ?, ."
          />
        </div>
      </div>

      <InputField
        label="Welcome Message"
        textarea
        value={settings.welcomeMessage}
        onChange={(val) => handleChange("welcomeMessage", val)}
        placeholder="Halo, aku Stella Bot. Siap membantu ✨"
      />

      <InputField
        label="Auto Reply Message"
        textarea
        value={settings.autoReply}
        onChange={(val) => handleChange("autoReply", val)}
        placeholder="Terima kasih, pesanmu sudah diterima."
        helpText="Pesan default ketika command tidak dikenali atau sedang maintenance."
      />

      <div style={styles.actionsRow}>
        <button onClick={onSave} disabled={isSaving} style={styles.btnPrimary}>
          {isSaving ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
        <button onClick={onReset} disabled={isResetting} style={styles.btnDanger}>
          {isResetting ? "Mereset…" : "Reset ke Default"}
        </button>
      </div>
    </section>
  );
}

function PreviewSection({ settings }) {
  return (
    <section style={styles.previewCard}>
      <h2 style={styles.previewTitle}>Preview Respon Bot</h2>
      <p style={styles.previewDesc}>Gambaran singkat bagaimana user akan melihat bot dengan pengaturan saat ini.</p>

      <div style={styles.previewBlock}>
        <span style={styles.previewLabel}>/start</span>
        <div style={styles.previewBubble}>
          <p style={styles.previewBubbleTitle}>{settings.botName || "Stella Bot"}</p>
          <p style={styles.previewBubbleText}>{settings.welcomeMessage || "Halo, aku Stella Bot. Siap membantu ✨"}</p>
          <p style={styles.previewHint}>
            Prefix aktif: <code style={styles.previewCode}>{settings.prefix || "!"}</code>
          </p>
        </div>
      </div>

      <div style={styles.previewBlock}>
        <span style={styles.previewLabel}>Pesan tanpa command</span>
        <div style={styles.previewBubbleSecondary}>
          <p style={styles.previewBubbleText}>{settings.autoReply || "Terima kasih, pesannya sudah diterima."}</p>
        </div>
      </div>
    </section>
  );
}

// Reusable Input Component
function InputField({ label, value, onChange, textarea, helpText, maxLength, placeholder }) {
  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel}>{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, ...styles.textarea }}
        />
      ) : (
        <input
          type="text"
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      )}
      {helpText && <div style={styles.fieldHelp}>{helpText}</div>}
    </div>
  );
}

// Helper: Inject Keyframes for Spinner (Clean approach)
function injectSpinnerStyle() {
  if (typeof document !== "undefined" && !document.getElementById("spinner-style")) {
    const style = document.createElement("style");
    style.id = "spinner-style";
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }
}

// --- Styles Object ---
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    maxWidth: "100%",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  
  // States
  loadingContainer: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  spinner: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { fontSize: "14px", color: "#6b7280" },
  errorContainer: { padding: "2rem", textAlign: "center" },
  errorText: { fontSize: "14px", color: "#ef4444" },

  // Header & Nav
  breadcrumb: { fontSize: "13px", color: "#9ca3af" },
  breadcrumbActive: { color: "#4b5563", fontWeight: 500 },
  header: { marginTop: "0.25rem" },
  title: { fontSize: "26px", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" },
  subtitle: { fontSize: "14px", color: "#6b7280", lineHeight: 1.6, margin: 0 },

  // Cards
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: { marginBottom: "1.5rem" },
  cardTitle: { fontSize: "16px", fontWeight: 600, color: "#111827", margin: "0 0 0.25rem 0" },
  cardDesc: { fontSize: "13px", color: "#6b7280", margin: 0 },

  // Layouts
  fieldsRow: { display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" },
  fieldCol: { flex: "1 1 200px" },
  fieldColNarrow: { flex: "0 0 120px" },

  // Inputs
  fieldWrapper: { marginBottom: "1rem" },
  fieldLabel: { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "0.5rem", display: "block" },
  input: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.15s ease-in-out",
  },
  textarea: { resize: "vertical", minHeight: "100px", fontFamily: "inherit" },
  fieldHelp: { marginTop: "0.25rem", fontSize: "12px", color: "#9ca3af" },

  // Actions
  actionsRow: { marginTop: "1.5rem", display: "flex", gap: "1rem" },
  btnPrimary: {
    padding: "0.75rem 1.5rem",
    borderRadius: "9999px",
    border: "none",
    background: "linear-gradient(135deg, #22c55e, #3b82f6)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  btnDanger: {
    padding: "0.75rem 1.5rem",
    borderRadius: "9999px",
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
  },

  // Preview
  previewCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    border: "1px dashed #cbd5e1",
    padding: "1.5rem",
  },
  previewTitle: { fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 0.25rem 0" },
  previewDesc: { fontSize: "13px", color: "#6b7280", margin: "0 0 1rem 0" },
  previewBlock: { marginBottom: "1rem" },
  previewLabel: { fontSize: "12px", color: "#64748b", marginBottom: "0.5rem", display: "block", fontWeight: 500 },
  previewBubble: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "1rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  previewBubbleSecondary: {
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    padding: "1rem",
  },
  previewBubbleTitle: { fontSize: "13px", fontWeight: 700, color: "#1e293b", margin: "0 0 0.25rem 0" },
  previewBubbleText: { fontSize: "13px", color: "#334155", margin: "0 0 0.5rem 0", lineHeight: 1.5 },
  previewHint: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  previewCode: { backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" },
  code: { backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" },
};

