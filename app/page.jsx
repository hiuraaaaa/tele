// app/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OverviewPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Memuat overview...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Gagal memuat data. Silakan refresh halaman.</p>
      </div>
    );
  }

  const totalCommands = settings.commands?.length || 0;
  const enabledCommands = settings.commands?.filter((c) => c.enabled).length || 0;
  const isOnline = settings.status === "online";

  return (
    <div style={styles.container}>
      {/* HERO BANNER */}
      <section style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <div style={styles.heroIcon}>🤖</div>
          <div style={styles.heroText}>
            <div style={styles.heroLabel}>Telegram Bot Panel</div>
            <h1 style={styles.heroTitle}>
              {settings.botName || "Stella Bot"}
            </h1>
            <p style={styles.heroSubtitle}>
              Terhubung ke Pterodactyl · Prefix{" "}
              <code style={styles.inlineCode}>{settings.prefix || "!"}</code>
            </p>
          </div>
        </div>
        <div style={styles.heroBadges}>
          <span style={{
            ...styles.statusBadge,
            ...(isOnline ? styles.statusOnline : styles.statusOffline)
          }}>
            <span style={styles.statusDot} />
            {isOnline ? "Online" : "Offline"}
          </span>
          <Link href="/settings" style={styles.heroLink}>
            Kelola Settings →
          </Link>
        </div>
      </section>

      {/* BREADCRUMB */}
      <nav style={styles.breadcrumb}>
        Home / <span style={styles.breadcrumbActive}>Overview</span>
      </nav>

      {/* PAGE HEADER */}
      <section style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Dashboard Overview</h2>
        <p style={styles.pageDescription}>
          Ringkasan lengkap status bot Telegram yang berjalan di Pterodactyl, 
          dengan monitoring real-time dan konfigurasi utama sistem.
        </p>
      </section>

      {/* BOT STATUS CARD */}
      <section style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <div style={styles.statusInfo}>
            <span style={styles.statusLabel}>Active Bot</span>
            <h3 style={styles.statusName}>{settings.botName || "Stella Bot"}</h3>
          </div>
          <div style={styles.statusBadges}>
            <span style={{
              ...styles.badge,
              ...(isOnline ? styles.badgeSuccess : styles.badgeWarning)
            }}>
              <span style={{
                ...styles.badgeDot,
                backgroundColor: isOnline ? "#22c55e" : "#f97316"
              }} />
              {isOnline ? "Online" : "Unknown"}
            </span>
            <span style={styles.badgeDefault}>
              Prefix: <strong>{settings.prefix || "!"}</strong>
            </span>
          </div>
        </div>

        <div style={styles.statusBody}>
          <div style={styles.statusDescription}>
            <p style={styles.descText}>
              Pengaturan yang kamu ubah dari panel ini akan dibaca secara 
              berkala oleh bot di Pterodactyl melalui endpoint{" "}
              <code style={styles.codeBlock}>/api/settings</code>.
            </p>
          </div>
          
          <div style={styles.infoGrid}>
            <InfoItem 
              label="Welcome Message" 
              value={settings.welcomeMessage 
                ? truncate(settings.welcomeMessage, 45)
                : "Belum diatur"
              }
            />
            <InfoItem 
              label="Auto Reply" 
              value={settings.autoReply 
                ? truncate(settings.autoReply, 45)
                : "Belum diatur"
              }
            />
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Statistik Real-Time</h3>
        <div style={styles.statsGrid}>
          <StatCard
            icon="📊"
            title="Status Bot"
            value={isOnline ? "Online" : "Unknown"}
            color={isOnline ? "#22c55e" : "#f97316"}
          />
          <StatCard
            icon="💬"
            title="Total Commands"
            value={totalCommands}
            color="#3b82f6"
          />
          <StatCard
            icon="✅"
            title="Commands Aktif"
            value={enabledCommands}
            color="#8b5cf6"
          />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <ActionCard
            href="/settings"
            icon="⚙️"
            title="Edit Bot Settings"
            description="Ubah nama bot, prefix, welcome message, dan auto reply."
          />
          <ActionCard
            href="/commands"
            icon="💬"
            title="Kelola Commands"
            description="Aktifkan atau nonaktifkan command yang tersedia untuk bot."
          />
          <ActionCard
            href="/logs"
            icon="📝"
            title="Lihat Panel Logs"
            description="Pantau riwayat perubahan pengaturan dari control panel."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Bot Control Panel · Powered by Next.js & Telegram Bot API
        </p>
      </footer>
    </div>
  );
}

