'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: string;
  rating: number;
  text: string;
  status: string;
  createdAt: string;
  user: { name: string };
  product: { name: string };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/api/reviews/admin')
      .then((r) => r.json())
      .then(setReviews);
  }, []);

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`/api/reviews/${id}/moderate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setReviews(reviews.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <h1>Отзывы</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{r.user?.name}</strong>
              <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <div style={{ color: '#666', fontSize: '0.875rem' }}>Товар: {r.product?.name}</div>
            <p>{r.text}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: r.status === 'pending' ? '#fff3cd' : r.status === 'approved' ? '#d4edda' : '#f8d7da' }}>
                {r.status === 'pending' ? 'На модерации' : r.status === 'approved' ? 'Одобрен' : 'Отклонён'}
              </span>
              {r.status === 'pending' && (
                <>
                  <button onClick={() => moderate(r.id, 'approved')} style={{ background: '#34a853', color: '#fff', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Одобрить</button>
                  <button onClick={() => moderate(r.id, 'rejected')} style={{ background: '#ea4335', color: '#fff', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Отклонить</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
