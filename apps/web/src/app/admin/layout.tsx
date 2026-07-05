'use client';

import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: '📊' },
  { href: '/admin/shops', label: 'Магазины', icon: '🛒' },
  { href: '/admin/categories', label: 'Категории', icon: '📁' },
  { href: '/admin/products', label: 'Товары', icon: '📦' },
  { href: '/admin/imports', label: 'Импорт', icon: '📥' },
  { href: '/admin/promocodes', label: 'Промокоды', icon: '🏷️' },
  { href: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: collapsed ? 60 : 240,
        background: '#1a1a2e',
        color: '#fff',
        padding: '1rem',
        transition: 'width 0.2s',
      }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          {collapsed ? '☰' : '✕'}
        </button>
        {!collapsed && <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>StroyBrands Admin</h2>}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{ color: '#ccc', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
}
