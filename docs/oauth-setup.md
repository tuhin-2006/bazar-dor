# Google / GitHub অ্যাকাউন্ট সংযুক্ত করা

এই গাইডে দেখা যাচ্ছে কীভাবে নিজের **Gmail (Google)** বা **GitHub** অ্যাকাউন্ট দিয়ে
সাইন ইন করলে সেই অ্যাকাউন্ট (নাম, ছবি, প্রোভাইডার আইডি, টোকেন) ডেটাবেজে
সংরক্ষিত হবে।

> এখন `.env.local`-এ Google/GitHub credential না থাকলে সাইন-ইন বাটনগুলো
> `app/api/social-demo/route.ts`-এর **ডেমো অ্যাকাউন্ট** ব্যবহার করে। তখন
> প্রোফাইলে “Google ডেমো ব্যবহারকারী” বা “GitHub ডেমো ব্যবহারকারী” দেখায়।
> আসল নাম/ছবি আসতে নিচের ধাপগুলো লাগবে।

---

## ১. যা যা লাগবে

| জিনিস | কোথায় পাবেন |
| --- | --- |
| Google Client ID + Secret | <https://console.cloud.google.com/apis/credentials> |
| GitHub Client ID + Secret | <https://github.com/settings/developers> |
| App-এর URL | ডেভেলপমেন্টে `http://localhost:3000` |

দুটো প্রোভাইডারের জন্য আলাদা credential লাগে। একটা দিলে শুধু সেটাই আসল
লগইন হবে, অন্যটা ডেমোই থাকবে।

---

## ২. Google OAuth Client বানানো

1. <https://console.cloud.google.com/>-এ নিজের Gmail দিয়ে লগইন করুন।
2. উপরে নতুন **Project** বানান (যেমন `bazar-dor`)।
3. বাম মেনু → **APIs & Services → OAuth consent screen**।
   - User type: **External** → Create।
   - App name: `বাজার দর`, User support email: আপনার Gmail।
   - Developer contact: আপনার Gmail → Save and continue।
   - **Audience / Test users**-এ **Add users** দিয়ে নিজের Gmail যোগ করুন।
     (App “Testing” অবস্থায় থাকলে শুধু এই ইমেইলগুলোই লগইন করতে পারে।)
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**।
   - Application type: **Web application**
   - Name: `BazarDor Local`
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**:
     `http://localhost:3000/api/auth/callback/google`
5. **Create** → **Client ID** ও **Client secret** কপি করুন।

> পরে ডিপ্লয় করলে প্রোডাকশন ডোমেইনের জন্য আরেকটা redirect URI যোগ করতে হবে:
> `https://YOUR_DOMAIN/api/auth/callback/google`

---

## ৩. GitHub OAuth App বানানো

1. <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**।
2. ঘরগুলো পূরণ করুন:
   - Application name: `BazarDor`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     `http://localhost:3000/api/auth/callback/github`
3. **Register application**।
4. **Generate a new client secret** → **Client ID** ও **Client secret** কপি করুন।

> GitHub-এ ইমেইল প্রাইভেট থাকলেও সমস্যা নেই — Better Auth
> `read:user` + `user:email` scope দিয়ে প্রাইমারি ভেরিফায়েড ইমেইল নিয়ে আসে।

---

## ৪. `.env.local`-এ বসানো

প্রজেক্টের রুটে `.env.local` ফাইলে যোগ করুন:

```env
GOOGLE_CLIENT_ID=আপনার-google-client-id
GOOGLE_CLIENT_SECRET=আপনার-google-client-secret
GITHUB_CLIENT_ID=আপনার-github-client-id
GITHUB_CLIENT_SECRET=আপনার-github-client-secret
```

তারপর টার্মিনালে যাচাই করুন:

```bash
npm run auth:check
```

সব ঠিক থাকলে দুটো প্রোভাইডারের পাশে ✅ আর callback URL দেখাবে।

---

## ৫. চালু করা ও টেস্ট করা

1. `npm run dev` বন্ধ করে আবার চালু করুন (env পরিবর্তন হলে রিস্টার্ট লাগে)।
2. অ্যাপে আগে থেকে লগইন থাকলে **সাইন আউট** করুন।
3. `/signin` বা `/signup`-এ গিয়ে **Google** / **GitHub** বাটনে ক্লিক করুন।
4. প্রোভাইডারের নিজের লগইন/সম্মতি পেজ আসবে — সেখানে নিজের অ্যাকাউন্ট বেছে নিন।
5. ফিরে এসে **প্রোফাইল** পেজে দেখবেন আপনার আসল **নাম**, **ইমেইল** ও **ছবি**
   (হেডারের ডান দিকেও প্রথম নামটি দেখাবে)।

এর মানে ওই প্রোভাইডার অ্যাকাউন্ট ডেটাবেজের `account` টেবিলে সংরক্ষিত হয়েছে
(`provider_id = google/github`, `account_id`, access/refresh token সহ)।

---

## ৬. ডেটা কোথায় থাকে

| টেবিল | কী থাকে |
| --- | --- |
| `user` | নাম, ইমেইল, অ্যাভাটার (`image`), ভেরিফিকেশন |
| `account` | প্রতিটি লগইন পদ্ধতি — `provider_id`, `account_id`, টোকেন, scope |
| `session` | লগইন সেশন ও কুকি টোকেন |

- একই ইমেইলে আগে ইমেইল/পাসওয়ার্ড অ্যাকাউন্ট থাকলে Google/GitHub লগইন
  অটো-লিংক হবে (`lib/auth.ts`-এ `accountLinking.trustedProviders`)।
- বর্তমানে authentication ডেটা MongoDB-তে থাকে। `.env.local`-এ
  `MONGODB_URI` ও প্রয়োজনে `MONGODB_DB` সেট করতে হবে। আগের SQLite ডেটা
  স্বয়ংক্রিয়ভাবে MongoDB-তে স্থানান্তরিত হয় না।

---

## ৭. সমস্যা হলে

| সমস্যা | কারণ / সমাধান |
| --- | --- |
| এখনো “ডেমো ব্যবহারকারী” দেখাচ্ছে | `.env.local`-এ credential নেই বা dev server রিস্টার্ট করা হয়নি। `npm run auth:check` চালান। |
| `redirect_uri_mismatch` (Google) | Google Console-এ redirect URI হুবহু `http://localhost:3000/api/auth/callback/google` আছে কি না দেখুন। |
| `Access blocked` / `403` (Google) | OAuth consent screen “Testing” হলে আপনার Gmail **Test users**-এ যোগ করুন। |
| GitHub-এ `redirect_uri` error | OAuth App-এর callback URL হুবহু `http://localhost:3000/api/auth/callback/github` দিন। |
| লগইনের পরও পুরোনো অ্যাকাউন্ট | সেশন কুকি পুরোনো। সাইন আউট করে আবার চেষ্টা করুন। |
| প্রোডাকশনে কাজ করছে না | `BETTER_AUTH_URL` / `NEXT_PUBLIC_SITE_URL` ও প্রোডাকশন callback URL সেট করুন। |

---

## ৮. প্রোডাকশনে (Vercel)

1. Google/GitHub-এ প্রোডাকশন callback URL যোগ করুন:
   - `https://YOUR_DOMAIN/api/auth/callback/google`
   - `https://YOUR_DOMAIN/api/auth/callback/github`
2. Vercel-এর Environment Variables-এ চারটি credential যোগ করুন।
3. `BETTER_AUTH_URL=https://YOUR_DOMAIN` এবং
   `NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN` সেট করুন।
4. Redeploy করুন।
