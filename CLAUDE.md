# CLAUDE.md — Apex Lead Generation Site

This file guides Claude Code (and any AI assistant) on how to understand, extend, and maintain this project correctly.

---

## Project Overview

**Apex** is a full-stack lead generation single-page application.

- **Purpose:** Capture visitor contact details into Supabase and trigger email notifications
- **Frontend:** React 18 + Vite + Tailwind CSS (dark-mode, acid-green brand)
- **Backend:** Node.js 18 + Express 4 (ESM modules)
- **Database:** Supabase (PostgreSQL) — tables: `leads`, `analytics_events`
- **Email:** Nodemailer via SMTP (configured in `server/.env`)

---

## Repository Layout

```
leadgen-site/
├── client/                   # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/       # One file per UI section
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/
│   │   │   ├── useAnalytics.js   # fire-and-forget POST /api/analytics
│   │   │   └── useInView.js      # IntersectionObserver scroll trigger
│   │   ├── App.jsx               # Assembles all sections
│   │   ├── main.jsx              # ReactDOM.createRoot
│   │   └── index.css             # Tailwind directives + global styles
│   ├── index.html
│   ├── vite.config.js            # Dev proxy: /api → localhost:3001
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                   # Backend (Express)
│   ├── src/
│   │   ├── index.js          # App bootstrap, middleware, rate-limiting
│   │   ├── routes.js         # All route handlers
│   │   ├── supabase.js       # Singleton Supabase service-role client
│   │   └── mailer.js         # sendLeadNotification + sendLeadConfirmation
│   ├── .env.example
│   └── package.json
│
├── package.json              # Root scripts (dev, build, install:all)
├── .gitignore
├── README.md
└── CLAUDE.md                 ← you are here
```

---

## Supabase Schema

Project ID: `opxmqeagwqbvjtuhraqq`
Region: `eu-west-2`

### `leads` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, auto-generated |
| name | varchar(255) | Required |
| email | varchar(255) | Required, lowercase stored |
| message | text | Required |
| source | varchar(100) | Default `'contact_form'` |
| ip_address | inet | Captured server-side |
| user_agent | text | |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto via trigger |

### `analytics_events` table
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| event_type | varchar(100) | e.g. `hero_cta_click`, `form_submit_success` |
| event_data | jsonb | Arbitrary metadata |
| session_id | varchar(255) | From sessionStorage |
| ip_address | inet | |
| user_agent | text | |
| created_at | timestamptz | Auto |

**RLS:** Both tables have RLS enabled. The server uses the service-role key (bypasses RLS). Anon inserts are also allowed via policy for direct client use if needed.

---

## Key Conventions

### Frontend

- **No TypeScript** — plain JS/JSX throughout
- **Tailwind only** — no CSS modules or styled-components
- **Custom design tokens** are in `tailwind.config.js`:
  - `ink-950/900/800/700` — dark backgrounds
  - `acid` / `acid-dark` — #C8FF00 brand accent
  - `font-display` → Syne, `font-body` → DM Sans, `font-mono` → DM Mono
- **Animation classes** are defined in `index.css` (`animate-fade-up`, `animate-marquee`, etc.)
- **Scroll animations:** Use `useInView` hook — it sets `inView` to true once element enters viewport, then applies Tailwind transition classes
- **Analytics:** Call `track(eventType, data?)` from `useAnalytics` hook anywhere. It POSTs to `/api/analytics` and silently fails — never blocks UI

### Backend

- **ESM modules** (`"type": "module"` in package.json) — always use `import/export`, never `require()`
- **No TypeScript** — plain JS
- **Validation:** Use `validator` npm package for email checks, sanitise with `validator.escape()`
- **Supabase client** is in `server/src/supabase.js` — import it as a singleton
- **Emails** are fire-and-forget inside `Promise.all().catch()` — email failures must never cause a 500
- **Rate limits:** 5 lead submissions / 15 min per IP; 60 analytics events / 1 min per IP

---

## Common Tasks for Claude Code

### Add a new section to the frontend

1. Create `client/src/components/NewSection.jsx`
2. Use `useInView` for scroll-triggered entry animation
3. Use `useAnalytics` to track relevant CTA clicks
4. Import and add `<NewSection />` inside `App.jsx` at the right position

### Add a new API endpoint

1. Add route handler to `server/src/routes.js`
2. Use `supabase` from `./supabase.js` for DB operations
3. Add rate limiter in `server/src/index.js` if the endpoint is user-facing
4. Document the endpoint in `README.md`

### Add a new database table

1. Use Supabase MCP to run `apply_migration` with a snake_case name
2. Enable RLS on the new table
3. Create appropriate policies

### Change brand colours

Edit `tailwind.config.js` → `theme.extend.colors`. The `acid` key controls the primary CTA and highlight colour throughout.

### Deploy to production

See the Deployment section in `README.md`.

---

## Do Not

- Do **not** import the Supabase client in frontend components — all DB access goes through the Express API
- Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend (it's server-only)
- Do **not** commit `.env` files — use `.env.example` templates
- Do **not** use `require()` in the server — it's ESM only
- Do **not** add TypeScript unless the client explicitly requests it

---

## Testing

No test suite is included by default. For manual testing:

```bash
# Test lead submission
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message from curl"}'

# Check health
curl http://localhost:3001/api/health

# Check analytics counts
curl http://localhost:3001/api/analytics
```

---

## Supabase MCP Connection

This project is connected to Supabase via MCP. When using Claude Code, the MCP server is available at `https://mcp.supabase.com/mcp`. Use it to:

- Apply new migrations (`apply_migration`)
- Run ad-hoc SQL queries (`execute_sql`)
- List existing migrations and tables

Always prefer `apply_migration` over `execute_sql` for schema changes — it keeps the migration history clean.
