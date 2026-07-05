'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/admin';
      } else {
        alert('Ошибка входа');
      }
    } catch {
      alert('Ошибка соединения');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Вход в админ-панель</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button onClick={login} style={{ background: '#1a73e8', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Войти
        </button>
      </div>
    </div>
  );
}
