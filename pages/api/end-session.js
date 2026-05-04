import { getUserFromRequest } from '../../lib/auth';
import { getActiveSession, endSession } from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: 'Не си најавен' });

  const { binId } = req.body;
  const session = getActiveSession(binId);
  if (!session) return res.status(404).json({ error: 'Нема активна сесија' });
  if (session.userId !== decoded.id) return res.status(403).json({ error: 'Немаш право да ја завршиш оваа сесија' });

  endSession(session.id);
  res.json({ ok: true });
}
