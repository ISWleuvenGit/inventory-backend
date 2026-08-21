# inventory-backend

Backend API with Express, TypeScript, Prisma, Better Auth, and MariaDB.

## Development Setup (Backend)

### 1) Enter the Nix dev shell

Use the correct command:

```bash
nix develop --impure
```

If you run `nix develp`, it will fail because of the typo.

### 2) Configure environment variables

Create or update `.env` in the backend root:

```env
PORT=3000
DATABASE_URL=mysql://inventory_user:inventorypass@127.0.0.1:3306/inventory
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=inventory_user
DB_PASSWORD=inventorypass
DB_NAME=inventory
```

### 3) Start MariaDB (if not already running)

Example Docker command:

```bash
docker run -d \
	--name inventory-mariadb \
	-e MARIADB_ROOT_PASSWORD=rootpass \
	-e MARIADB_DATABASE=inventory \
	-e MARIADB_USER=inventory_user \
	-e MARIADB_PASSWORD=inventorypass \
	-p 3306:3306 \
	mariadb:11
```

### 4) Prisma 7 workflow

Set this in your shell before Prisma commands on NixOS:

```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
```

Then run:

```bash
npx prisma validate
npx prisma generate
npx prisma db push
```

Important Prisma 7 note:
- Keep datasource URL in `prisma.config.ts`.
- Do not put `url = env("DATABASE_URL")` inside `schema.prisma`.
- Runtime code should import PrismaClient from `@prisma/client`.
- Avoid importing from `src/generated/prisma/*`, which can become stale.

### 5) Build and run

```bash
npm run build
npm start
```

### 6) Quick checks

```bash
curl http://localhost:3000/health
curl http://localhost:3000/ready
```

### 7) Auth verification (cookie flow)

```bash
rm -f cookies.txt

curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"freshuser2@example.com","password":"secret123"}'

curl -i -b cookies.txt http://localhost:3000/api/auth/session
```

Expected result:
- Login returns `200` and includes `set-cookie: better-auth.session_token=...`.
- Session returns `200` with both `session` and `user` in JSON.

## Useful Commands

```bash
npx prisma studio
npx prisma migrate dev
npm run test:auth-smoke
```
