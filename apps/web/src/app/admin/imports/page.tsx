'use client';

import { useEffect, useState } from 'react';

interface ImportLog {
  id: string;
  status: string;
  productsAdded: number;
  productsUpdated: number;
  productsDeactivated: number;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  shop: { name: string };
}

export default function AdminImports() {
  const [logs, setLogs] = useState<ImportLog[]>([]);

  useEffect(() => {
    fetch('/api/imports/logs')
      .then((r) => r.json())
      .then(setLogs);
  }, []);

  const statusColor = (s: string) => {
    switch (s) {
      case 'running': return '#f9a825';
      case 'completed': return '#34a853';
      case 'failed': return '#ea4335';
      default: return '#999';
    }
  };

  return (
    <div>
      <h1>Импорт фидов</h1>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem' }}>Магазин</th>
            <th style={{ padding: '0.75rem' }}>Статус</th>
            <th style={{ padding: '0.75rem' }}>Добавлено</th>
            <th style={{ padding: '0.75rem' }}>Обновлено</th>
            <th style={{ padding: '0.75rem' }}>Деактивировано</th>
            <th style={{ padding: '0.75rem' }}>Начало</th>
            <th style={{ padding: '0.75rem' }}>Ошибка</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>{log.shop?.name}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ color: statusColor(log.status) }}>{log.status}</span>
              </td>
              <td style={{ padding: '0.75rem' }}>{log.productsAdded}</td>
              <td style={{ padding: '0.75rem' }}>{log.productsUpdated}</td>
              <td style={{ padding: '0.75rem' }}>{log.productsDeactivated}</td>
              <td style={{ padding: '0.75rem' }}>{new Date(log.startedAt).toLocaleString()}</td>
              <td style={{ padding: '0.75rem', color: 'red', maxWidth: '200px', overflow: 'hidden' }}>{log.errorMessage || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
