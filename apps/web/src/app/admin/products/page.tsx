'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
  shop: { name: string };
  category?: { name: string } | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '20' });
    if (search) params.set('search', search);

    const res = await fetch(`/api/products?${params}`).then((r) => r.json());
    setProducts(res.data || []);
    setTotalPages(res.meta?.totalPages || 1);
    setPage(res.meta?.page || 1);
    setLoading(false);
  };

  useEffect(() => { load(1); }, []);

  return (
    <div>
      <h1>Товары</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или артикулу..."
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
        />
        <button onClick={() => load(1)} style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Поиск
        </button>
      </div>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem' }}>Название</th>
            <th style={{ padding: '0.75rem' }}>Магазин</th>
            <th style={{ padding: '0.75rem' }}>Категория</th>
            <th style={{ padding: '0.75rem' }}>Цена</th>
            <th style={{ padding: '0.75rem' }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>{p.name}</td>
              <td style={{ padding: '0.75rem' }}>{p.shop?.name}</td>
              <td style={{ padding: '0.75rem' }}>{p.category?.name || '—'}</td>
              <td style={{ padding: '0.75rem' }}>{p.price} ₽</td>
              <td style={{ padding: '0.75rem' }}>{p.status === 'active' ? '✓' : '✕'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => load(i + 1)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: page === i + 1 ? '#1a73e8' : '#fff',
                color: page === i + 1 ? '#fff' : '#333',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
