import { clearSession } from "@/lib/sessionStore";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  clearSession();

  return res.json({ success: true });
}
