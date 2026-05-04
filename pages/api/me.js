import { getUserFromRequest } from '../../lib/auth';
import { getUserById } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: 'Не си најавен' });
  const user = await getUserById(decoded.id);
  if (!user) return res.status(404).json({ error: 'Корисникот не постои' });
  res.json({ id: user.id, username: user.username, points: user.points, createdAt: user.createdAt });
}
