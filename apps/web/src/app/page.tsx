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

  return (
    <div>
      <header style={{ background: '#1a73e8', color: '#fff', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0 }}>StroyBrands</h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <a href="/catalog" style={{ color: '#fff', textDecoration: 'none' }}>Каталог</a>
            <a href="/shops" style={{ color: '#fff', textDecoration: 'none' }}>Магазины</a>
            <a href="/promocodes" style={{ color: '#fff', textDecoration: 'none' }}>Промокоды</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <input
            placeholder="Поиск товаров..."
            style={{ width: '100%', padding: '1rem', border: '2px solid #1a73e8', borderRadius: '8px', fontSize: '1rem' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value;
                if (val) window.location.href = `/catalog?search=${encodeURIComponent(val)}`;
              }
            }}
          />
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <a href="/catalog?isNew=true" style={{ padding: '0.5rem 1rem', background: '#1a73e8', color: '#fff', borderRadius: '20px', textDecoration: 'none' }}>Новинки</a>
            <a href="/catalog?sort=popular" style={{ padding: '0.5rem 1rem', background: '#eee', color: '#333', borderRadius: '20px', textDecoration: 'none' }}>Популярные</a>
            <a href="/catalog?hasPromocode=true" style={{ padding: '0.5rem 1rem', background: '#eee', color: '#333', borderRadius: '20px', textDecoration: 'none' }}>С промокодами</a>
          </div>
        </section>

        {Object.entries(newProducts).map(([catName, products]) => (
          <section key={catName} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>{catName}</h2>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {products.map((product) => (
                <a key={product.id} href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', minWidth: '200px' }}>
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ width: '100%', height: '150px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {product.mainImageUrl
                        ? <img src={product.mainImageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        : <span style={{ color: '#999' }}>Нет фото</span>
                      }
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>{product.shop?.name}</div>
                    <div style={{ fontWeight: 'bold', margin: '0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                    <div style={{ color: '#1a73e8', fontWeight: 'bold' }}>{product.price} ₽</div>
                    {product.oldPrice && <div style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>{product.oldPrice} ₽</div>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}

        {Object.keys(newProducts).length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
            <h2>Добро пожаловать в StroyBrands!</h2>
            <p>Товары появятся после добавления магазинов и импорта фидов.</p>
            <p style={{ marginTop: '1rem' }}>Перейдите в <a href="/admin" style={{ color: '#1a73e8' }}>админ-панель</a> для начала работы.</p>
          </div>
        )}
      </main>

      <footer style={{ background: '#1a1a2e', color: '#fff', padding: '2rem', textAlign: 'center' }}>
        <p>StroyBrands — агрегатор строительных товаров и промокодов</p>
      </footer>
    </div>
  );
}
