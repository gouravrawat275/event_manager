# Event Hub — Full-Stack Event Management System

A complete, production-ready Event Management System with separate User and Admin experiences.

**Stack:** React 18 + Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Hook Form + Zod,
Node.js + Express, MongoDB + Mongoose, JWT + bcrypt, Cloudinary, Recharts, React Toastify.

128 files. Backend and frontend are both complete and wired together.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MongoDB credentials, JWT secrets, Cloudinary, SMTP
npm run dev                # http://localhost:5000
node seed/seed.js          # see "Demo data" below for what this creates
```

Set `MONGO_URI` in `backend/.env` to your MongoDB Atlas connection string. Replace
`<username>` and `<password>` with your database user's credentials, URL-encoding any special
characters. Keep `.env` private; do not commit credentials.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

Log in as `admin@eventhub.com` / `Admin@12345` (change the password immediately — Change Password
is under My Account) to reach `/admin`. Register a normal account to use the user side, or log in
as one of the seeded demo users below.

## Demo data

`node seed/seed.js` is idempotent — safe to re-run; it skips anything that already exists.

**1 admin** — `admin@eventhub.com` / `Admin@12345`

**6 categories** — Music, Technology, Sports, Business, Arts & Culture, Food & Drink

**20 events across 14 cities** — Austin, Boston, Chicago, Denver, Las Vegas, Los Angeles, Miami,
Napa, Nashville, New Orleans, New York, Portland, San Francisco, Seattle. Each has a full
description, real street address, organizer contact info, its own price ($0–$599) and seat count
(150–25,000), and two placeholder images. 19 are `published`, 1 (Photography & Film Expo) is
`draft` so you can see the publish/unpublish flow immediately. 7 are `isFeatured`. Dates are
computed relative to whenever you run the script (10–77 days out), so events always show up as
upcoming instead of going stale.

**2 demo users** — `sarah.demo@eventhub.com` / `james.demo@eventhub.com`, both password
`Demo@1234` — each with a few real bookings (mixing `pending` / `approved` / `rejected` /
`completed` statuses) so My Bookings, the admin Manage Bookings table, and the Dashboard charts
all have real data on first run instead of being empty.

Event images are placeholder photos from picsum.photos (reliable, no API key needed) rather than
hand-curated stock photography — swap `images[].url` on any event for a real photo whenever you're
ready, the field is just a string.

## What's implemented

**Auth:** register, login with remember-me, forgot/reset password, email verification, change
password, JWT in httpOnly cookie + Bearer token, role-based route guards.

**User side:** home page (hero, categories, featured/upcoming/popular sections, testimonials,
stats, newsletter), event listing (grid/list, search, filters, sort, pagination), event details
(gallery, countdown, embedded map, organizer, share buttons, related events), booking flow with a
confirmation step, QR-coded tickets, PDF ticket download, booking history + cancellation, saved
events (wishlist), profile + avatar upload, notifications inbox.

**Admin side:** dashboard with Recharts (stat cards, monthly bookings/revenue line chart, category
pie chart, bookings bar chart), full event CRUD with multi-image upload and publish/unpublish,
category CRUD, user management (search/block/delete/booking history), booking management
(approve/reject/cancel/search/CSV export), broadcast notifications, site settings, admin activity
log.

**Security:** helmet, CORS, mongo-sanitize, xss-clean, rate limiting (global + strict on auth),
Zod validation on every mutating endpoint, bcrypt password hashing, role-based authorization
middleware, MongoDB transactions on booking creation (atomic seat decrement).

**Design:** dark/light mode (persisted, system-aware default), glassmorphism nav, gradient hero,
Framer Motion transitions throughout, loading skeletons, empty states, mobile-first responsive
layout.

## What's intentionally not included

Being upfront about scope boundaries:
- **Infinite scroll** — used pagination instead (more predictable, more accessible, easier to
  deep-link). Swappable if you want it.
- **Dedicated calendar-grid view** of events — list/grid views only.
- **Automated event-reminder cron job** — the reminder notification *type* and broadcast endpoint
  exist; a scheduler (e.g. `node-cron` or a queue) to auto-fire them isn't wired up.
- **Payment gateway** — `paymentStatus` exists on bookings and free events auto-mark `paid`, but
  there's no Stripe/Razorpay integration. That's the natural next slice if you need real payments.
- **Automated tests** — none included; the codebase is structured (controllers/services separated)
  to make adding Jest/Vitest + Supertest straightforward.

## Verification performed

Every file was actually created and checked before packaging, not just described:
- All 44 backend `.js` files pass `node --check` (valid ES module syntax). 46 backend files total
  once you count `.env.example` and `package.json`.
- All 69 frontend files pass an `esbuild` JSX/JS parse check.
- All 184 relative imports across the frontend were confirmed to resolve to real files.
- The 20-event/2-user/7-booking seed data passed a standalone consistency check (every event's
  `categoryName` matches a real category, every booking's `eventTitle` matches a real event,
  `bookedSeats <= seats` and `ticketCount <= seats` on every entry, no duplicate titles or image
  slugs) before being wired into the Mongoose calls.

npm packages were **not** installed (registry access was blocked in the sandbox that built this),
so run `npm install` in both `backend/` and `frontend/` before running — see Quick Start above.
For the same reason, `seed.js` was never actually run against a live MongoDB — the checks above
catch data and syntax errors, not runtime issues, so do a real first run yourself before relying
on it.

## Folder structure

```
event-management-system/
├── backend/
│   ├── config/         # MongoDB + Cloudinary setup
│   ├── models/          # User, Event, Category, Booking, Notification, Settings, ActivityLog
│   ├── controllers/      # 8 controllers — one per resource
│   ├── routes/           # 8 route files, mounted in app.js
│   ├── middleware/       # auth, error handler, validate, rate limiter, activity logger
│   ├── validators/       # Zod schemas per resource
│   ├── services/         # Cloudinary upload
│   ├── utils/            # ApiError, JWT, email, QR code
│   ├── seed/              # admin + categories + 20 events + demo users/bookings
│   ├── app.js / server.js
└── frontend/
    ├── src/
    │   ├── api/           # one axios module per backend resource
    │   ├── context/        # Auth + Theme (Context API, as specified)
    │   ├── hooks/            # useDebounce, useClickOutside
    │   ├── components/
    │   │   ├── common/      # Button, Input, Modal, Skeleton, EmptyState, etc.
    │   │   ├── layout/        # Navbar, Footer, route guards, admin shell
    │   │   ├── home/, events/, booking/
    │   ├── layouts/          # UserLayout, AdminLayout, ProfileLayout
    │   ├── pages/user/        # 14 pages
    │   ├── pages/admin/       # 9 pages
    │   ├── App.jsx            # all routing
    │   └── main.jsx
    └── tailwind.config.js
```
