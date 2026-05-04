import { getActiveSession, getLastEvent, addEvent, updateUser, getUserById } from '../../lib/db';

const ARDUINO_SECRET = process.env.ARDUINO_SECRET || 'arduino-secret-2024';
const COOLDOWN_MS = 3000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-arduino-secret'];
  if (secret !== ARDUINO_SECRET) return res.status(401).json({ error: 'Неовластен пристап' });

  const { event, binId } = req.body;
  if (event !== 'ITEM_DETECTED') return res.status(400).json({ error: 'Непознат настан' });
  if (!binId) return res.status(400).json({ error: 'binId е потребен' });

  const lastEvent = await getLastEvent(binId);
  const now = Date.now();
  if (lastEvent && (now - lastEvent) < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastEvent)) / 1000);
    return res.status(429).json({ error: `Cooldown активен. Почекај ${remaining}с.` });
  }

  const session = await getActiveSession(binId);
  if (!session) return res.status(404).json({ error: 'Нема активна сесија' });

  await addEvent(binId);

  const user = await getUserById(session.userId);
  if (!user) return res.status(404).json({ error: 'Корисникот не постои' });

  const updated = await updateUser(session.userId, { points: user.points + 1 });
  res.json({ ok: true, userId: session.userId, username: session.username, newPoints: updated.points });
}
