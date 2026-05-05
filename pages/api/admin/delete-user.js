import { deleteUser } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const cookie = req.headers.cookie || '';
  if (!cookie.includes('admin_auth=true')) {
    return res.status(401).json({ error: 'Неовластен пристап' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId е потребен' });
  }

  const ok = await deleteUser(userId);

  if (!ok) {
    return res.status(404).json({ error: 'Корисникот не постои' });
  }

  res.json({ ok: true });
}
