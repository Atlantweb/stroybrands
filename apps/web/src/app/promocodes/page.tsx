'use client';

import { useEffect, useState } from 'react';

interface Promocode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  endDate: string;
  shop: { name: string; slug: string };
}

export default function PromocodesPage() {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/promocodes')
      .then((r) => r.json())
      .then(setPromocodes);
  }, []);

  const filtered = promocodes.filter((p) =>
    p.shop?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Промокод скопирован!');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Промокоды</h1>

      <input
        placeholder="Поиск по магазину..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '0.65rem 0.75rem',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          fontSize: '0.95rem',
          background: 'var(--color-surface)',
          marginBottom: '1.5rem',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 8,
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '1.15rem', color: 'var(--color-accent)' }}>
                  {p.code}
                </strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  {p.shop?.name}
                </div>
                {p.description && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '0.5rem' }}>
                    {p.description}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                  Действителен до {new Date(p.endDate).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => copyCode(p.code)}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  marginLeft: '1rem',
                }}
              >
                Копировать
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: '#999', gridColumn: '1 / -1' }}>Промокоды не найдены.</p>
        )}
      </div>
    </div>
  );
}
