'use client';

import { useEffect, useState } from 'react';

export default function PanelPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error('Gagal load settings:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botName: settings.botName,
          prefix: settings.prefix,
          welcomeMessage: settings.welcomeMessage,
          autoReply: settings.autoReply,
          commands: settings.commands
        })
      });
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      alert('Gagal menyimpan pengaturan: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm('Reset semua pengaturan ke default?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      });
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      alert('Gagal reset pengaturan: ' + e.message);
    } finally {
      setResetting(false);
    }
  }

  function toggleCommandEnabled(index) {
    setSettings((prev) => {
      const updated = { ...prev };
      updated.commands = [...prev.commands];
      updated.commands[index] = {
        ...updated.commands[index],
        enabled: !updated.commands[index].enabled
      };
      return updated;
    });
  }

  if (!settings && loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Memuat panel…</span>
      </main>
    );
  }

  if (!settings) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#ef4444' }}>
          Gagal memuat pengaturan. Coba refresh halaman.
        </span>
      </main>
    );
  }

  const totalCommands = settings.commands?.length || 0;
  const enabledCommands = settings.commands?.filter((c) => c.enabled).length || 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex'
      }}
    >
      {/* Sidebar ala docs */}
      <aside
        style={{
          width: '250px',
          padding: '1.5rem 1.25rem',
          borderRight: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          display: 'none'
        }}
      >
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          Bot Control
        </h2>
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.86rem'
          }}
        >
          <a href="#overview" style={{ textDecoration: 'none', color: '#4b5563' }}>
            Overview
          </a>
          <a href="#settings" style={{ textDecoration: 'none', color: '#4b5563' }}>
            Bot Settings
          </a>
          <a href="#commands" style={{ textDecoration: 'none', color: '#4b5563' }}>
            Commands
          </a>
          <a href="#logs" style={{ textDecoration: 'none', color: '#4b5563' }}>
            Panel Logs
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: '1.5rem',
          maxWidth: '960px',
          margin: '0 auto'
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: '0.8rem',
            color: '#9ca3af',
            marginBottom: '0.75rem'
          }}
        >
          Home / <span style={{ color: '#4b5563' }}>Panel</span>
        </div>

        {/* Intro / Overview card */}
        <section id="overview">
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            Bot Overview
          </h1>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 18px 40px rgba(15,23,42,0.06)'
            }}
          >
            <h2
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                margin: 0,
                marginBottom: '0.5rem'
              }}
            >
              {settings.botName || 'Nama bot belum diatur'}
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6b7280',
                marginTop: 0,
                marginBottom: '1rem'
              }}
            >
              Panel ini memungkinkan kamu mengatur prefix, pesan otomatis, dan command bot
              Telegram yang berjalan di Pterodactyl tanpa perlu deploy ulang.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div
                style={{
                  flex: '0 0 140px',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '0.9rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginBottom: '0.25rem'
                  }}
                >
                  Status Bot
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '999px',
                      backgroundColor:
                        settings.status === 'online' ? '#22c55e' : '#f97316'
                    }}
                  />
                  {settings.status === 'online' ? 'Online' : 'Unknown'}
                </div>
              </div>

              <div
                style={{
                  flex: '0 0 160px',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '0.9rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginBottom: '0.25rem'
                  }}
                >
                  Total Commands
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                >
                  {totalCommands} commands
                </div>
              </div>

              <div
                style={{
                  flex: '0 0 160px',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '0.9rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    marginBottom: '0.25rem'
                  }}
                >
                  Commands Aktif
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                >
                  {enabledCommands} aktif
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Settings form */}
        <section id="settings">
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}
          >
            Bot Settings
          </h2>

          <form
            onSubmit={handleSave}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              marginBottom: '1.75rem',
              boxShadow: '0 14px 30px rgba(15,23,42,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.3rem'
                }}
              >
                Bot Name
              </label>
              <input
                type="text"
                value={settings.botName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, botName: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.3rem'
                }}
              >
                Prefix Command
              </label>
              <input
                type="text"
                maxLength={3}
                value={settings.prefix}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, prefix: e.target.value }))
                }
                style={{
                  width: '100%',
                  maxWidth: '120px',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.9rem'
                }}
              />
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#9ca3af',
                  marginTop: '0.25rem'
                }}
              >
                Contoh: <code>!</code>, <code>?</code>, <code>.</code>
              </p>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.3rem'
                }}
              >
                Welcome Message
              </label>
              <textarea
                rows={3}
                value={settings.welcomeMessage}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, welcomeMessage: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.3rem'
                }}
              >
                Auto Reply Message
              </label>
              <textarea
                rows={2}
                value={settings.autoReply}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, autoReply: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#9ca3af',
                  marginTop: '0.25rem'
                }}
              >
                Bisa kamu pakai untuk auto-respon default di handler bot.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '0.7rem 1.6rem',
                  borderRadius: '999px',
                  border: 'none',
                  background:
                    'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: saving ? 'wait' : 'pointer',
                  boxShadow: '0 14px 28px rgba(59,130,246,0.3)'
                }}
              >
                {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={resetting}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '999px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#ef4444',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  cursor: resetting ? 'wait' : 'pointer'
                }}
              >
                {resetting ? 'Mereset…' : 'Reset ke Default'}
              </button>
            </div>
          </form>
        </section>

        {/* Commands */}
        <section id="commands">
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}
          >
            Daftar Commands
          </h2>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #e5e7eb',
              padding: '1.2rem',
              marginBottom: '1.75rem'
            }}
          >
            {settings.commands.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                Belum ada command yang terdaftar.
              </p>
            )}

            {settings.commands.map((cmd, idx) => (
              <div
                key={cmd.name + idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.4rem',
                  borderBottom:
                    idx === settings.commands.length - 1
                      ? 'none'
                      : '1px solid #f3f4f6'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    {settings.prefix}
                    {cmd.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#6b7280'
                    }}
                  >
                    {cmd.description}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCommandEnabled(idx)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: '999px',
                    border: cmd.enabled
                      ? '1px solid #bbf7d0'
                      : '1px solid #e5e7eb',
                    backgroundColor: cmd.enabled ? '#dcfce7' : '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: cmd.enabled ? '#166534' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  {cmd.enabled ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Logs */}
        <section id="logs">
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}
          >
            Panel Logs
          </h2>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid #e5e7eb',
              padding: '1.2rem',
              marginBottom: '2rem'
            }}
          >
            {settings.logs.length === 0 ? (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#9ca3af'
                }}
              >
                Belum ada aktivitas di panel.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {settings.logs.slice(0, 10).map((log, i) => (
                  <li key={i} style={{ color: '#4b5563' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        marginRight: '0.4rem'
                      }}
                    >
                      {new Date(log.time).toLocaleString()}
                    </span>
                    {log.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
        }
