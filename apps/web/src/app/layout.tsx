import type { Metadata } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/ui/PwaRegister';

export const metadata: Metadata = {
  title: 'StroyBrands — строительные товары и промокоды',
  description: 'Агрегатор строительных товаров и промокодов по партнёрской программе',
  manifest: '/manifest.json',
  other: { 'theme-color': '#1a73e8' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <PwaRegister />
        <main>{children}</main>
      </body>
    </html>
  );
}
