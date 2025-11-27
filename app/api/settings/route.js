// app/api/settings/route.js

const DEFAULT_SETTINGS = {
  status: 'online', // dummy status, nanti bisa dihubungin beneran dari bot
  botName: 'Stella Bot',
  prefix: '!',
  welcomeMessage: 'Halo, aku Stella Bot. Siap membantu ✨',
  autoReply: 'Terima kasih, pesannya sudah diterima.',
  commands: [
    { name: 'ping', description: 'Cek respon bot', enabled: true },
    { name: 'welcome', description: 'Kirim pesan sambutan', enabled: true }
  ],
  logs: []
};

let SETTINGS = structuredClone(DEFAULT_SETTINGS);

function addLog(message) {
  const time = new Date().toISOString();
  SETTINGS.logs.unshift({ time, message });
  // batasi log biar nggak bengkak
  if (SETTINGS.logs.length > 50) SETTINGS.logs = SETTINGS.logs.slice(0, 50);
}

export async function GET() {
  return Response.json(SETTINGS, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Reset full settings ke default
    if (body.reset === true) {
      SETTINGS = structuredClone(DEFAULT_SETTINGS);
      addLog('Settings di-reset ke default');
      return Response.json(SETTINGS, { status: 200 });
    }

    // Update biasa
    // hanya field yang dikirim yang di-merge
    const allowed = ['botName', 'prefix', 'welcomeMessage', 'autoReply', 'commands', 'status'];
    const patch = {};
    for (const key of allowed) {
      if (body[key] !== undefined) patch[key] = body[key];
    }

    SETTINGS = { ...SETTINGS, ...patch };
    addLog('Settings diperbarui dari panel');

    return Response.json(SETTINGS, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
