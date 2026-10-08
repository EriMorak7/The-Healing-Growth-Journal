# The Healing and Growth Journal
## Production Deployment & Hosting Guide

This guide details the complete process for taking **The Healing and Growth Journal** from local development to production on **Vercel** with a cloud **PostgreSQL** database.

---

### Architecture Overview

* **Frontend & Serverless Engine:** Next.js 14 App Router on Vercel
* **Database:** Cloud PostgreSQL (Recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
* **ORM:** Prisma 5
* **Payments:** Paystack Live API
* **CDN & Media:** Vercel Global Edge Network

---

### Step 1: Cloud Database Setup (PostgreSQL)

During local development, SQLite (`file:./dev.db`) was used. For cloud deployment on Vercel, use a hosted serverless PostgreSQL instance.

1. Create a free account at [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Create a new project named `healing-and-growth-journal`.
3. Copy the pooled connection string, for example:
   ```env
   DATABASE_URL="postgres://glory:[PASSWORD]@[HOST]/neondb?sslmode=require"
   ```
4. **Switch Prisma Provider in `prisma/schema.prisma`:**
   Change line 6 from:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. **Push Schema to Cloud Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
6. **Seed Initial Content & Admin:**
   ```bash
   node scripts/seed.mjs
   node scripts/seed_admin.mjs
   ```

---

### Step 2: Deploy to Vercel

1. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Phase 1-5 production build"
   git remote add origin https://github.com/EriMorak7/The-Healing-Growth-Journal.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the `The-Healing-Growth-Journal` repository.
4. Set the **Framework Preset** to **Next.js**.

---

### Step 3: Production Environment Variables

In the Vercel dashboard under **Settings > Environment Variables**, add the following:

| Variable | Description | Example / Production Value |
|---|---|---|
| `DATABASE_URL` | Cloud PostgreSQL URL | `postgres://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | 32+ character random string | Generate via `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Canonical website domain | `https://thehealingandgrowthjournal.com` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Live Paystack Public Key | `pk_live_xxxxxxxxxxxxxxxxxxxx` |
| `PAYSTACK_SECRET_KEY` | Live Paystack Secret Key | `sk_live_xxxxxxxxxxxxxxxxxxxx` |

Click **Deploy**. Vercel will build and launch the site globally.

---

### Step 4: Custom Domain & DNS Setup

When Glory is ready to attach her registered domain:

1. In the Vercel dashboard, go to **Settings > Domains** and add `thehealingandgrowthjournal.com` and `www.thehealingandgrowthjournal.com`.
2. In your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare), set these DNS records:

| Type | Name | Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | Automatic / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic / 300 |

*Vercel will automatically provision SSL certificates within 5–15 minutes of DNS propagation.*

---

### Step 5: Paystack Webhook Configuration

1. Log into your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer).
2. Go to **Settings > API Keys & Webhooks**.
3. Set the **Live Webhook URL** to:
   ```
   https://thehealingandgrowthjournal.com/api/webhooks/paystack
   ```
4. Save changes. Paystack will now notify your website automatically whenever customer purchases complete.

---

### Step 6: Google Search Console & Indexing

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add your domain property (`thehealingandgrowthjournal.com`).
3. Under **Sitemaps**, submit your dynamic sitemap:
   ```
   https://thehealingandgrowthjournal.com/sitemap.xml
   ```
4. Google will begin indexing your **23 articles**, **10 SEO prompt pages**, and **Start Here pathways**.

---
*Maintained by erimo for The Healing and Growth Journal.*
