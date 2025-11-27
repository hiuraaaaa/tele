// app/PanelShell.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PanelShell({ children }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, isMobile]);

  const menu = [
    { href: "/", label: "Overview", icon: "📊" },
    { href: "/settings", label: "Bot Settings", icon: "⚙️" },
    { href: "/commands", label: "Commands", icon: "💬" },
    { href: "/logs", label: "Logs", icon: "📝" }
  ];

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.navbarContent}>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            style={styles.menuButton}
          >
            <span style={styles.menuIcon}>{open ? "✕" : "☰"}</span>
          </button>
          <span style={styles.navbarTitle}>Bot Control Panel</span>
          <div style={styles.navbarSpacer} />
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          boxShadow: open ? "2px 0 12px rgba(0,0,0,0.15)" : "none"
        }}
      >
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>Navigation</span>
        </div>

        <nav style={styles.nav}>
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navLink,
                  ...(active ? styles.navLinkActive : {})
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div style={styles.sidebarFooter}>
          <div style={styles.footerText}>v1.0.0</div>
        </div>
      </aside>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={styles.backdrop}
        />
      )}

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        <div style={styles.mainContent}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    position: "relative"
  },

  // NAVBAR
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    zIndex: 1000,
    transition: "all 0.3s ease"
  },

  navbarContent: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 12
  },

  menuButton: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    outline: "none",
    WebkitTapHighlightColor: "transparent"
  },

  menuIcon: {
    fontSize: 20,
    lineHeight: 1,
    color: "#333"
  },

  navbarTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: "#1a1a1a",
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  navbarSpacer: {
    width: 40,
    minWidth: 40
  },

  // SIDEBAR
  sidebar: {
    position: "fixed",
    top: 56,
    left: 0,
    bottom: 0,
    width: 280,
    maxWidth: "85vw",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    padding: "20px 0",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch"
  },

  sidebarHeader: {
    padding: "0 20px 16px",
    borderBottom: "1px solid #f0f0f0"
  },

  sidebarTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#999"
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 12px",
    gap: 4,
    flex: 1
  },

  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#666",
    fontSize: 15,
    fontWeight: 500,
    transition: "all 0.2s ease",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent"
  },

  navLinkActive: {
    backgroundColor: "#f0f7ff",
    color: "#1a73e8",
    fontWeight: 600
  },

  navIcon: {
    fontSize: 18,
    lineHeight: 1
  },

  sidebarFooter: {
    padding: "16px 20px",
    borderTop: "1px solid #f0f0f0",
    marginTop: "auto"
  },

  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center"
  },

  // BACKDROP
  backdrop: {
    position: "fixed",
    top: 56,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998,
    animation: "fadeIn 0.3s ease"
  },

  // MAIN CONTENT
  main: {
    paddingTop: 72,
    paddingBottom: 24,
    minHeight: "100vh"
  },

  mainContent: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 16px"
  }
};

// Add CSS for animations
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @media (min-width: 768px) {
      .desktop-main-offset {
        padding-left: 0 !important;
      }
    }
    
    button:active {
      transform: scale(0.95);
    }
    
    a:active {
      opacity: 0.7;
    }
  `;
  document.head.appendChild(styleSheet);
}
