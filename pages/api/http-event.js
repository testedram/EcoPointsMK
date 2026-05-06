import { getActiveSession, getLastEvent, addEvent, updateUser, getUserById } from '../../lib/db';

const ARDUINO_SECRET = process.env.ARDUINO_SECRET || 'arduino-secret-2024';
const COOLDOWN_MS = 3000;

export default async function handler(req, res) {
  // Дозволи HTTP
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-arduino-secret'];
  if (secret !== ARDUINO_SECRET) return res.status(401).json({ error: 'Неовластен' });

  const { event, binId } = req.body;
  if (event !== 'ITEM_DETECTED') return res.status(400).json({ error: 'Непознат настан' });
  if (!binId) return res.status(400).json({ error: 'binId потребен' });

  const lastEvent = await getLastEvent(binId);
  const now = Date.now();
  if (lastEvent && (now - lastEvent) < COOLDOWN_MS) {
    return res.status(429).json({ error: 'Cooldown' });
  }

  const session = await getActiveSession(binId);
  if (!session) return res.status(404).json({ error: 'Нема сесија' });

  await addEvent(binId);
  const user = await getUserById(session.userId);
  if (!user) return res.status(404).json({ error: 'Нема корисник' });

  const updated = await updateUser(session.userId, { points: user.points + 1 });
  res.json({ ok: true, username: session.username, newPoints: updated.points });
}
