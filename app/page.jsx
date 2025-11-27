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
        body: JSON.stringify({
          prefix,
          welcomeMessage
        })
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
        justifyContent: 'center',
        alignItems: 'center',
        background: '#020617',
        color: '#e5e7eb',
        fontFamily: 'system-ui, sans-serif',
        padding: '1.5rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#020617',
          borderRadius: '1.5rem',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          padding: '1.75rem',
          boxShadow:
            '0 24px 60px rgba(15,23,42,0.75)'
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}
        >
          Telegram Bot Panel
        </h1>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            marginBottom: '1.5rem'
          }}
        >
          Ubah pengaturan bot yang sedang jalan di Pterodactyl.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                marginBottom: '0.25rem'
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
                padding: '0.6rem 0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(148, 163, 184, 0.45)',
                background: '#020617',
                color: '#e5e7eb',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                marginBottom: '0.25rem'
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
                border: '1px solid rgba(148, 163, 184, 0.45)',
                background: '#020617',
                color: '#e5e7eb',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.25rem',
              width: '100%',
              padding: '0.7rem',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: loading ? 'wait' : 'pointer',
              background:
                'linear-gradient(135deg, #22c55e, #3b82f6)'
            }}
          >
            {loading ? 'Menyimpan…' : 'Simpan Pengaturan'}
          </button>

          {saved && (
            <p
              style={{
                fontSize: '0.8rem',
                color: '#4ade80',
                marginTop: '0.25rem'
              }}
            >
              ✅ Tersimpan! Bot akan ambil setting baru dalam beberapa detik.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
