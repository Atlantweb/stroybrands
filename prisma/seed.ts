import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@stroybrands.ru';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Администратор',
        email: adminEmail,
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
    });
    console.log('✓ Admin user created: admin@stroybrands.ru / admin123');
  }

  const rootCats = [
    { name: 'Строительные материалы', slug: 'stroitelnye-materialy' },
    { name: 'Инструменты', slug: 'instrumenty' },
    { name: 'Сантехника', slug: 'santekhnika' },
    { name: 'Электрика', slug: 'elektrika' },
    { name: 'Отделочные материалы', slug: 'otdelochnye-materialy' },
    { name: 'Крепёж и метизы', slug: 'krypyozh-i-metizy' },
  ];

  const subCats: Record<string, string[]> = {
    'stroitelnye-materialy': ['Бетон и смеси', 'Кирпич', 'Пиломатериалы', 'Утеплители'],
    'instrumenty': ['Ручной инструмент', 'Электроинструмент', 'Измерительный'],
    'santekhnika': ['Смесители', 'Ванны', 'Унитазы', 'Трубы и фитинги'],
    'elektrika': ['Кабель', 'Розетки и выключатели', 'Автоматика'],
    'otdelochnye-materialy': ['Обои', 'Краски', 'Плитка', 'Ламинат'],
    'krypyozh-i-metizy': ['Болты и гайки', 'Анкеры', 'Саморезы'],
  };

  for (const cat of rootCats) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      const created = await prisma.category.create({ data: cat });
      const subs = subCats[cat.slug] || [];
      for (const subName of subs) {
        const subSlug = `${cat.slug}-${subName.toLowerCase().replace(/[^a-zа-яё0-9]+/g, '-')}`;
        await prisma.category.create({
          data: { name: subName, slug: subSlug, parentId: created.id },
        });
      }
      console.log(`✓ Category created: ${cat.name}`);
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
