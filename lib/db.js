import { kv } from '@vercel/kv';

/* ================= USERS ================= */

export async function getUsers() {
  const keys = await kv.keys('user:*');
  if (!keys.length) return [];

  const users = await Promise.all(keys.map(k => kv.get(k)));
  return users.filter(Boolean);
}

export async function getUserById(id) {
  return await kv.get(`user:${id}`);
}

export async function createUser(user) {
  await kv.set(`user:${user.id}`, user);
  await kv.set(`username:${user.username}`, user.id);
  return user;
}

export async function updateUser(id, updates) {
  const user = await kv.get(`user:${id}`);
  if (!user) return null;

  const updated = { ...user, ...updates };
  await kv.set(`user:${id}`, updated);

  return updated;
}

/* ================= SESSIONS ================= */

export async function createSession(session) {
  await kv.set(`session:${session.sessionId}`, session, { ex: 300 });
  return session;
}

export async function getSession(sessionId) {
  return await kv.get(`session:${sessionId}`);
}

export async function deleteSession(sessionId) {
  await kv.del(`session:${sessionId}`);
}
