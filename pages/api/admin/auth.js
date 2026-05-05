export default function handler(req, res) {
  const cookie = req.headers.cookie || '';

  if (cookie.includes('admin_auth=true')) {
    return res.json({ ok: true });
  }

  res.status(401).json({ ok: false });
}
