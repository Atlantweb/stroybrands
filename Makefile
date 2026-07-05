.PHONY: build up down logs ps restart

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

restart:
	docker compose restart

deploy: build up

seed:
	docker compose exec app npx tsx prisma/seed.ts

migrate:
	docker compose exec app npx prisma db push

shell:
	docker compose exec app sh
