import { getUserById, deleteUser } from '@/lib/db';

export default async function handler(req, res) {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.body;

  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ error: 'Not found' });

  await deleteUser(userId);

  res.json({ ok: true });
}
