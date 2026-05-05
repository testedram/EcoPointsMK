import { getUserById, updateUser } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId, points } = req.body;

  const user = await getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = await updateUser(userId, {
    points: (user.points || 0) + Number(points)
  });

  res.json({
    username: updated.username,
    newPoints: updated.points
  });
}
