'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [newParentId, setNewParentId] = useState('');

  useEffect(() => {
    fetch('/api/categories/tree')
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const addCategory = async () => {
    if (!newName) return;
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, parentId: newParentId || undefined }),
    });
    setNewName('');
    setNewParentId('');
    const cats = await fetch('/api/categories/tree').then((r) => r.json());
    setCategories(cats);
  };

  const removeCategory = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1>Категории</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Название новой категории"
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
        />
        <select value={newParentId} onChange={(e) => setNewParentId(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <option value="">— Корневая —</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button onClick={addCategory} style={{ background: '#1a73e8', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Добавить
        </button>
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <CategoryTree categories={categories} onDelete={removeCategory} />
      </div>
    </div>
  );
}

function CategoryTree({ categories, onDelete, level = 0 }: { categories: Category[]; onDelete: (id: string) => void; level?: number }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {categories.map((cat) => (
        <li key={cat.id} style={{ marginLeft: level * 20, marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
            <span>{cat.name}</span>
            <button onClick={() => onDelete(cat.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem' }}>
              ✕
            </button>
          </div>
          {cat.children && cat.children.length > 0 && (
            <CategoryTree categories={cat.children} onDelete={onDelete} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}
