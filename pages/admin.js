import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminPage() {
  const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin-secret-2024';
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [customPoints, setCustomPoints] = useState({});

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-secret': ADMIN_SECRET }
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setAuthed(true);
      setError('');
    } else {
      setError('Погрешна лозинка!');
    }
  }

  useEffect(() => {
    if (authed) fetchUsers();
  }, [authed]);

  async function addPoints(userId, pts) {
    const res = await fetch('/api/admin/update-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({ userId, points: pts })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(`✓ ${data.username}: ${data.newPoints} поени`);
      fetchUsers();
    } else {
      showToast(data.error, 'error');
    }
  }

  if (!authed) {
    return (
      <>
        <Head><title>Admin · Smart Eco Points</title></Head>
        <div className="orb orb1" /><div className="orb orb2" />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, borderRadius: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800 }}>Admin Панел</h1>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Smart Eco Points</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Admin Лозинка</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {error && <div className="error-msg">⚠️ {error}</div>}
              <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 12 }}>
                → Влези
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin Панел · Smart Eco Points</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav className="topbar">
          <div className="topbar-logo">
            <div className="logo-icon">♻</div>
            Admin Панел
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              {users.length} корисници
            </span>
            <button className="btn btn-secondary" onClick={fetchUsers} style={{ padding: '8px 16px', fontSize: 13 }}>
              🔄 Освежи
            </button>
            <button className="btn btn-danger" onClick={() => setAuthed(false)} style={{ padding: '8px 16px', fontSize: 13 }}>
              Одјави се
            </button>
          </div>
        </nav>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800 }}>
              👥 Управување со корисници
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>
              Додавај или одземај поени на секој корисник
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Вкупно корисници', value: users.length, icon: '👥' },
              { label: 'Вкупно поени', value: users.reduce((s, u) => s + u.points, 0), icon: '🏆' },
              { label: 'Просечни поени', value: users.length ? Math.round(users.reduce((s, u) => s + u.points, 0) / users.length) : 0, icon: '📊' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Листа на корисници
            </div>

            {loading && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>Се вчитува...</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 14,
                  background: 'rgba(61,220,94,0.03)',
                  border: '1px solid rgba(61,220,94,0.1)',
                }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--muted)', width: 24, fontSize: 13 }}>
                    #{i + 1}
                  </div>
                  <div className="avatar" style={{ width: 38, height: 38, fontSize: 13, flexShrink: 0 }}>
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{u.username}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      Регистриран: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('mk-MK') : 'N/A'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 70 }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>
                      {u.points}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>поени</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => addPoints(u.id, 1)}
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        border: '1px solid rgba(61,220,94,0.3)',
                        background: 'rgba(61,220,94,0.08)', color: 'var(--green)',
                        fontSize: 18, cursor: 'pointer', fontWeight: 700
                      }}
                    >+</button>
                    <button
                      onClick={() => addPoints(u.id, -1)}
                      style={{
                        width: 34, height: 34, borderRadius: 9,
                        border: '1px solid rgba(255,107,107,0.3)',
                        background: 'rgba(255,107,107,0.08)', color: 'var(--red)',
                        fontSize: 18, cursor: 'pointer', fontWeight: 700
                      }}
                    >−</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <input
                      type="number"
                      placeholder="±"
                      value={customPoints[u.id] || ''}
                      onChange={e => setCustomPoints(p => ({ ...p, [u.id]: e.target.value }))}
                      style={{
                        width: 60, padding: '7px 10px', borderRadius: 9, fontSize: 14,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(61,220,94,0.2)',
                        color: 'var(--text)', outline: 'none', textAlign: 'center'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      style={{ padding: '7px 14px', fontSize: 13 }}
                      onClick={() => {
                        const pts = parseInt(customPoints[u.id]);
                        if (!isNaN(pts)) {
                          addPoints(u.id, pts);
                          setCustomPoints(p => ({ ...p, [u.id]: '' }));
                        }
                      }}
                    >OK</button>
                  </div>
                </div>
              ))}

              {users.length === 0 && !loading && (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
                  Нема регистрирани корисници уште.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}
