'use client';

import { useEffect, useState } from 'react';

interface Shop {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: string;
  feedFormat: string;
  updateFrequency: number;
}

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shops')
      .then((r) => r.json())
      .then(setShops)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Магазины</h1>
        <a href="/admin/shops/new" style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>
          + Добавить
        </a>
      </div>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem' }}>Название</th>
            <th style={{ padding: '0.75rem' }}>Домен</th>
            <th style={{ padding: '0.75rem' }}>Формат фида</th>
            <th style={{ padding: '0.75rem' }}>Частота (ч)</th>
            <th style={{ padding: '0.75rem' }}>Статус</th>
            <th style={{ padding: '0.75rem' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>{shop.name}</td>
              <td style={{ padding: '0.75rem' }}>{shop.domain}</td>
              <td style={{ padding: '0.75rem' }}>{shop.feedFormat}</td>
              <td style={{ padding: '0.75rem' }}>{shop.updateFrequency}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ color: shop.status === 'active' ? 'green' : 'red' }}>
                  {shop.status === 'active' ? 'Активен' : 'Неактивен'}
                </span>
              </td>
              <td style={{ padding: '0.75rem' }}>
                <a href={`/admin/shops/${shop.id}`} style={{ color: '#1a73e8', marginRight: '0.5rem' }}>Редактировать</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
