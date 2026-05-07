import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

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

  return (
    <>
      <Head>
        <title>Канта #1 · Smart Eco Points</title>
      </Head>

      <main style={{
        minHeight: '100vh',
        background: '#0f1115',
        color: 'white',
        padding: 40
      }}>

        <h1>🗑️ Паметна Канта #1</h1>

        <p>
          {started
            ? '✅ Сесија активна!'
            : 'Кликни за старт'}
        </p>

        {started && (
          <h2>{countdown}s</h2>
        )}

        {!started ? (
          <button onClick={startSession}>
            ▶ Започни сесија
          </button>
        ) : (
          <button onClick={endSession}>
            ■ Заврши сесија
          </button>
        )}

        {toast && (
          <div style={{
            marginTop: 20,
            padding: 10,
            background:
              toast.type === 'error'
                ? 'red'
                : 'green'
          }}>
            {toast.msg}
          </div>
        )}

      </main>
    </>
  );
}
