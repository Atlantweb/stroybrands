'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Shop {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  domain: string;
  feedUrl: string;
  feedFormat: string;
  updateFrequency: number;
  paymentDeliveryInfo: string | null;
  subid: string | null;
  admitadToken: string | null;
  status: string;
}

export default function ShopEditPage() {
  const params = useParams();
  const isNew = params.id === 'new';
  const [shop, setShop] = useState<Partial<Shop>>({
    name: '', slug: '', domain: '', feedUrl: '', feedFormat: 'yml',
    updateFrequency: 24, status: 'active',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/shops/${params.id}`)
      .then((r) => r.json())
      .then(setShop);
  }, [params.id, isNew]);

  const save = async () => {
    setSaving(true);
    const method = isNew ? 'POST' : 'PATCH';
    const url = isNew ? '/api/shops' : `/api/shops/${params.id}`;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      alert('Сохранено!');
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const runImport = async () => {
    if (!shop.id) return;
    await fetch(`/api/imports/run/${shop.id}`, { method: 'POST' });
    alert('Импорт запущен');
  };

  return (
    <div>
      <h1>{isNew ? 'Новый магазин' : `Редактирование: ${shop.name}`}</h1>
      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Input label="Название" value={shop.name || ''} onChange={(v) => setShop({ ...shop, name: v })} />
        <Input label="Slug" value={shop.slug || ''} onChange={(v) => setShop({ ...shop, slug: v })} />
        <Input label="Домен" value={shop.domain || ''} onChange={(v) => setShop({ ...shop, domain: v })} />
        <Input label="URL фида" value={shop.feedUrl || ''} onChange={(v) => setShop({ ...shop, feedUrl: v })} />
        <Select label="Формат фида" value={shop.feedFormat || 'yml'} options={[
          { value: 'yml', label: 'YML (XML)' },
          { value: 'csv', label: 'CSV' },
          { value: 'json', label: 'JSON' },
        ]} onChange={(v) => setShop({ ...shop, feedFormat: v })} />
        <Input label="Частота обновления (часы)" type="number" value={String(shop.updateFrequency ?? 24)} onChange={(v) => setShop({ ...shop, updateFrequency: Number(v) })} />
        <Input label="SubID" value={shop.subid || ''} onChange={(v) => setShop({ ...shop, subid: v })} />
        <Input label="Токен Admitad" value={shop.admitadToken || ''} onChange={(v) => setShop({ ...shop, admitadToken: v })} />
        <Textarea label="Условия оплаты и доставки" value={shop.paymentDeliveryInfo || ''} onChange={(v) => setShop({ ...shop, paymentDeliveryInfo: v })} />
        <Select label="Статус" value={shop.status || 'active'} options={[
          { value: 'active', label: 'Активен' },
          { value: 'inactive', label: 'Неактивен' },
        ]} onChange={(v) => setShop({ ...shop, status: v })} />

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={save} disabled={saving} style={{ background: '#1a73e8', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          {!isNew && (
            <button onClick={runImport} style={{ background: '#34a853', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Запустить импорт
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '0.25rem', color: '#555' }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
      />
    </div>
  );
}
