'use client';

import { useEffect, useState } from 'react';

interface Shop {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  domain: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    fetch('/api/shops')
      .then((r) => r.json())
      .then(setShops);
  }, []);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Магазины-партнёры</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {shops.map((shop) => (
          <div
            key={shop.id}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 8,
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>{shop.name}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              {shop.domain}
            </p>
            <a
              href={`/catalog?shopId=${shop.id}`}
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Все товары →
            </a>
          </div>
        ))}
        {shops.length === 0 && (
          <p style={{ color: '#999', gridColumn: '1 / -1' }}>Магазины ещё не добавлены.</p>
        )}
      </div>
    </div>
  );
}
