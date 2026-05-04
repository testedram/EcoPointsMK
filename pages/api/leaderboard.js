import { getUsers } from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const users = getUsers()
    .sort((a, b) => b.points - a.points)
    .slice(0, 20)
    .map((u, i) => ({ rank: i + 1, username: u.username, points: u.points, id: u.id }));
  res.json({ leaderboard: users });
}
