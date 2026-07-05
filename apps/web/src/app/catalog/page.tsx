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
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <h3>Категории</h3>
        <CategoryFilter cats={categories} current={currentCategory} />
      </aside>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span>Найдено: {meta.total} товаров</span>
          <select value={currentSort} onChange={(e) => {
            const p = new URLSearchParams(searchParams.toString());
            p.set('sort', e.target.value);
            p.set('page', '1');
            window.location.search = p.toString();
          }} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="">По новизне</option>
            <option value="price">По цене ↑</option>
            <option value="-price">По цене ↓</option>
          </select>
        </div>

        {loading ? <div>Загрузка...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {products.map((p) => (
              <a key={p.id} href={`/product/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ width: '100%', height: '150px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.mainImageUrl
                      ? <img src={p.mainImageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span style={{ color: '#999' }}>Нет фото</span>
                    }
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>{p.shop?.name}</div>
                  <div style={{ fontWeight: 'bold', margin: '0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ color: '#1a73e8', fontWeight: 'bold' }}>{p.price} ₽</div>
                  {p.oldPrice && <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>{p.oldPrice} ₽</div>}
                </div>
              </a>
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            {Array.from({ length: meta.totalPages }, (_, i) => {
              const p = new URLSearchParams(searchParams.toString());
              p.set('page', String(i + 1));
              return (
                <a key={i} href={`/catalog?${p.toString()}`} style={{
                  padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '4px',
                  background: meta.page === i + 1 ? '#1a73e8' : '#fff',
                  color: meta.page === i + 1 ? '#fff' : '#333', textDecoration: 'none',
                }}>
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

function CategoryFilter({ cats, current }: { cats: Category[]; current: string }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <li key="all">
        <a href="/catalog" style={{ display: 'block', padding: '0.25rem 0', color: !current ? '#1a73e8' : '#333', textDecoration: 'none', fontWeight: !current ? 'bold' : 'normal' }}>
          Все товары
        </a>
      </li>
      {cats.map((cat) => (
        <li key={cat.id}>
          <a href={`/catalog?categoryId=${cat.id}`} style={{ display: 'block', padding: '0.25rem 0', color: current === cat.id ? '#1a73e8' : '#333', textDecoration: 'none', fontWeight: current === cat.id ? 'bold' : 'normal' }}>
            {cat.name}
          </a>
          {cat.children && cat.children.length > 0 && (
            <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
              {cat.children.map((child) => (
                <li key={child.id}>
                  <a href={`/catalog?categoryId=${child.id}`} style={{ display: 'block', padding: '0.25rem 0', color: current === child.id ? '#1a73e8' : '#555', textDecoration: 'none', fontSize: '0.9rem' }}>
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <Suspense fallback={<div>Загрузка...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
