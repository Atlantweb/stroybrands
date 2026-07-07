import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/ui/PwaRegister';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const metadata: Metadata = {
  title: 'StroyBrands — строительные товары и промокоды',
  description:
    'Агрегатор строительных товаров и промокодов по партнёрской программе Admitad. Сравнивайте цены и экономьте с промокодами.',
  manifest: '/manifest.json',
  other: { 'theme-color': '#1b5e20' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

async function getCategories() {
  try {
    const res = await fetch(`${API}/admin/categories/tree`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {}
  return [];
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="ru">
      <body>
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
        <PwaRegister />
      </body>
    </html>
  );
}
