# Деплой StroyBrands на VPS

## Требования
- Ubuntu 22.04 / Debian 12
- 1 vCPU, 1-2 GB RAM
- Домен, привязанный к IP сервера

## Установка за 5 минут

### 1. Подготовка сервера
```bash
ssh root@your-server-ip
bash <(curl -sL https://raw.githubusercontent.com/your-repo/stroybrands/main/deploy/setup-vps.sh)
```

### 2. Настройка Nginx
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/stroybrands
sudo ln -s /etc/nginx/sites-available/stroybrands /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL (Let's Encrypt)
sudo certbot --nginx -d stroybrands.ru -d www.stroybrands.ru
```

### 3. PM2 (автозапуск)
```bash
pm2 start deploy/PM2-ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Обновление
```bash
cd /var/www/stroybrands
git pull
npm run setup:prod
pm2 restart all
```

## Архитектура

```
Пользователь → Nginx (443 SSL)
                  ├── / → Next.js (3000)
                  └── /api/ → NestJS (4000)
                                  ├── Prisma → MySQL
                                  └── BullMQ → Redis
```

## Переменные окружения (.env)
Скопируйте `.env.production` в `.env` и замените пароли.

## Резервное копирование
```bash
mysqldump -u stroybrands -p stroybrands > backup-$(date +%Y%m%d).sql
```
