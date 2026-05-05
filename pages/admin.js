import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customPoints, setCustomPoints] = useState({});

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (data.ok) {
      setAuthed(true);
      fetchUsers();
    } else {
      alert('Wrong password');
    }
  }

  async function fetchUsers() {
    setLoading(true);

    const res = await fetch('/api/admin/users', {
      headers: { 'x-admin-secret': password }
    });

    const data = await res.json();

    setUsers(data.users || []);
    setLoading(false);
  }

  async function updatePoints(userId, points) {
    await fetch('/api/admin/update-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': password
      },
      body: JSON.stringify({ userId, points })
    });

    fetchUsers();
  }

  async function deleteUser(userId) {
    await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': password
      },
      body: JSON.stringify({ userId })
    });

    fetchUsers();
  }

  if (!authed) {
    return (
      <>
        <Head><title>Admin Login</title></Head>

        <div style={{ padding: 40 }}>
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
            />
            <button>Login</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin Panel</title></Head>

      <div style={{ padding: 20 }}>
        <h1>Admin Panel</h1>

        <button onClick={fetchUsers}>Refresh</button>

        {loading && <p>Loading...</p>}

        {users.map(u => (
          <div key={u.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <b>{u.username}</b> — {u.points || 0}

            <div style={{ marginTop: 10 }}>
              <button onClick={() => updatePoints(u.id, 1)}>+1</button>
              <button onClick={() => updatePoints(u.id, -1)}>-1</button>

              <input
                type="number"
                value={customPoints[u.id] || ''}
                onChange={e =>
                  setCustomPoints(p => ({ ...p, [u.id]: e.target.value }))
                }
              />

              <button
                onClick={() =>
                  updatePoints(u.id, Number(customPoints[u.id] || 0))
                }
              >
                Set
              </button>

              <button onClick={() => deleteUser(u.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
