import { getUsers } from '../../../lib/db';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-2024';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Неовластен пристап' });
  }

  const users = await getUsers();
  const safe = users
    .map(u => ({ id: u.id, username: u.username, points: u.points, createdAt: u.createdAt }))
    .sort((a, b) => b.points - a.points);
  
  res.json({ users: safe });
}
