import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t) { router.replace('/'); return; }
    setToken(t);
    if (u) setUser(JSON.parse(u));

    // Fetch fresh user data
    fetch('/api/me', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) { localStorage.removeItem('token'); router.replace('/'); return; }
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    const t = localStorage.getItem('token');
    if (!t) return;
    const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${t}` } });
    const data = await res.json();
    if (!data.error) {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    }
  }

  return { user, token, loading, refreshUser };
}
