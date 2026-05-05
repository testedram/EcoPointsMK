import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const secret = req.headers['x-admin-secret'];

  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const keys = await kv.keys('user:*');

    const users = await Promise.all(
      keys.map((k) => kv.get(k))
    );

    return res.status(200).json({
      users: users.filter(Boolean)
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
