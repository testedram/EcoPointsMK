import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Topbar from '../components/Topbar';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { user, token, loading, refreshUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        setLeaderboard(data.leaderboard || []);
        const me = (data.leaderboard || []).find(u2 => u2.id === user.id);
        if (me) setMyRank(me.rank);
      });
  }, [user]);

  // Auto refresh every 10s
  useEffect(() => {
    if (!token) return;
    const iv = setInterval(refreshUser, 10000);
    return () => clearInterval(iv);
  }, [token]);

  if (loading || !user) return <LoadingScreen />;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 8);

  return (
    <>
      <Head><title>Dashboard · Smart Eco Points</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="page-wrap">
        <Topbar user={user} />
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

          {/* Greeting */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 34, fontWeight: 800 }}>
              Здраво, <span style={{ background: 'linear-gradient(90deg,var(--greenl),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user.username}!</span> 👋
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Продолжи да рециклираш и освојувај награди</p>
          </div>

          {/* Hero grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Points card */}
            <div className="card" style={{ background: 'linear-gradient(135deg,#112a14,#0c1f0e)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle,rgba(61,220,94,0.15),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Вкупни поени</div>
              <div className="pts-big">{user.points}</div>
              <div style={{ marginTop: 14 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, (user.points / 300) * 100)}%` }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{Math.max(0, 100 - user.points)} поени до следната награда</div>
              </div>
              {myRank && (
                <div className="badge badge-green" style={{ marginTop: 14 }}>🏆 Место #{myRank}</div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Брзи акции ⚡</div>
              {[
                { href: '/bin/1', icon: '🗑️', label: 'Канта #1 — Рециклирај', desc: 'Активирај сесија и освојувај поени' },
                { href: '/leaderboard', icon: '🏆', label: 'Leaderboard', desc: 'Види ја твојата позиција' },
                { href: '/rewards', icon: '🎁', label: 'Награди', desc: 'Потроши поени за наградa' },
              ].map(({ href, icon, label, desc }) => (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  background: 'rgba(61,220,94,0.04)', border: '1px solid rgba(61,220,94,0.1)',
                  borderRadius: 14, transition: 'all .2s', color: 'inherit'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(61,220,94,0.09)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(61,220,94,0.04)'}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(61,220,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>
                  </div>
                  <span style={{ color: 'var(--muted2)', fontSize: 18 }}>›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard preview */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div className="section-title" style={{ margin: 0 }}>🏆 Leaderboard</div>
              <Link href="/leaderboard" style={{ fontSize: 13, color: 'var(--green)' }}>Цела листа →</Link>
            </div>

            {/* Podium top 3 */}
            {top3.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(61,220,94,0.08)' }}>
                {[top3[1], top3[0], top3[2]].filter(Boolean).map((u2, i) => {
                  const isFirst = u2?.rank === 1;
                  const medals = ['🥈', '🥇', '🥉'];
                  return (
                    <div key={u2.id} style={{ textAlign: 'center', order: i === 1 ? 0 : i }}>
                      <div style={{
                        width: isFirst ? 64 : 50, height: isFirst ? 64 : 50, borderRadius: '50%',
                        background: isFirst ? 'linear-gradient(135deg,#2a3a18,#1a2a0c)' : 'var(--card2)',
                        border: `2px solid ${isFirst ? 'rgba(200,255,106,0.4)' : 'rgba(61,220,94,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: isFirst ? 20 : 15,
                        margin: '0 auto 8px', color: isFirst ? 'var(--accent)' : 'var(--green)'
                      }}>
                        {u2.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 11, marginBottom: 2 }}>{medals[i]}</div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{u2.username}</div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{u2.points}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rest list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {rest.map(u2 => (
                <div key={u2.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12,
                  background: u2.id === user.id ? 'rgba(61,220,94,0.06)' : 'transparent',
                  border: u2.id === user.id ? '1px solid rgba(61,220,94,0.15)' : '1px solid transparent'
                }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: 'var(--muted)', width: 20, textAlign: 'center', fontSize: 13 }}>{u2.rank}</span>
                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{u2.username.slice(0, 2).toUpperCase()}</div>
                  <span style={{ flex: 1, fontSize: 14, color: u2.id === user.id ? 'var(--green)' : 'var(--text)' }}>
                    {u2.username}{u2.id === user.id ? ' · Ти' : ''}
                  </span>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 600, color: u2.id === user.id ? 'var(--green)' : 'var(--muted)' }}>{u2.points} pts</span>
                </div>
              ))}
              {leaderboard.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>Сè уште нема корисници. Биди прв! 🌱</p>}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>♻️</div>
        <p style={{ color: 'var(--muted)' }}>Се вчитува...</p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
