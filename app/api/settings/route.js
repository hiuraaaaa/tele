let SETTINGS = {
  prefix: '!',
  welcomeMessage: 'Halo, aku bot dari Vercel 😄'
};

export async function GET() {
  return Response.json(SETTINGS, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    SETTINGS = { ...SETTINGS, ...body };
    return Response.json(SETTINGS, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
