import bcrypt from 'bcryptjs';
import { getUserByUsername } from '../../lib/db';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Внеси корисничко ime и лозинка' });

  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ error: 'Погрешно корисничко ime или лозинка' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Погрешно корисничко ime или лозинка' });

  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, user: { id: user.id, username: user.username, points: user.points } });
}
