import { getSession, getUserById, updateUser } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { sessionId, points } = req.body;

  if (!sessionId || !points) {
    return res.status(400).json({ error: "Missing sessionId or points" });
  }

  const session = await getSession(sessionId);

  if (!session) {
    return res.status(400).json({ error: "Invalid session" });
  }

  const userId = session.userId;

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const updated = await updateUser(userId, {
    points: (user.points || 0) + Number(points)
  });

  return res.json({
    success: true,
    userId,
    added: Number(points),
    user: updated
  });
}
