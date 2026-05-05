export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;

  if (password === process.env.ADMIN_SECRET) {
    res.setHeader(
      'Set-Cookie',
      'admin_auth=true; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict'
    );
    return res.json({ ok: true });
  }

  res.status(401).json({ error: 'Погрешна лозинка' });
}
