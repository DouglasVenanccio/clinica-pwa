# AGENTS.md

## Repository Structure

Two separate apps share this repo:

- **Root**: Next.js PWA (App Router, TypeScript, Prisma, PostgreSQL)
- **`frontend/`**: Base44 React SPA (Vite, React 18, React Router)

The Next.js app is the primary application. `frontend/` is a Base44-managed frontend.

## Commands

### Next.js (root)

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to DB
npm run db:migrate   # Create migration (dev)
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio
```

After schema changes: `npm run db:generate && npm run db:push`

### Base44 Frontend (`frontend/`)

```bash
cd frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (jsconfig.json)
```

## Path Aliases

Both apps use `@/*` aliases, but they map to different roots:
- Root Next.js: `@/*` → `./src/*`
- Frontend: `@/*` → `./src/*`

## Key Files

- `prisma/schema.prisma` — Database schema (12 models)
- `src/lib/auth.ts` — Auth.js config (credentials + Google OAuth, JWT sessions)
- `src/lib/prisma.ts` — Prisma client singleton
- `src/middleware.ts` — Minimal middleware (passthrough)
- `src/app/api/` — 12 API route groups
- `tailwind.config.ts` — Custom design tokens (creme/gold palette)
- `docker/Dockerfile` — Multi-stage build (node:20-alpine)
- `docker-compose.yml` — Dev stack (app + PostgreSQL + Nginx)

## Design System

- **Colors**: `creme` (#F5F0E8), `dourado` (#C9A96E), `marrom` (#5C4A3A)
- **Fonts**: `font-titulo` (Playfair Display), `font-corpo` (Inter)
- **UI**: shadcn/ui components in `src/components/ui/`

## Database

- PostgreSQL 16 via Prisma ORM
- Seed creates: 1 admin, 3 clients, 3 professionals, 4 services, 3 categories
- Default seed password: `12345678` (all test accounts)
- Seed emails: `admin@clinica.com`, `juliana@email.com`, `ana@clinica.com`, etc.

## Conventions

- **Language**: Portuguese (pt-BR) for code comments, UI text, and database
- **Auth**: Auth.js v5 beta, JWT strategy, `trustHost: true`, cookies not secure (Nginx terminates TLS)
- **TypeScript**: `ignoreBuildErrors: true` in next.config.ts — don't rely on build for type checking
- **No test suite**: No testing framework configured
- **No CI**: No GitHub Actions or CI pipeline found
- **Always push**: After any change, commit and `git push origin main`

## Docker

Dev: `docker-compose.yml` (app + db + nginx on ports 80/443/3000/5432)
Prod: `docker-compose.prod.yml` (db only, app runs separately)

## Production Deployment

**Server**: `ubuntu@136.248.114.169` (SSH key: `chaves/clinica_key.key`)

```bash
ssh -i chaves/clinica_key.key ubuntu@136.248.114.169
```

**Architecture on server**:
- Nginx serves Vite frontend static files (`frontend/dist`) on port 80
- Nginx proxies `/api/*` to Next.js on `127.0.0.1:3000`
- Next.js runs via systemd service `clinica-pwa.service`
- PostgreSQL runs in Docker container `clinica-db` on port 5432

**Deploy steps** (from local machine):
```bash
git push origin main
ssh -i chaves/clinica_key.key ubuntu@136.248.114.169
cd ~/clinica
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
cd frontend && npm install && npm run build && cd ..
sudo systemctl restart clinica-pwa
```

**Check status**:
```bash
ssh -i chaves/clinica_key.key ubuntu@136.248.114.169 "sudo systemctl status clinica-pwa && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/"
```

**Git remote**: `https://github.com/DouglasVenanccio/clinica-pwa.git`
