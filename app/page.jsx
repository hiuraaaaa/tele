'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [prefix, setPrefix] = useState('!');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setPrefix(data.prefix || '!');
        setWelcomeMessage(data.welcomeMessage || '');
      } catch (e) {
        console.error('Gagal load settings:', e);
      }
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prefix, welcomeMessage })
      });

      if (!res.ok) throw new Error('Gagal simpan');

      setSaved(true);
    } catch (e) {
      alert('Gagal menyimpan pengaturan: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.2rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
          padding: '1.8rem'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#9ca3af',
              margin: 0
            }}
          >
            Telegram Bot Panel
          </p>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0.25rem 0 0.35rem'
            }}
          >
            Bot Configuration
          </h1>
          <p
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              margin: 0
            }}
          >
            Ubah pengaturan bot yang sedang berjalan di Pterodactyl tanpa perlu restart
            server.
          </p>
        </div>

        {/* “Badge” gaya tech stack */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem'
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: '1px solid #e5e7eb'
            }}
          >
            Next.js
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: '1px solid #e5e7eb'
            }}
          >
            Telegram Bot
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: '1px solid #e5e7eb'
            }}
          >
            Control Panel
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#4b5563'
              }}
            >
              Prefix Command
            </label>
            <input
              type="text"
              maxLength={3}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.9rem',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af'
              }}
            >
              Contoh: <code style={{ background: '#f3f4f6', padding: '0.05rem 0.25rem', borderRadius: '0.25rem' }}>!</code>,{' '}
              <code style={{ background: '#f3f4f6', padding: '0.05rem 0.25rem', borderRadius: '0.25rem' }}>?</code>,{' '}
              <code style={{ background: '#f3f4f6', padding: '0.05rem 0.25rem', borderRadius: '0.25rem' }}>.</code>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#4b5563'
              }}
            >
              Welcome Message
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: '#f9fafb'
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af'
              }}
            >
              Pesan ini akan dikirim saat kamu pakai command <code>prefix + welcome</code>.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.7rem',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: loading ? 'wait' : 'pointer',
              background:
                'linear-gradient(135deg, #22c55e, #3b82f6)',
              color: 'white',
              boxShadow: '0 12px 20px rgba(59,130,246,0.25)'
            }}
          >
            {loading ? 'Menyimpan…' : 'Simpan Pengaturan'}
          </button>

          {saved && (
            <p
              style={{
                fontSize: '0.8rem',
                color: '#16a34a',
                marginTop: '0.25rem'
              }}
            >
              ✅ Tersimpan! Bot akan mengambil pengaturan baru dalam beberapa detik.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
