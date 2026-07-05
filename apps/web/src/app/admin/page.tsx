'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  shops: number;
  products: number;
  activeProducts: number;
  promocodes: number;
  pendingReviews: number;
  clicksToday: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Дашборд</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <StatCard label="Магазины" value={stats.shops} />
        <StatCard label="Всего товаров" value={stats.products} />
        <StatCard label="Активных товаров" value={stats.activeProducts} />
        <StatCard label="Активных промокодов" value={stats.promocodes} />
        <StatCard label="Отзывов на модерации" value={stats.pendingReviews} />
        <StatCard label="Кликов сегодня" value={stats.clicksToday} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a73e8' }}>{value}</div>
      <div style={{ color: '#666', marginTop: '0.5rem' }}>{label}</div>
    </div>
  );
}
