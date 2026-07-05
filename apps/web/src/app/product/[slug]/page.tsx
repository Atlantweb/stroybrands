'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  article: string | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  mainImageUrl: string | null;
  additionalImages: string[] | null;
  url: string;
  partnerUrl: string | null;
  shop: { id: string; name: string; slug: string; logoUrl: string | null; paymentDeliveryInfo: string | null };
  category?: { name: string; slug: string } | null;
  parameters: { id: string; name: string; value: string }[];
  promocodes: { id: string; code: string; description: string | null; discountType: string; discountValue: number; endDate: string }[];
  reviews: { id: string; rating: number; text: string; createdAt: string; user: { name: string } }[];
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/slug/${params.slug}`)
      .then((r) => r.json())
      .then((p) => { setProduct(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>Загрузка...</div>;
  if (!product) return <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>Товар не найден</div>;

  const copyPromocode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Промокод скопирован!');
  };

  const handleBuy = () => {
    const url = product.partnerUrl || product.url;
    if (product.promocodes.length > 0) {
      navigator.clipboard.writeText(product.promocodes[0].code);
    }
    fetch('/api/click-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, shopId: product.shop.id }),
    });
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ width: '100%', minHeight: '300px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {product.mainImageUrl
              ? <img src={product.mainImageUrl} alt={product.name} style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }} />
              : <span style={{ color: '#999' }}>Нет изображения</span>
            }
          </div>
        </div>

        <div style={{ flex: '1 1 400px' }}>
          {product.category && (
            <div style={{ fontSize: '0.875rem', color: '#999', marginBottom: '0.5rem' }}>
              <a href="/catalog" style={{ color: '#999' }}>Каталог</a>
              {' / '}
              <a href={`/catalog?categoryId=${product.category.slug}`} style={{ color: '#999' }}>{product.category.name}</a>
            </div>
          )}
          <h1 style={{ margin: '0 0 0.5rem' }}>{product.name}</h1>
          {product.brand && <div style={{ color: '#666', marginBottom: '0.5rem' }}>Бренд: {product.brand}</div>}
          {product.article && <div style={{ color: '#666', marginBottom: '1rem' }}>Артикул: {product.article}</div>}

          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a73e8' }}>{product.price} ₽</span>
            {product.oldPrice && (
              <span style={{ marginLeft: '1rem', fontSize: '1.2rem', color: '#999', textDecoration: 'line-through' }}>{product.oldPrice} ₽</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span>{product.shop.name}</span>
          </div>

          <button onClick={handleBuy} style={{
            width: '100%', padding: '1rem', background: '#34a853', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem',
          }}>
            {product.promocodes.length > 0 ? 'Купить — промокод скопирован' : 'Купить на сайте партнёра'}
          </button>

          {product.promocodes.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
              {product.promocodes.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{p.code}</strong>
                    {p.description && <div style={{ fontSize: '0.8rem', color: '#555' }}>{p.description}</div>}
                  </div>
                  <button onClick={() => copyPromocode(p.code)} style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Копировать
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', marginBottom: '1rem' }}>
          {['description', 'parameters', 'delivery', 'promocodes', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1rem', border: 'none', background: 'none',
                borderBottom: activeTab === tab ? '2px solid #1a73e8' : '2px solid transparent',
                color: activeTab === tab ? '#1a73e8' : '#666', cursor: 'pointer', fontWeight: activeTab === tab ? 'bold' : 'normal',
              }}
            >
              {tab === 'description' && 'Описание'}
              {tab === 'parameters' && 'Характеристики'}
              {tab === 'delivery' && 'Оплата и доставка'}
              {tab === 'promocodes' && `Промокоды (${product.promocodes.length})`}
              {tab === 'reviews' && `Отзывы (${product.reviews.length})`}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'description' && (
            <div dangerouslySetInnerHTML={{ __html: product.description || 'Нет описания' }} />
          )}
          {activeTab === 'parameters' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {product.parameters.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>{p.name}</td>
                    <td style={{ padding: '0.5rem' }}>{p.value}</td>
                  </tr>
                ))}
                {product.parameters.length === 0 && <tr><td colSpan={2} style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>Характеристики не указаны</td></tr>}
              </tbody>
            </table>
          )}
          {activeTab === 'delivery' && (
            <div>
              {product.shop.paymentDeliveryInfo
                ? <div dangerouslySetInnerHTML={{ __html: product.shop.paymentDeliveryInfo }} />
                : <p style={{ color: '#999' }}>Информация об оплате и доставке не указана.</p>
              }
            </div>
          )}
          {activeTab === 'promocodes' && (
            <div>
              {product.promocodes.length > 0 ? product.promocodes.map((p) => (
                <div key={p.id} style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.2rem' }}>{p.code}</strong>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{p.description}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>До {new Date(p.endDate).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => copyPromocode(p.code)} style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Копировать
                    </button>
                  </div>
                </div>
              )) : <p style={{ color: '#999' }}>Промокодов для этого товара нет.</p>}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              {product.reviews.map((r) => (
                <div key={r.id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{r.user?.name}</strong>
                    <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>{r.text}</p>
                </div>
              ))}
              {product.reviews.length === 0 && <p style={{ color: '#999' }}>Отзывов пока нет.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
