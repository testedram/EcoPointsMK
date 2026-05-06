import { randomBytes } from "crypto";
import { setSession } from "@/lib/sessionStore";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;

  const sessionId = randomBytes(3).toString("hex").toUpperCase();

  const session = {
    sessionId,
    userId,
    createdAt: Date.now()
  };

  setSession(session);

  return res.json({
    success: true,
    sessionId,
    userId
  });
}
