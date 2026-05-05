export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  if (password !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  return res.status(200).json({ ok: true });
}
