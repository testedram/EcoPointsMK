import { getActiveSession, getLastEvent, addEvent, updateUser, getUserById } from '../../lib/db';

const ARDUINO_SECRET = process.env.ARDUINO_SECRET || 'arduino-secret-2024';
const COOLDOWN_MS = 3000; // 3 seconds anti-spam

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify Arduino bridge secret
  const secret = req.headers['x-arduino-secret'];
  if (secret !== ARDUINO_SECRET) {
    return res.status(401).json({ error: 'Неовластен пристап' });
  }

  const { event, binId } = req.body;
  if (event !== 'ITEM_DETECTED') return res.status(400).json({ error: 'Непознат настан' });
  if (!binId) return res.status(400).json({ error: 'binId е потребен' });

  // Check cooldown - anti-spam
  const lastEvent = getLastEvent(binId);
  const now = Date.now();
  if (lastEvent && (now - lastEvent.timestamp) < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastEvent.timestamp)) / 1000);
    return res.status(429).json({ error: `Cooldown активен. Почекај ${remaining}с.` });
  }

  // Check active session
  const session = getActiveSession(binId);
  if (!session) {
    return res.status(404).json({ error: 'Нема активна сесија за оваа канта' });
  }

  // Add event log
  addEvent({ binId, userId: session.userId, timestamp: now });

  // Add point to user
  const user = getUserById(session.userId);
  if (!user) return res.status(404).json({ error: 'Корисникот не постои' });

  const updated = updateUser(session.userId, { points: user.points + 1 });

  res.json({
    ok: true,
    userId: session.userId,
    username: session.username,
    newPoints: updated.points
  });
}
