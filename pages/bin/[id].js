import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function BinPage() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [points, setPoints] = useState(0);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function startSession() {
    setStarted(true);
    setCountdown(30);
    showToast('Сесијата е активирана! 🌱');
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setStarted(false);
          showToast('Сесијата истече!', 'error');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function endSession() {
    clearInterval(timerRef.current);
    setStarted(false);
    showToast('Сесијата е завршена ✅');
  }

  // Симулирај поен на секои 5 секунди кога е активна сесија
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => {
      setPoints(p => p + 1);
      showToast('+1 поен добиен! ♻️');
    }, 5000);
    return () => clearInterval(iv);
  }, [started]);

  const progressPct = (countdown / 30) * 100;

  return (
    <>
      <Head><title>Канта #1 · Smart Eco Points</title></Head>

      <div className="orb orb1" /><div className="orb orb2" />

      <div className="page-wrap">
        <nav className="topbar">
          <div className="topbar-logo">
            <div className="logo-icon">♻</div>
            Smart Eco Points
          </div>
        </nav>

        <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: 28, fontWeight: 800 }}>🗑️ Паметна Канта #1</h1>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Активирај сесија, фрли предмет, освои поен</p>
          </div>

          <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: started ? 'var(--green)' : 'var(--muted2)',
                animation: started ? 'pulse 1.5s ease-in-out infinite' : 'none'
              }} />
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15 }}>
                {started ? '● АКТИВНА СЕСИЈА' : '○ СЛОБОДНА'}
              </span>
            </div>

            {started && (
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
              {started
                ? '✅ Сесија активна! Фрли предмет во кантата!'
                : 'Кликни "Започни" за да активираш сесија (30 секунди)'}
            </p>

            {!started && (
              <button className="btn btn-primary" onClick={startSession} style={{ fontSize: 17, padding: '16px 40px' }}>
                ▶ Започни сесија
              </button>
            )}
            {started && (
              <button className="btn btn-danger" onClick={endSession} style={{ fontSize: 16, padding: '14px 32px' }}>
                ■ Заврши сесија
              </button>
            )}
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Поени оваа сесија</div>
            <div className="pts-big">{points}</div>
            <div style={{ marginTop: 14 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (points / 10) * 100)}%` }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{Math.max(0, 10 - points)} поени до следната награда</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: 16 }}>Kako работи?</div>
            {[
              ['1️⃣', 'Кликни "Започни сесија"'],
              ['2️⃣', 'Фрли предмет во кантата'],
              ['3️⃣', 'Arduino детектира → испраќа сигнал'],
              ['4️⃣', 'Серверот додава +1 поен'],
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

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
