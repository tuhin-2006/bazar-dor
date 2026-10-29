# 🛒 বাজার দর — BazarDor

> প্রয়োজনীয় পণ্যের দাম এক নজরে। প্রতিদিনের বাজার, এক জায়গায়—যাতে বাজেট আঁটে সহজে।

**বাজার দর (BazarDor)** is a responsive, Bengali-first marketplace price tracker built with the Next.js App Router. It turns the [Programming Hero BazarDor API](https://openapi.programming-hero.com/api/bazardor/products) into a warm, editorial-style dashboard where shoppers can follow today's prices, spot which products went up or down, compare prices across 12 markets, and keep a personal account.

## ✨ Features

- **Live daily price ticker** — a continuously scrolling marquee with each product's price, unit and ▲/▼ percentage change.
- **Today's biggest movers** — the top 6 price risers (`#বেড়েছে`) and top 6 fallers (`#কমেছে`), ranked by change percentage.
- **All products at a glance** — 33 everyday essentials in a responsive card grid, with Bengali-digit prices, units, category chips and change badges.
- **Category browsing with sorting** — eight category pages with a numeric sort control (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`), URL-driven state and skeleton loading.
- **Protected product details** — product pages require a signed-in session and show min / max / average prices plus a market-by-market comparison table for all 12 markets.
- **Full authentication flow** — BetterAuth email/password plus optional Google and GitHub sign-in, inline validation, toast feedback, protected-route messaging, a profile page and an `updateUser` profile form.
- **Bengali-first design system** — Hind Siliguri used across the entire app, Bengali numerals and dates, cream/forest/saffron palette, custom 404 and error pages.
- **Responsive and accessible** — mobile, tablet and desktop layouts, keyboard-friendly navigation, skip link, semantic landmarks, reduced-motion support and descriptive ARIA labels.
- **Resilient data layer** — live API requests with a 7-second timeout and a local JSON snapshot fallback, so the UI still works if the API is unavailable.

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | BetterAuth (email/password, Google, GitHub) |
| Database | MongoDB (MongoDB Atlas) |
| Icons / UI | lucide-react, react-hot-toast |
| Fonts | next/font — Hind Siliguri |
| Product icons | Bundled Twemoji SVGs (CC-BY 4.0) |

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create the local environment file
cp .env.example .env.local

# 3. Set BETTER_AUTH_SECRET and your MongoDB Atlas MONGODB_URI in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Better Auth creates MongoDB collections and indexes on first use.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes | Signing secret for BetterAuth sessions. |
| `BETTER_AUTH_URL` | Yes | Public URL of the app (`http://localhost:3000` in development). |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical deployed URL used for metadata and trusted origins. |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. Keep it private. |
| `MONGODB_DB` | No | Database name; defaults to `bazardor`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Enables Google sign-in when both are set. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | Enables GitHub sign-in when both are set. |

If OAuth credentials are not configured, the social buttons sign in to a local demo account (`/api/social-demo`) so they still work while developing. Add the provider credentials above to switch to real Google/GitHub OAuth automatically. Run `npm run auth:check` to see which providers are ready and the exact callback URLs to register.

Step-by-step instructions (in Bengali) for creating the Google and GitHub apps: [`docs/oauth-setup.md`](docs/oauth-setup.md).

## 🗄️ Database & Auth Setup

1. Create a MongoDB Atlas cluster and database user, and allow the application's IP address in Atlas Network Access.
2. Paste the Atlas connection string into `MONGODB_URI` in `.env.local`. Set `MONGODB_DB` if you want a database name other than `bazardor`.
3. `lib/db/index.ts` creates the MongoDB client; `lib/db/ensure.ts` creates indexes on first use. Better Auth stores users, sessions, accounts and verifications in MongoDB collections.

Existing SQLite data is not migrated automatically. The MongoDB adapter uses transactions and therefore requires an Atlas cluster or another replica set.

### OAuth callback URLs

- Google: `https://YOUR_DOMAIN/api/auth/callback/google`
- GitHub: `https://YOUR_DOMAIN/api/auth/callback/github`

For local development use `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/github`.

When a user signs in with Google or GitHub, BetterAuth stores the provider account in the `account` table and copies the provider's name/avatar onto the `user` row, so the header and profile page show the real username. Existing email/password accounts with the same verified email are linked automatically (`accountLinking.trustedProviders` in `lib/auth.ts`).

## 📦 Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production build
npm run lint    # Run ESLint
npm run auth:check    # Show which OAuth providers are configured
npm run data:refresh  # Refresh the local JSON API snapshot
```

## ☁️ Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from the table above (`BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` should be your Vercel/custom domain).
4. Deploy. The first auth request creates the MongoDB indexes automatically.
5. Add the production OAuth callback URLs to Google/GitHub if you enable social login.

Configure Atlas Network Access and the database user so the deployed application can connect to the cluster.

## 📁 Project Structure

```text
app/
  (home)/            # Home page and its scoped loading skeleton
  category/[slug]/   # Category listing, sorting, loading and empty states
  product/[slug]/    # Protected product detail + market comparison
  signin/ signup/    # Auth pages
  profile/           # Profile overview and update form
  api/auth/[...all]/ # BetterAuth route handler
components/
  auth/ category/ home/ layout/ product/ products/ profile/ ui/
lib/
  data/              # Product/category snapshot fallback
  db/                # Drizzle schema, client and table bootstrap
  auth.ts            # BetterAuth server configuration
  products.ts        # API fetching, fallback, sorting and stats
  bn.ts              # Bengali numerals, dates, units and percentages
```

## 🔌 Data Source

Product and category data come from the public Programming Hero BazarDor API:

- `GET https://openapi.programming-hero.com/api/bazardor/products`
- `GET https://openapi.programming-hero.com/api/bazardor/categories`

Responses are revalidated every 5 minutes. If the API is unreachable, the bundled snapshot in `lib/data/` is used.

## ⚠️ Disclaimer

সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়। কেনাকাটার আগে স্থানীয় বাজারের সর্বশেষ দাম যাচাই করে নিন।

---

Built by **Dev-nishi-sheikh** as part of **Programming Hero — Assignment 7**.
