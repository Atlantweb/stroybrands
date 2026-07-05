'use client';

import { useEffect, useState } from 'react';

interface Promocode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  status: string;
  shop: { name: string };
}

export default function AdminPromocodes() {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);

  useEffect(() => {
    fetch('/api/promocodes')
      .then((r) => r.json())
      .then(setPromocodes);
  }, []);

  return (
    <div>
      <h1>Промокоды</h1>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem' }}>Код</th>
            <th style={{ padding: '0.75rem' }}>Магазин</th>
            <th style={{ padding: '0.75rem' }}>Описание</th>
            <th style={{ padding: '0.75rem' }}>Скидка</th>
            <th style={{ padding: '0.75rem' }}>Действует до</th>
            <th style={{ padding: '0.75rem' }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {promocodes.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{p.code}</td>
              <td style={{ padding: '0.75rem' }}>{p.shop?.name}</td>
              <td style={{ padding: '0.75rem' }}>{p.description || '—'}</td>
              <td style={{ padding: '0.75rem' }}>{p.discountType === 'percent' ? `${p.discountValue}%` : `${p.discountValue} ₽`}</td>
              <td style={{ padding: '0.75rem' }}>{new Date(p.endDate).toLocaleDateString()}</td>
              <td style={{ padding: '0.75rem' }}>{p.status === 'active' ? '✓' : '✕'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
