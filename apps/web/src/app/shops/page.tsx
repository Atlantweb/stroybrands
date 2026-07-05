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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Магазины-партнёры</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {shops.map((shop) => (
          <div key={shop.id} style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3>{shop.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{shop.domain}</p>
            <a href={`/catalog?shopId=${shop.id}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>
              Все товары →
            </a>
          </div>
        ))}
        {shops.length === 0 && <p style={{ color: '#999' }}>Магазины ещё не добавлены.</p>}
      </div>
    </div>
  );
}
