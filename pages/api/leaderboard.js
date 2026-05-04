import { getUsers } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const users = await getUsers();
  const leaderboard = users
    .sort((a, b) => b.points - a.points)
    .slice(0, 20)
    .map((u, i) => ({ rank: i + 1, username: u.username, points: u.points, id: u.id }));
  res.json({ leaderboard });
}
