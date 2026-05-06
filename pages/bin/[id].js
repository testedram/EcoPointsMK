import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Topbar from '../../components/Topbar';
import useAuth from '../../hooks/useAuth';

export default function BinPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token, loading, refreshUser } = useAuth();

  const [binStatus, setBinStatus] = useState(null);
  const [mySession, setMySession] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchBinStatus() {
    if (!id) return;
    try {
      const res = await fetch(`/api/bin/${id}`);
      const data = await res.json();
      setBinStatus(data);
      if (data.active && mySession && data.sessionId === mySession.id) {
        setCountdown(data.remaining);
        if (data.remaining <= 0) {
          setMySession(null);
          showToast('Сесијата истече!', 'error');
        }
      }
    } catch (e) {}
  }

  useEffect(() => {
    if (!router.isReady) return;
    if (!user) return;
    fetchBinStatus();
    pollRef.current = setInterval(() => {
      fetchBinStatus();
      refreshUser();
    }, 2000);
    return () => clearInterval(pollRef.current);
  }, [router.isReady, id, user, mySession]);

  useEffect(() => {
    if (!mySession) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setMySession(null);
          showToast('Сесијата истече!', 'error');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mySession]);

  async function startSession() {
    if (!id) { showToast('ID не е вчитан, обиди се повторно', 'error'); return; }
    setActionLoading(true);
    try {
      const res = await fetch('/api/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ binId: id })
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error, 'error'); return; }
      setMySession(data.session);
      setCountdown(30);
      showToast('Сесијата е активирана! 🌱');
      fetchBinStatus();
    } finally { setActionLoading(false); }
  }

  async function endSession() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ binId: id })
      });
      if (res.ok) {
        setMySession(null);
        showToast('Сесијата е завршена ✅');
        refreshUser();
        fetchBinStatus();
      }
    } finally { setActionLoading(false); }
  }

  if (loading || !user) return null;

  // Wait for router
  if (!router.isReady) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Се вчитува...</p>
    </div>
  );

  const isMine = mySession != null;
  const isOthers = binStatus?.active && !isMine;
  const progressPct = isMine ? (countdown / 30) * 100 : 0;

  return (
    <>
      <Head><title>Канта #{id} · Smart Eco Points</title></Head>
      <div className="orb orb1" /><div className="orb orb2" />
      <div className="page-wrap">
        <Topbar user={user} />
        <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800 }}>🗑️ Паметна Канта #{id}</h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Активирај сесија, фрли предмет, освои поен</p>
          </div>

          <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: isMine ? 'var(--green)' : isOthers ? 'var(--red)' : 'var(--muted2)',
                animation: isMine ? 'pulse 1.5s ease-in-out infinite' : 'none'
              }} />
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15 }}>
                {isMine ? '● АКТИВНА СЕСИЈА' : isOthers ? '● ЗАФАТЕНА' : '○ СЛОБОДНА'}
              </span>
            </div>

            {isMine && (
              <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(61,220,94,0.1)" strokeWidth="8" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="url(#cg)" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - progressPct / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3ddc5e" />
                      <stop offset="100%" stopColor="#c8ff6a" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 36, fontWeight: 800, color: 'var(--green)' }}>{countdown}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>секунди</span>
                </div>
              </div>
            )}

            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 24 }}>
              {isMine
                ? `✅ Сесија активна! Фрли предмет во кантата!`
                : isOthers
                  ? `⛔ Кантата е зафатена од "${binStatus.username}". Почекај!`
                  : `Кликни "Започни" за да активираш сесија (30 секунди)`}
            </p>

            {!isMine && !isOthers && (
              <button className="btn btn-primary" onClick={startSession} disabled={actionLoading} style={{ fontSize: 17, padding: '16px 40px' }}>
                {actionLoading ? '⏳ ...' : '▶ Започни сесија'}
              </button>
            )}
            {isMine && (
              <button className="btn btn-danger" onClick={endSession} disabled={actionLoading} style={{ fontSize: 16, padding: '14px 32px' }}>
                {actionLoading ? '⏳ ...' : '■ Заврши сесија'}
              </button>
            )}
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Твои поени</div>
            <div className="pts-big">{user.points}</div>
            <div style={{ marginTop: 14 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (user.points / 100) * 100)}%` }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{Math.max(0, 100 - user.points)} поени до бесплатно кафе ☕</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 16 }}>Kako работи?</div>
            {[
              ['1️⃣', 'Кликни "Започни сесија"'],
              ['2️⃣', 'Фрли предмет во кантата'],
              ['3️⃣', 'Arduino детектира → испраќа ITEM_DETECTED'],
              ['4️⃣', 'Серверот додава +1 поен (cooldown: 3с)'],
              ['5️⃣', 'Кликни "Заврши" или почекај 30с'],
            ].map(([num, text]) => (
              <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{num}</span>
                <span style={{ fontSize: 14, color: 'var(--muted)', paddingTop: 2 }}>{text}</span>
              </div>
            ))}
          </div>

        </main>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}
