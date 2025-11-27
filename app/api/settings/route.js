// app/api/settings/route.js

const DEFAULT_SETTINGS = {
  status: "online",
  botName: "Stella Bot",
  prefix: "!",
  welcomeMessage: "Halo, aku Stella Bot. Siap membantu ✨",
  autoReply: "Terima kasih, pesannya sudah diterima.",
  commands: [
    { key: "ping", description: "Cek respon bot", enabled: true },
    { key: "welcome", description: "Kirim pesan sambutan", enabled: true }
  ],
  logs: []
};

let SETTINGS = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

function addLog(message) {
  const time = new Date().toISOString();
  SETTINGS.logs.unshift({ time, message });
  if (SETTINGS.logs.length > 50) {
    SETTINGS.logs = SETTINGS.logs.slice(0, 50);
  }
}

export async function GET() {
  return Response.json(SETTINGS, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Reset ke default
    if (body.reset === true) {
      SETTINGS = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      addLog("Settings di-reset ke default");
      return Response.json(SETTINGS, { status: 200 });
    }

    const patch = {};

    if (typeof body.botName === "string") patch.botName = body.botName;
    if (typeof body.prefix === "string") patch.prefix = body.prefix;
    if (typeof body.welcomeMessage === "string") patch.welcomeMessage = body.welcomeMessage;
    if (typeof body.autoReply === "string") patch.autoReply = body.autoReply;
    if (Array.isArray(body.commands)) patch.commands = body.commands;
    if (typeof body.status === "string") patch.status = body.status;

    SETTINGS = { ...SETTINGS, ...patch };
    addLog("Settings diperbarui dari panel");

    return Response.json(SETTINGS, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
