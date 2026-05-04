import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUserByUsername, createUser } from '../../lib/db';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Потребни се корисничко ime и лозинка' });
  if (username.length < 3) return res.status(400).json({ error: 'Корисничкото ime мора да има барем 3 знаци' });
  if (password.length < 4) return res.status(400).json({ error: 'Лозинката мора да има барем 4 знаци' });

  const existing = await getUserByUsername(username);
  if (existing) return res.status(400).json({ error: 'Корисникот веќе постои' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ id: uuidv4(), username, password: hashed, points: 0, createdAt: Date.now() });
  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, user: { id: user.id, username: user.username, points: user.points } });
}
