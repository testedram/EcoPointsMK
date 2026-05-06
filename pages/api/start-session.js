import { randomBytes } from "crypto";
import { createSession } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const sessionId = randomBytes(3).toString("hex").toUpperCase();

  await createSession({
    sessionId,
    userId,
    startedAt: Date.now()
  });

  return res.json({
    success: true,
    sessionId
  });
}
