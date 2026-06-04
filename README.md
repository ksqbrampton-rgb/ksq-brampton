# Knowledge Square — NIN Brampton

**NIMC-accredited Nigerian NIN Diaspora Enrollment Platform**  
Brampton, Ontario, Canada · [ksqbrampton.ca](https://ksqbrampton.ca)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL 15 (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (staff only) |
| Storage | Supabase Storage |
| Email | Resend + React Email |
| Hosting | Vercel (Hobby) |
| Cron | Vercel Cron |
| Rate Limiting | Upstash Redis |

---

## Getting Started

### Prerequisites

- Node.js v20.x
- npm v10+
- A Supabase project (create at [supabase.com](https://supabase.com))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in your Supabase credentials

# 3. Generate Prisma client
npx prisma generate

# 4. Push schema to your database (first time)
npx prisma db push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
ksq-brampton/
├── app/
│   ├── (public)/          # Public-facing pages (landing, how-to-enroll, etc.)
│   ├── admin/             # Staff-only routes (protected by middleware)
│   └── api/               # API routes
├── components/
│   ├── public/            # Public site components
│   └── admin/             # Admin dashboard components (Phase 3)
├── lib/                   # Utilities, DB client, constants, auth
└── prisma/                # Database schema + migrations
```

---

## Build Phases

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Current | Foundation, public site, admin shell |
| 2 | ⏳ Next | Booking engine (calendar, slot picker, guest form) |
| 3 | 🔲 Planned | Admin dashboard core |
| 4 | 🔲 Planned | Documents & email notifications |
| 5 | 🔲 Planned | Reporting & staff management |
| 6 | 🔲 Planned | QA, security review, launch |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

```env
DATABASE_URL=          # Supabase pooler connection string
NEXTAUTH_SECRET=       # openssl rand -base64 32
SUPABASE_URL=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations (dev)
npm run db:push      # Push schema to DB (no migration file)
npm run db:studio    # Open Prisma Studio
```

---

*SRD v3.0 · Custom in-app booking engine · No third-party scheduling dependency*
