'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  mainImageUrl: string | null;
  isNew: boolean;
  shop: { name: string; slug: string };
  category?: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('categoryId') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const hasPromocode = searchParams.get('hasPromocode') || '';
  const isNew = searchParams.get('isNew') || '';

  useEffect(() => {
    fetch('/api/categories/tree')
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(currentPage), limit: '20' });
    if (currentCategory) params.set('categoryId', currentCategory);
    if (currentSearch) params.set('search', currentSearch);
    if (currentSort) params.set('sort', currentSort);
    if (hasPromocode) params.set('hasPromocode', 'true');
    if (isNew) params.set('isNew', 'true');

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setProducts(res.data || []);
        setMeta(res.meta || { total: 0, page: 1, totalPages: 1 });
        setLoading(false);
      });
  }, [currentPage, currentCategory, currentSearch, currentSort, hasPromocode, isNew]);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <aside style={{ width: 250, flexShrink: 0 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Категории</h3>
        <CategoryFilter cats={categories} current={currentCategory} />
      </aside>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Найдено: {meta.total} товаров
          </span>
          <select
            value={currentSort}
            onChange={(e) => {
              const p = new URLSearchParams(searchParams.toString());
              p.set('sort', e.target.value);
              p.set('page', '1');
              window.location.search = p.toString();
            }}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              background: 'var(--color-surface)',
            }}
          >
            <option value="">По новизне</option>
            <option value="price">По цене ↑</option>
            <option value="-price">По цене ↓</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>Загрузка...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {products.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
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
                    {p.mainImageUrl ? (
                      <img
                        src={p.mainImageUrl}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>Нет фото</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {p.shop?.name}
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
                    {p.name}
                  </div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1rem' }}>
                    {p.price} ₽
                  </div>
                  {p.oldPrice && (
                    <div
                      style={{
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'line-through',
                        fontSize: '0.8rem',
                      }}
                    >
                      {p.oldPrice} ₽
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
            }}
          >
            {Array.from({ length: meta.totalPages }, (_, i) => {
              const p = new URLSearchParams(searchParams.toString());
              p.set('page', String(i + 1));
              const active = meta.page === i + 1;
              return (
                <a
                  key={i}
                  href={`/catalog?${p.toString()}`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 4,
                    background: active ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: active ? '#fff' : 'var(--color-text)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  {i + 1}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryFilter({
  cats,
  current,
}: {
  cats: Category[];
  current: string;
}) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <li>
        <a
          href="/catalog"
          style={{
            display: 'block',
            padding: '0.3rem 0',
            color: !current ? 'var(--color-accent)' : 'var(--color-text)',
            textDecoration: 'none',
            fontWeight: !current ? 700 : 400,
            fontSize: '0.9rem',
          }}
        >
          Все товары
        </a>
      </li>
      {cats.map((cat) => (
        <li key={cat.id}>
          <a
            href={`/catalog?categoryId=${cat.id}`}
            style={{
              display: 'block',
              padding: '0.3rem 0',
              color: current === cat.id ? 'var(--color-accent)' : 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: current === cat.id ? 700 : 400,
              fontSize: '0.9rem',
            }}
          >
            {cat.name}
          </a>
          {cat.children && cat.children.length > 0 && (
            <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
              {cat.children.map((child) => (
                <li key={child.id}>
                  <a
                    href={`/catalog?categoryId=${child.id}`}
                    style={{
                      display: 'block',
                      padding: '0.25rem 0',
                      color: current === child.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    {child.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CatalogPage() {
  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Каталог товаров</h1>
      <Suspense fallback={<div>Загрузка...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
