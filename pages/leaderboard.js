import { useEffect, useState } from 'react';
import Head from 'next/head';
import Topbar from '../components/Topbar';
import useAuth from '../hooks/useAuth';

export default function LeaderboardPage() {
  const { user, token, loading } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setLeaderboard(d.leaderboard || []); setFetching(false); });
    const iv = setInterval(() => {
      fetch('/api/leaderboard').then(r => r.json()).then(d => setLeaderboard(d.leaderboard || []));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  if (loading || !user) return null;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const medals = ['🥇', '🥈', '🥉'];
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd visual order

  return (
    <>
      <Head><title>Leaderboard · Smart Eco Points</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="page-wrap">
        <Topbar user={user} />
        <main style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800 }}>🏆 Leaderboard</h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Топ рециклери во училиштето</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
              <div className="pulse" style={{ width: 6, height: 6 }} />
              Се ажурира на секои 5 секунди
            </div>
          </div>

          {/* Podium */}
          {top3.length >= 1 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, padding: '10px 0 20px' }}>
                {podiumOrder.map(idx => {
                  const u2 = top3[idx];
                  if (!u2) return <div key={idx} style={{ width: 100 }} />;
                  const isFirst = idx === 0;
                  const heights = [120, 90, 80];
                  return (
                    <div key={u2.id} style={{ textAlign: 'center', width: 100 }}>
                      {/* Avatar */}
                      <div style={{
                        width: isFirst ? 72 : 56, height: isFirst ? 72 : 56, borderRadius: '50%',
                        background: isFirst ? 'linear-gradient(135deg,var(--green),var(--accent))' : 'var(--card2)',
                        border: `2px solid ${isFirst ? 'rgba(200,255,106,0.6)' : 'rgba(61,220,94,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: isFirst ? 22 : 17,
                        color: isFirst ? '#061008' : 'var(--green)',
                        margin: '0 auto 10px',
                        boxShadow: isFirst ? '0 0 30px rgba(200,255,106,0.3)' : 'none'
                      }}>
                        {u2.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 22 }}>{medals[idx]}</div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginTop: 6, color: u2.id === user.id ? 'var(--accent)' : 'var(--text)' }}>
                        {u2.username}{u2.id === user.id ? ' 👈' : ''}
                      </div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--green)', marginTop: 4 }}>{u2.points}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>поени</div>
                      {/* Podium base */}
                      <div style={{
                        height: heights[idx], marginTop: 12, borderRadius: '10px 10px 0 0',
                        background: isFirst ? 'linear-gradient(180deg,rgba(61,220,94,0.2),rgba(61,220,94,0.05))' : 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(61,220,94,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22
                      }}>{medals[idx]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full list */}
          <div className="card">
            <div className="section-title">Целосна листа</div>
            {fetching && <p style={{ color: 'var(--muted)' }}>Се вчитува...</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {rest.map(u2 => (
                <div key={u2.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 13,
                  background: u2.id === user.id ? 'rgba(61,220,94,0.07)' : 'transparent',
                  border: `1px solid ${u2.id === user.id ? 'rgba(61,220,94,0.2)' : 'transparent'}`,
                  transition: 'background .2s'
                }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--muted)', width: 26, textAlign: 'center', fontSize: 14 }}>#{u2.rank}</span>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{u2.username.slice(0, 2).toUpperCase()}</div>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: u2.id === user.id ? 'var(--green)' : 'var(--text)' }}>
                    {u2.username}{u2.id === user.id ? ' 👈 Ти' : ''}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--green)' }}>{u2.points}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>поени</div>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && !fetching && (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>
                  Нема корисници уште. Биди прв! 🌱
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
