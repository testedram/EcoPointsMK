import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { username, delta } = req.body;

  if (!username || typeof delta !== 'number') {
    return res.status(400).json({ error: 'Bad request' });
  }

  // најди userId преку username mapping
  const userId = await kv.get(`username:${username}`);
  if (!userId) return res.status(404).json({ error: 'User not found' });

  const user = await kv.get(`user:${userId}`);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = {
    ...user,
    points: (user.points || 0) + delta,
  };

  await kv.set(`user:${userId}`, updated);

  res.json(updated);
}
