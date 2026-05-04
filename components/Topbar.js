import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Topbar({ user }) {
  const router = useRouter();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  }

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '??';

  return (
    <nav className="topbar">
      <Link href="/dashboard" className="topbar-logo">
        <div className="logo-icon">♻</div>
        Smart Eco Points
      </Link>

      <div style={{ display: 'flex', gap: 4 }}>
        {[
          ['/dashboard', '🏠 Почетна'],
          ['/bin/1', '🗑️ Канта'],
          ['/leaderboard', '🏆 Leaderboard'],
          ['/rewards', '🎁 Награди'],
        ].map(([href, label]) => (
          <Link key={href} href={href} style={{
            padding: '7px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            color: router.pathname === href ? 'var(--green)' : 'var(--muted)',
            background: router.pathname === href ? 'rgba(61,220,94,0.08)' : 'transparent',
            border: `1px solid ${router.pathname === href ? 'rgba(61,220,94,0.2)' : 'transparent'}`,
            transition: 'all .2s'
          }}>{label}</Link>
        ))}
      </div>

      <div className="topbar-right">
        {user && (
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <span className="chip-name">{user.username}</span>
            <span className="chip-pts">· {user.points} pts</span>
          </div>
        )}
        <button className="btn btn-danger" style={{ padding: '7px 14px', fontSize: 13 }} onClick={logout}>
          Одјави се
        </button>
      </div>
    </nav>
  );
}
