import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-admin-secret'];

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const user = await kv.get(`user:${userId}`);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await kv.del(`user:${userId}`);
  await kv.del(`username:${user.username}`);

  return res.status(200).json({ ok: true });
}
