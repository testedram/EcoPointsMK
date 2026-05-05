import { getUsers } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const users = await getUsers();

  res.json({ users });
}
