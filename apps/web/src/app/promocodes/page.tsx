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
    p.shop?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Промокод скопирован!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Промокоды</h1>
      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Поиск по магазину..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.15rem', color: '#1a73e8' }}>{p.code}</strong>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{p.shop?.name}</div>
                {p.description && <div style={{ fontSize: '0.9rem', color: '#444', marginTop: '0.5rem' }}>{p.description}</div>}
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                  Действителен до {new Date(p.endDate).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => copyCode(p.code)} style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Копировать
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: '#999' }}>Промокоды не найдены.</p>}
      </div>
    </div>
  );
}
