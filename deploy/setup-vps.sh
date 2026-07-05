#!/bin/bash
set -e

echo "=== StroyBrands VPS Setup ==="

# 1. System packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# 2. Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
node -v && npm -v

# 3. MySQL 8.0
sudo apt install -y mysql-server-8.0
sudo mysql_secure_installation

# Create database and user
sudo mysql -e "CREATE DATABASE IF NOT EXISTS stroybrands CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'stroybrands'@'localhost' IDENTIFIED BY 'your-password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON stroybrands.* TO 'stroybrands'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 4. Redis
sudo apt install -y redis-server
sudo systemctl enable redis

# 5. PM2
sudo npm install -g pm2

# 6. Project
cd /var/www
sudo git clone https://github.com/your-username/stroybrands.git
cd stroybrands
npm install

# 7. Configure environment
cp .env.production .env

# 8. Switch to MySQL schema
mv prisma/schema.prisma prisma/schema.sqlite.prisma.bak
mv prisma/schema.mysql.prisma prisma/schema.prisma

# 9. Generate Prisma and push schema
npx prisma generate
npx prisma db push

# 10. Build
npm run build

# 11. Start with PM2
pm2 start npm --name "stroybrands-api" -- run start:prod -w apps/api
pm2 start npm --name "stroybrands-web" -- run start -w apps/web
pm2 save
pm2 startup

echo "=== Setup complete! ==="
echo "Next: configure Nginx with: sudo nano /etc/nginx/sites-available/stroybrands"
