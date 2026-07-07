import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: 'var(--color-footer-bg)', color: 'var(--color-footer-text)' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '2.5rem 1rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Logo & Description */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>
            StroyBrands
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
            Агрегатор строительных товаров и промокодов. Сравнивайте цены, находите лучшие предложения и
            экономьте с промокодами.
          </p>
        </div>

        {/* Shop */}
        <div>
          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Покупателям
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link href="/catalog" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Каталог товаров
            </Link>
            <Link href="/shops" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Магазины
            </Link>
            <Link href="/promocodes" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Промокоды
            </Link>
            <Link href="/catalog?isNew=true" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Новинки
            </Link>
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Информация
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link href="/about" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              О проекте
            </Link>
            <Link href="/terms" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Пользовательское соглашение
            </Link>
            <Link href="/privacy" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Конфиденциальность
            </Link>
            <Link href="/admin" style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Для магазинов
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          maxWidth: 1280,
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        <span>&copy; {new Date().getFullYear()} StroyBrands. Все права защищены.</span>
        <span>Работает по партнёрской программе Admitad</span>
      </div>
    </footer>
  );
}
