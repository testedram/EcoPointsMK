import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/dashboard');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Грешка при поврзување со серверот');
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Smart Eco Points · Најава</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="page-wrap" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 22, margin: '0 auto 18px',
              background: 'linear-gradient(135deg,#1a4a22,#0f2e14)',
              border: '1px solid rgba(61,220,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
              boxShadow: '0 0 40px rgba(61,220,94,0.2)'
            }}>♻️</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#a8ffb0,#c8ff6a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Smart Eco Points</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>Рециклирај · Освојувај · Наградувај се 🌿</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(61,220,94,0.1)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 500, transition: 'all .2s',
                  background: mode === m ? 'rgba(61,220,94,0.12)' : 'transparent',
                  color: mode === m ? 'var(--green)' : 'var(--muted)'
                }}>
                {m === 'login' ? '🔑 Најава' : '📝 Регистрација'}
              </button>
            ))}
          </div>

          {/* Form card */}
          <form className="card" onSubmit={handleSubmit} style={{ borderRadius: 24 }}>
            <div className="field">
              <label>Корисничко ime</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="вашеime" required autoFocus />
            </div>
            <div className="field">
              <label>Лозинка</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            {error && <div className="error-msg">⚠️ {error}</div>}
            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
              {loading ? '⏳ Се обработува...' : mode === 'login' ? '→ Најави се' : '→ Регистрирај се'}
            </button>
          </form>

          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 32, padding: 20, background: 'rgba(61,220,94,0.04)', borderRadius: 16, border: '1px solid rgba(61,220,94,0.08)' }}>
            {[['♻️','Рециклирај'],['🏆','Освојувај поени'],['🎁','Добивај награди']].map(([icon,lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
