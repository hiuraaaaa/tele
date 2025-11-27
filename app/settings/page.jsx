// app/settings/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Gagal load settings:", err);
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Memuat pengaturan…</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>
          Gagal memuat data pengaturan. Coba refresh halaman.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        Home / <span style={styles.breadcrumbActive}>Bot Settings</span>
      </nav>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Bot Settings</h1>
        <p style={styles.subtitle}>
          Kelola identitas bot, prefix command, dan pesan otomatis yang akan
          dipakai langsung oleh bot di Pterodactyl.
        </p>
      </header>

      {/* Content grid: form + preview */}
      <section style={styles.grid} className="settings-grid">
        {/* Form card */}
        <form onSubmit={handleSave} style={styles.formCard}>
          <h2 style={styles.cardTitle}>Konfigurasi Utama</h2>
          <p style={styles.cardDesc}>
            Ubah nama bot, prefix command, dan pesan bawaan yang akan dibaca
            oleh bot melalui endpoint <code style={styles.code}>/api/settings</code>.
          </p>

          <div style={styles.fieldsGrid}>
            <Field
              label="Bot Name"
              value={settings.botName}
              onChange={(v) => setSettings({ ...settings, botName: v })}
              placeholder="Stella Bot"
              help="Nama ini akan muncul di pesan sambutan / informasi bot."
            />

            <Field
              label="Prefix"
              value={settings.prefix}
              maxLength={3}
              style={{ maxWidth: "150px" }}
              onChange={(v) => setSettings({ ...settings, prefix: v })}
              placeholder="!"
              help="Contoh: !, ?, .  — dipakai di depan command (mis. !ping)."
            />
          </div>

          <Field
            label="Welcome Message"
            textarea
            value={settings.welcomeMessage}
            onChange={(v) =>
              setSettings({ ...settings, welcomeMessage: v })
            }
            placeholder="Halo, aku Stella Bot. Siap membantu ✨"
          />

          <Field
            label="Auto Reply Message"
            textarea
            value={settings.autoReply}
            onChange={(v) => setSettings({ ...settings, autoReply: v })}
            placeholder="Terima kasih, pesanmu sudah diterima."
            help="Pesan default ketika command tidak dikenali atau sedang maintenance."
          />

          <div style={styles.actionsRow}>
            <button type="submit" disabled={saving} style={styles.btnPrimary}>
              {saving ? "Menyimpan…" : "Simpan Pengaturan"}
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleReset}
              style={styles.btnDanger}
            >
              {resetting ? "Mereset…" : "Reset ke Default"}
            </button>
          </div>
        </form>

        {/* Preview card */}
        <aside style={styles.previewCard}>
          <h2 style={styles.previewTitle}>Preview Respon Bot</h2>
          <p style={styles.previewDesc}>
            Gambaran singkat bagaimana user akan melihat bot dengan
            pengaturan saat ini.
          </p>

          <div style={styles.previewBlock}>
            <span style={styles.previewLabel}>/start</span>
            <div style={styles.previewBubble}>
              <p style={styles.previewBubbleTitle}>
                {settings.botName || "Stella Bot"}
              </p>
              <p style={styles.previewBubbleText}>
                {settings.welcomeMessage ||
                  "Halo, aku Stella Bot. Siap membantu ✨"}
              </p>
              <p style={styles.previewHint}>
                Prefix aktif:{" "}
                <code style={styles.previewCode}>
                  {settings.prefix || "!"}
                </code>
              </p>
            </div>
          </div>

          <div style={styles.previewBlock}>
            <span style={styles.previewLabel}>
              Pesan tanpa command yang cocok
            </span>
            <div style={styles.previewBubbleSecondary}>
              <p style={styles.previewBubbleText}>
                {settings.autoReply ||
                  "Terima kasih, pesannya sudah diterima."}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* FIELD COMPONENT */
function Field({
  label,
  value,
  onChange,
  textarea,
  help,
  maxLength,
  style,
  placeholder,
}) {
  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.fieldLabel}>{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, ...styles.textarea, ...(style || {}) }}
        />
      ) : (
        <input
          type="text"
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, ...(style || {}) }}
        />
      )}
      {help && <div style={styles.fieldHelp}>{help}</div>}
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    maxWidth: "100%",
  },

  // loading / error
  loadingContainer: {
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  errorContainer: {
    padding: 32,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
  },

  // breadcrumb & header
  breadcrumb: {
    fontSize: 13,
    color: "#9ca3af",
  },
  breadcrumbActive: {
    color: "#4b5563",
    fontWeight: 500,
  },
  header: {
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  },

  // layout
  grid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1.2fr",
    gap: 20,
    alignItems: "flex-start",
  },

  // form card
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 20,
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
    marginBottom: 16,
  },

  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
    gap: 12,
    marginBottom: 8,
  },

  fieldWrapper: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
    display: "block",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "0.65rem 0.8rem",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    fontSize: 14,
    color: "#111827",
    outline: "none",
  },
  textarea: {
    resize: "vertical",
    minHeight: 80,
  },
  fieldHelp: {
    marginTop: 4,
    fontSize: 12,
    color: "#9ca3af",
  },

  actionsRow: {
    marginTop: 16,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  btnPrimary: {
    padding: "0.7rem 1.5rem",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#22c55e,#3b82f6)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  btnDanger: {
    padding: "0.7rem 1.3rem",
    borderRadius: 999,
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
  },

  code: {
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    fontFamily: "monospace",
  },

  // preview card
  previewCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    padding: 18,
    boxShadow: "0 8px 25px rgba(15,23,42,0.04)",
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 13,
    color: "#6b7280",
    margin: 0,
    marginBottom: 14,
  },
  previewBlock: {
    marginBottom: 14,
  },
  previewLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
    display: "block",
  },
  previewBubble: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 10,
  },
  previewBubbleSecondary: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    border: "1px solid #dbeafe",
    padding: 10,
  },
  previewBubbleTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 2,
  },
  previewBubbleText: {
    fontSize: 13,
    color: "#4b5563",
    margin: 0,
    marginBottom: 4,
  },
  previewHint: {
    fontSize: 12,
    color: "#9ca3af",
    margin: 0,
  },
  previewCode: {
    backgroundColor: "#f3f4f6",
    padding: "1px 5px",
    borderRadius: 4,
    fontSize: 12,
  },
};

/* inject keyframes sekali */
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .settings-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  if (!document.querySelector("style[data-settings-page]")) {
    styleEl.setAttribute("data-settings-page", "true");
    document.head.appendChild(styleEl);
  }
}
