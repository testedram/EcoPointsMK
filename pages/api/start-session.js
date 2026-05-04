import { v4 as uuidv4 } from 'uuid';
import { getUserFromRequest } from '../../lib/auth';
import { getActiveSession, createSession } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const decoded = getUserFromRequest(req);
  if (!decoded) return res.status(401).json({ error: 'Не си најавен' });

  const { binId } = req.body;
  if (!binId) return res.status(400).json({ error: 'binId е потребен' });

  const existing = await getActiveSession(binId);
  if (existing && existing.userId !== decoded.id) {
    return res.status(409).json({ error: 'Кантата е зафатена од друг корисник' });
  }

  const session = await createSession({
    id: uuidv4(), userId: decoded.id, username: decoded.username,
    binId, active: true, startedAt: Date.now()
  });
  res.json({ session });
}