// COMPONENTS
function StatCard({ icon, title, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statContent}>
        <span style={styles.statLabel}>{title}</span>
        <span style={{ ...styles.statValue, color }}>{value}</span>
      </div>
    </div>
  );
}

function ActionCard({ href, icon, title, description }) {
  return (
    <Link href={href} style={styles.actionCard}>
      <div style={styles.actionIcon}>{icon}</div>
      <div style={styles.actionContent}>
        <h4 style={styles.actionTitle}>{title}</h4>
        <p style={styles.actionDescription}>{description}</p>
        <span style={styles.actionArrow}>Buka →</span>
      </div>
    </Link>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

// HELPER
function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}

// STYLES
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    maxWidth: "100%"
  },

  // LOADING
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    gap: 16
  },

  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e5e7eb",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },

  loadingText: {
    color: "#6b7280",
    fontSize: 14
  },

  errorContainer: {
    padding: "40px 20px",
    textAlign: "center"
  },

  errorText: {
    color: "#ef4444",
    fontSize: 14
  },

  // HERO BANNER
  heroBanner: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "relative",
    overflow: "hidden"
  },

  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    zIndex: 1
  },

  heroIcon: {
    width: 56,
    height: 56,
    minWidth: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    backdropFilter: "blur(10px)"
  },

  heroText: {
    flex: 1,
    minWidth: 0
  },

  heroLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
    marginBottom: 4
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    marginBottom: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    margin: 0
  },

  inlineCode: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600
  },

  heroBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    zIndex: 1
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    backdropFilter: "blur(10px)",
    WebkitTapHighlightColor: "transparent"
  },

  statusOnline: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.3)"
  },

  statusOffline: {
    backgroundColor: "rgba(251, 146, 60, 0.2)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.3)"
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },

  heroLink: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s ease",
    WebkitTapHighlightColor: "transparent"
  },

  // BREADCRUMB
  breadcrumb: {
    fontSize: 13,
    color: "#9ca3af"
  },

  breadcrumbActive: {
    color: "#4b5563",
    fontWeight: 500
  },

  // PAGE HEADER
  pageHeader: {
    marginBottom: 8
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 8
  },

  pageDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0
  },

  // STATUS CARD
  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
  },

  statusHeader: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderBottom: "1px solid #f3f4f6"
  },

  statusInfo: {
    flex: 1
  },

  statusLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#9ca3af",
    fontWeight: 600,
    display: "block",
    marginBottom: 4
  },

  statusName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0
  },

  statusBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600
  },

  badgeSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },

  badgeWarning: {
    backgroundColor: "#fed7aa",
    color: "#9a3412"
  },

  badgeDefault: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #e5e7eb"
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%"
  },

  statusBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 20
  },

  statusDescription: {
    flex: 1
  },

  descText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0
  },

  codeBlock: {
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 13,
    color: "#1f2937",
    fontFamily: "monospace"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },

  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500
  },

  infoValue: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: 500
  },

  // SECTIONS
  section: {
    marginTop: 8
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 16
  },

  // STATS GRID
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16
  },

  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease"
  },

  statIcon: {
    fontSize: 32,
    lineHeight: 1
  },

  statContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4
  },

  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: 500
  },

  statValue: {
    fontSize: 24,
    fontWeight: 700
  },

  // ACTIONS GRID
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16
  },

  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    gap: 16,
    textDecoration: "none",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease",
    WebkitTapHighlightColor: "transparent"
  },

  actionIcon: {
    fontSize: 28,
    lineHeight: 1
  },

  actionContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    margin: 0
  },

  actionDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.5,
    margin: 0
  },

  actionArrow: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: 600,
    marginTop: 4
  },

  // FOOTER
  footer: {
    marginTop: 16,
    paddingTop: 20,
    borderTop: "1px solid #e5e7eb"
  },

  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    margin: 0
  }
};

// RESPONSIVE MEDIA QUERIES
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (min-width: 640px) {
      .hero-banner {
        padding: 32px !important;
      }
      
      .status-header {
        flex-direction: row !important;
        align-items: center !important;
      }
      
      .status-body {
        flex-direction: row !important;
      }
    }
    
    @media (min-width: 768px) {
      .hero-title {
        font-size: 28px !important;
      }
      
      .page-title {
        font-size: 32px !important;
      }
      
      .stats-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    
    @media (hover: hover) {
      a:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      }
      
      .action-card:hover {
        border-color: #3b82f6;
      }
      
      .stat-card:hover {
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      }
    }
    
    a:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(styleSheet);
      }
