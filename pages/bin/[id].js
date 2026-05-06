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
      const res = await fetch(
