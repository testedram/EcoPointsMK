import { useState, useRef } from 'react';
import Head from 'next/head';

export default function BinPage() {
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
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

  const progressPct = (countdown / 30) * 100;
  const progressCirc = 2 * Math.PI * 60;

  return (
    <>
      <Head>
        <title>Канта #1 · Smart Eco Points</title>
      </Head>

      <div className="orb orb1" />
      <div className="orb orb2" />

      <div className="page-wrap">

        {/* TOPBAR */}
        <nav className="topbar">
          <div className="topbar-logo">
            <div className="logo-icon">♻</div>
            Smart Eco Points
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="nav-btn active">🗑️ Канта</button>
            <button className="nav-btn">🏆 Leaderboard</button>
            <button className="nav-btn">🎁 Награди</button>
          </div>
        </nav>

        <main style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <h1 className="title">
              🗑️ Паметна Канта #1
            </h1>

            <p className="subtitle">
              Активирај сесија, фрли предмет, освои поен
            </p>
          </div>

          {/* CARD */}
          <div className="card">

            {/* STATUS */}
            <div className="status-row">
              <div
                className={`status-dot ${started ? 'active-dot' : ''}`}
              />

              <span className="status-text">
                {started
                  ? '● АКТИВНА СЕСИЈА'
                  : '○ СЛОБОДНА'}
              </span>
            </div>

            {/* TIMER */}
            {started && (
              <div
                style={{
                  position: 'relative',
                  width: 140,
                  height: 140,
                  margin: '0 auto 20px'
                }}
              >
                <svg
                  width="140"
                  height="140"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="rgba(61,220,94,0.1)"
                    strokeWidth="8"
                  />

                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="url(#cg)"
                    strokeWidth="8"
                    strokeDasharray={progressCirc}
                    strokeDashoffset={
                      progressCirc * (1 - progressPct / 100)
                    }
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1s linear'
                    }}
                  />

                  <defs>
                    <linearGradient
                      id="cg"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#3ddc5e" />
                      <stop offset="100%" stopColor="#c8ff6a" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="timer-center">
                  <span className="timer-number">
                    {countdown}
                  </span>

                  <span className="timer-label">
                    секунди
                  </span>
                </div>
              </div>
            )}

            {/* MESSAGE */}
            <p className="message">
              {started
                ? '✅ Сесија активна! Фрли предмет во кантата!'
                : 'Кликни "Започни" за да активираш сесија'}
            </p>

            {/* BUTTON */}
            {!started ? (
              <button
                className="btn btn-primary"
                onClick={startSession}
              >
                ▶ Започни сесија
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={endSession}
              >
                ■ Заврши сесија
              </button>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div className="card" style={{ marginTop: 20 }}>
            <div className="how-title">
              Како работи?
            </div>

            {[
              ['1️⃣', 'Кликни "Започни сесија"'],
              ['2️⃣', 'Фрли предмет во кантата'],
              ['3️⃣', 'Arduino детектира предмет'],
              ['4️⃣', 'Добиваш +1 поен'],
              ['5️⃣', 'Сесијата завршува за 30с'],
            ].map(([num, text]) => (
              <div className="step" key={num}>
                <span>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <style jsx global>{`
        :root {
          --bg: #0f1115;
          --card: rgba(20,22,28,0.85);
          --green: #3ddc5e;
          --green2: #c8ff6a;
          --red: #ff5c5c;
          --text: #ffffff;
          --muted: #9ca3af;
          --muted2: #4b5563;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: white;
          font-family: Inter, sans-serif;
          overflow-x: hidden;
        }

        .page-wrap {
          position: relative;
          min-height: 100vh;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: .18;
          z-index: 0;
        }

        .orb1 {
          width: 300px;
          height: 300px;
          background: #3ddc5e;
          top: -80px;
          left: -80px;
        }

        .orb2 {
          width: 260px;
          height: 260px;
          background: #c8ff6a;
          bottom: -80px;
          right: -80px;
        }

        .topbar {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg,#3ddc5e,#c8ff6a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          font-weight: 800;
        }

        .nav-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          border-radius: 12px;
          padding: 10px 14px;
          cursor: pointer;
        }

        .active {
          background: rgba(61,220,94,.12);
          border: 1px solid rgba(61,220,94,.25);
          color: var(--green);
        }

        .title {
          font-size: 32px;
          font-weight: 800;
          margin: 0;
        }

        .subtitle {
          color: var(--muted);
          margin-top: 10px;
        }

        .card {
          background: var(--card);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 28px;
          padding: 28px;
          position: relative;
          z-index: 1;
        }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 22px;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--muted2);
        }

        .active-dot {
          background: var(--green);
          animation: pulse 1.5s infinite;
        }

        .status-text {
          font-weight: 700;
        }

        .timer-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .timer-number {
          font-size: 38px;
          font-weight: 800;
          color: var(--green);
        }

        .timer-label {
          font-size: 12px;
          color: var(--muted);
        }

        .message {
          text-align: center;
          color: var(--muted);
          margin-bottom: 24px;
        }

        .btn {
          width: 100%;
          border: none;
          border-radius: 18px;
          padding: 18px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg,#3ddc5e,#c8ff6a);
          color: black;
        }

        .btn-danger {
          background: linear-gradient(135deg,#ff5c5c,#ff8080);
          color: white;
        }

        .how-title {
          font-weight: 700;
          margin-bottom: 18px;
        }

        .step {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
          color: var(--muted);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 20px;
          border-radius: 16px;
          font-weight: 600;
          z-index: 999;
          animation: slide .3s ease;
        }

        .toast-success {
          background: #1f8f43;
        }

        .toast-error {
          background: #d63939;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(61,220,94,.5);
          }

          70% {
            box-shadow: 0 0 0 12px rgba(61,220,94,0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(61,220,94,0);
          }
        }

        @keyframes slide {
          from {
            transform: translateY(20px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
