import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-admin-secret'];

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId, points } = req.body;

  if (!userId || typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await kv.get(`user:${userId}`);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updated = {
    ...user,
    points: (user.points || 0) + points
  };

  await kv.set(`user:${userId}`, updated);

  return res.status(200).json({
    username: user.username,
    newPoints: updated.points
  });
}
