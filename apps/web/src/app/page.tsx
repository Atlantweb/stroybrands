'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  mainImageUrl: string | null;
  shop: { name: string; slug: string };
  category?: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProducts, setNewProducts] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    fetch('/api/categories/tree')
      .then((r) => r.json())
      .then(setCategories);

    fetch('/api/products?isNew=true&limit=50')
      .then((r) => r.json())
      .then((res) => {
        const grouped: Record<string, Product[]> = {};
        (res.data || []).forEach((p: Product) => {
          const catName = p.category?.name || 'Другие';
          if (!grouped[catName]) grouped[catName] = [];
          if (grouped[catName].length < 20) grouped[catName].push(p);
        });
        setNewProducts(grouped);
      });
  }, []);

  const rootCats = categories.filter((c) => c.children && c.children.length > 0);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      {/* Hero section */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          borderRadius: 12,
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          color: '#fff',
        }}
      >
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem' }}>
          Строительные товары по лучшим ценам
        </h1>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
          Сравнивайте цены, находите промокоды и экономьте на покупках
        </p>
      </div>

      {/* Category cards */}
      {rootCats.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Категории</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {rootCats.map((cat) => (
              <a
                key={cat.id}
                href={`/catalog?categoryId=${cat.id}`}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 8,
                  padding: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Product carousels by category */}
      {Object.entries(newProducts).map(([catName, products]) => (
        <section key={catName} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{catName}</h2>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {products.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', minWidth: '200px', maxWidth: '200px' }}
              >
                <div
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 8,
                    padding: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      background: '#f0f0f0',
                      borderRadius: 4,
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {product.mainImageUrl ? (
                      <img
                        src={product.mainImageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>Нет фото</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {product.shop?.name}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      margin: '0.2rem 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem',
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1rem' }}>
                    {product.price} ₽
                  </div>
                  {product.oldPrice && (
                    <div
                      style={{
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'line-through',
                        fontSize: '0.8rem',
                      }}
                    >
                      {product.oldPrice} ₽
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}

      {Object.keys(newProducts).length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#999' }}>
          <h2>Добро пожаловать в StroyBrands!</h2>
          <p>Товары появятся после добавления магазинов и импорта фидов.</p>
          <p style={{ marginTop: '1rem' }}>
            Перейдите в{' '}
            <a href="/admin" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
              админ-панель
            </a>{' '}
            для начала работы.
          </p>
        </div>
      )}
    </div>
  );
}
