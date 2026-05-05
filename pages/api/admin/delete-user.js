import { getUserById, deleteUser } from '../../../lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Неовластен пристап' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId е потребен' });
  }

  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'Корисникот не постои' });
  }

  await deleteUser(userId);

  res.json({ ok: true });
}
