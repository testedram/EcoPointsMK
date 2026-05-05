const cookie = req.headers.cookie || '';
if (!cookie.includes('admin_auth=true')) {
  return res.status(401).json({ error: 'Неовластен пристап' });
}
