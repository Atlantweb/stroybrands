'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export function Header({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rootCategories = categories.filter((c) => c.children && c.children.length > 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  return (
    <header>
      {/* Top bar */}
      <div style={{ background: 'var(--color-primary)' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 700,
              fontSize: '1.4rem',
              color: '#fff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            StroyBrands
          </Link>

          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 560, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                background: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0.55rem 1rem',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#333',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.55rem 1.2rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Найти
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <Link href="/favorites" style={iconLinkStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span style={{ fontSize: '0.7rem' }}>Избранное</span>
            </Link>
            <Link href="/profile" style={iconLinkStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: '0.7rem' }}>Профиль</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div style={{ background: 'var(--color-primary-dark)', position: 'relative' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
              setMenuOpen(true);
            }}
            onMouseLeave={() => {
              menuTimeoutRef.current = setTimeout(() => setMenuOpen(false), 300);
            }}
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Каталог товаров
          </button>

          <Link href="/catalog?isNew=true" style={navLinkStyle}>
            Новинки
          </Link>
          <Link href="/shops" style={navLinkStyle}>
            Магазины
          </Link>
          <Link href="/promocodes" style={navLinkStyle}>
            Промокоды
          </Link>
          <Link href="/catalog?sort=popular" style={navLinkStyle}>
            Популярное
          </Link>
        </div>

        {/* Mega menu */}
        {menuOpen && rootCategories.length > 0 && (
          <div
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
              setMenuOpen(true);
            }}
            onMouseLeave={() => {
              menuTimeoutRef.current = setTimeout(() => setMenuOpen(false), 300);
            }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 1000,
              borderTop: '3px solid var(--color-accent)',
            }}
          >
            <div
              style={{
                maxWidth: 1280,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                padding: '1.5rem',
                gap: '1.5rem',
              }}
            >
              {rootCategories.map((cat) => (
                <div key={cat.id}>
                  <Link
                    href={`/catalog?category=${cat.slug}`}
                    style={{
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    {cat.name}
                  </Link>
                  {cat.children &&
                    cat.children.slice(0, 6).map((child) => (
                      <Link
                        key={child.id}
                        href={`/catalog?category=${child.slug}`}
                        style={{
                          color: '#555',
                          fontSize: '0.82rem',
                          display: 'block',
                          padding: '0.2rem 0',
                          transition: 'color 0.15s',
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const iconLinkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.15rem',
};

const navLinkStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.9)',
  textDecoration: 'none',
  padding: '0.6rem 1rem',
  fontSize: '0.88rem',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '3px solid transparent',
  transition: 'border-color 0.2s, color 0.2s',
};
