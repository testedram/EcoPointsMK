import { getSession } from "@/lib/sessionStore";
import { updateUserPoints } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { sessionId, points } = req.body;

  const session = getSession();

  if (!session) {
    return res.status(400).json({ error: "No active session" });
  }

  if (session.sessionId !== sessionId) {
    return res.status(403).json({ error: "Invalid sessionId" });
  }

  await updateUserPoints(session.userId, points);

  return res.json({
    success: true,
    userId: session.userId,
    addedPoints: points
  });
}
