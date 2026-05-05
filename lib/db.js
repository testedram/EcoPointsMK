import { kv } from '@vercel/kv';

// USERS
export async function getUsers() {
  const keys = await kv.keys('user:*');

  const users = await Promise.all(
    keys
      .filter(k => !k.includes('username:'))
      .map(k => kv.get(k))
  );

  return users.filter(Boolean);
}

export async function getUserById(id) {
  return kv.get(`user:${id}`);
}

export async function getUserByUsername(username) {
  if (!username) return null;

  const id = await kv.get(`username:${username}`);
  if (!id) return null;

  return kv.get(`user:${id}`);
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

export async function deleteUser(id) {
  const user = await kv.get(`user:${id}`);
  if (!user) return null;

  await kv.del(`user:${id}`);
  await kv.del(`username:${user.username}`);

  return true;
}
