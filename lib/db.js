import { kv } from '@vercel/kv';

// USERS

export async function getUsers() {
  const keys = await kv.keys('user:*');

  if (!keys.length) return [];

  const users = await Promise.all(
    keys.map((k) => kv.get(k))
  );

  return users.filter(Boolean);
}

export async function getUserById(id) {
  return await kv.get(`user:${id}`);
}

export async function getUserByUsername(username) {
  const id = await kv.get(`username:${username}`);

  if (!id) return null;

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

// SESSIONS

export async function getActiveSession(binId) {
  const session = await kv.get(`session:bin:${binId}`);

  if (!session) return null;

  const now = Date.now();

  if (!session.active || (now - session.startedAt) >= 30000) {
    await kv.del(`session:bin:${binId}`);
    return null;
  }

  return session;
}

export async function createSession(session) {
  await kv.set(`session:bin:${session.binId}`, session, { ex: 31 });

  return session;
}

export async function endSession(binId) {
  await kv.del(`session:bin:${binId}`);
}

// COOLDOWN (anti-spam)

export async function getLastEvent(binId) {
  return await kv.get(`lastevent:${binId}`);
}

export async function addEvent(binId) {
  await kv.set(`lastevent:${binId}`, Date.now(), { ex: 10 });
}
