import { getActiveSession } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { id } = req.query;
  const session = getActiveSession(id);
  const now = Date.now();
  if (session) {
    const remaining = Math.max(0, 30 - Math.floor((now - session.startedAt) / 1000));
    res.json({ active: true, username: session.username, userId: session.userId, remaining, sessionId: session.id });
  } else {
    res.json({ active: false });
  }
}
