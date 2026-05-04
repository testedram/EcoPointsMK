import Head from 'next/head';
import Topbar from '../components/Topbar';
import useAuth from '../hooks/useAuth';

const REWARDS = [
  { id: 1, emoji: '☕', name: 'Бесплатно кафе', place: 'Green Café · Битола', cost: 100, color: '#8B4513' },
  { id: 2, emoji: '🎬', name: 'Билет за кино', place: 'Cineplex · Битола', cost: 150, color: '#4169E1' },
  { id: 3, emoji: '📚', name: 'Попуст 20% на курс', place: 'Смарт Академија', cost: 200, color: '#6A5ACD' },
  { id: 4, emoji: '🌿', name: 'Еко-торба пакет', place: 'Eco Store · Скопје', cost: 300, color: '#228B22' },
  { id: 5, emoji: '🍕', name: 'Попуст на пица', place: 'Pizzeria Verde · Битола', cost: 80, color: '#DC143C' },
  { id: 6, emoji: '🎮', name: 'Игровна сесија 1ч', place: 'Fun Zone · Скопје', cost: 120, color: '#FF8C00' },
];

export default function RewardsPage() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <>
      <Head><title>Награди · Smart Eco Points</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="page-wrap">
        <Topbar user={user} />
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 32, fontWeight: 800 }}>🎁 Награди</h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Потроши поени за вистински награди</p>
          </div>

          {/* Points balance */}
          <div className="card" style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#112a14,#0c1f0e)' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Твои поени</div>
              <div className="pts-big" style={{ fontSize: 52 }}>{user.points}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Следна награда за</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>
                {Math.max(0, REWARDS.find(r => r.cost > user.points)?.cost - user.points ?? 0)} поени
              </div>
            </div>
          </div>

          {/* Rewards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 16 }}>
            {REWARDS.map(reward => {
              const canAfford = user.points >= reward.cost;
              return (
                <div key={reward.id} className="card" style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  opacity: canAfford ? 1 : 0.6,
                  transition: 'all .25s',
                  cursor: canAfford ? 'pointer' : 'default',
                  border: canAfford ? '1px solid rgba(61,220,94,0.25)' : '1px solid rgba(61,220,94,0.08)'
                }}
                  onMouseEnter={e => canAfford && (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    background: `${reward.color}18`,
                    border: `1px solid ${reward.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
                  }}>{reward.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{reward.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{reward.place}</div>
                    {!canAfford && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                        Треба уште {reward.cost - user.points} поени
                        <div className="progress-bar" style={{ marginTop: 4 }}>
                          <div className="progress-fill" style={{ width: `${Math.min(100, (user.points / reward.cost) * 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: canAfford ? 'var(--accent)' : 'var(--muted)' }}>
                      {reward.cost}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>поени</div>
                    {canAfford && (
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>✓ Достапно</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 28 }}>
            За да ја искористиш наградата, прикажи го екранот на одговорниот наставник.
          </p>
        </main>
      </div>
    </>
  );
}
