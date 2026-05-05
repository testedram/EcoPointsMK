import { getUserById, updateUser } from '../../../lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-2024';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Неовластен пристап' });
  }

  const { userId, points } = req.body;
  if (!userId || points === undefined) {
    return res.status(400).json({ error: 'userId и points се потребни' });
  }

  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ error: 'Корисникот не постои' });

  const newPoints = Math.max(0, user.points + parseInt(points));
  const updated = await updateUser(userId, { points: newPoints });

  res.json({ ok: true, username: updated.username, newPoints: updated.points });
}
