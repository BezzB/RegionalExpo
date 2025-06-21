# Instructions for Rebuilding the Regional Climate Expo Website in Next.js

This document provides detailed instructions for recreating the original PHP-based Regional Climate Expo site using a **modern Next.js + Supabase + Tailwind CSS** stack.

---

## 📊 Architecture Overview

The new app is structured as:

1. **Next.js (App Router)**: Handles routing, rendering, and client/server logic
2. **Supabase**: Provides database, authentication, storage, and API capabilities
3. **Tailwind CSS**: Utility-first CSS framework for modern UI design

---

## 🚀 Technology Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | Next.js 14 (App Router)    |
| Styling    | Tailwind CSS               |
| Animations | Framer Motion, Lottie      |
| API/Data   | React Query + Supabase SDK |
| Database   | Supabase PostgreSQL        |
| Auth       | Supabase Auth              |
| Storage    | Supabase Buckets           |
| Forms      | React Hook Form + Zod      |
| Hosting    | Vercel                     |

---

## ⚙️ Project Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/regional-climate-expo.git
cd regional-climate-expo
npm install
```

### 2. Create Supabase Project

* Go to [https://supabase.com](https://supabase.com)
* Create tables: `events`, `gallery`, `sponsors`, `testimonials`, `contacts`, `newsletter`
* Set up buckets: `event-media`, `gallery`, `sponsors`
* Enable **email/password auth**
* Apply RLS policies (only authenticated users can write)

### 3. Set Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure

```
/
├── app/                  # App Router
│   ├── (routes)/         # Public and admin pages
│   └── admin/            # Admin dashboard and login
├── components/           # UI components (Header, Forms, etc.)
├── lib/                  # Supabase client and helpers
├── styles/               # Tailwind configuration and global styles
├── public/               # Static files and images
├── .env.local            # Environment config
```

---

## 🔐 Admin Panel

Located under `/admin`

### Features:

* Login via Supabase Auth
* Protected via session-based guards
* Manage:

  * Events (CRUD)
  * Sponsors (Add logos)
  * Gallery (Image uploads)
  * Testimonials (Approval system)
  * Contacts (View/export CSV)
  * Newsletter Subscribers

### Route Protection Example:

```ts
if (!session || user.role !== 'admin') {
  router.push('/login');
}
```

---

## 💾 File Upload Example

```ts
await supabase.storage.from('event-media')
  .upload(`event-${id}/${file.name}`, file);
```

Retrieve URL:

```ts
const { publicURL } = supabase
  .storage.from('event-media')
  .getPublicUrl(path);
```

---

## 🏑 Deployment (Vercel)

1. Push project to GitHub
2. Import it into [vercel.com](https://vercel.com)
3. Add env vars in Vercel dashboard
4. Deploy!

---

## 🔍 Optional Enhancements

| Feature       | Tool/Method                         |
| ------------- | ----------------------------------- |
| Dark Mode     | Tailwind's `dark:` variant          |
| SEO           | `next/head` metadata + OG tags      |
| PDF Export    | Supabase Edge Functions + Puppeteer |
| Image CDN     | Supabase + Optimized URL params     |
| Accessibility | Headless UI / WCAG compliance       |
| Analytics     | Google Analytics / Plausible        |

---

## 🚀 Summary

By using **Next.js**, **Supabase**, and **Tailwind CSS**, this app provides a lightning-fast, scalable, and modern UX for both public users and admins, replacing the legacy PHP-based system.

Make sure to:

* Apply RLS to your tables
* Never expose `service_role` keys client-side
* Use Supabase’s permissions and policies to manage data security

Ready to deploy – fast, beautiful, and secure. 🌟
