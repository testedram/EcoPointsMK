import { getUsers, updateUser } from '../../../lib/db';

const ARDUINO_SECRET = process.env.ARDUINO_SECRET || 'arduino-secret-2024';
const COOLDOWN_MS = 3000;
let lastTime = 0;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const secret = req.headers['x-arduino-secret'];
  if (secret !== ARDUINO_SECRET) return res.status(401).end();

  const now = Date.now();
  if (now - lastTime < COOLDOWN_MS) return res.status(429).end();
  lastTime = now;

  const { username } = req.body;
  if (!username) return res.status(400).end();

  const users = await getUsers();
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).end();

  const updated = await updateUser(user.id, { points: user.points + 1 });
  res.json({ ok: true, points: updated.points });
}
