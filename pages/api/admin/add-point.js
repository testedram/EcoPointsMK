import { getUsers, updateUser } from '../../../lib/db';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin-secret-2024';
const COOLDOWN_MS = 3000;
let lastEventTime = 0;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Неовластен' });
  }

  // Cooldown anti-spam
  const now = Date.now();
  if (now - lastEventTime < COOLDOWN_MS) {
    return res.status(429).json({ error: 'Cooldown' });
  }
  lastEventTime = now;

  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username е потребен' });

  const users = await getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: 'Корисникот не постои' });

  const updated = await updateUser(user.id, { points: user.points + 1 });
  res.json({ ok: true, username: updated.username, newPoints: updated.points });
}
