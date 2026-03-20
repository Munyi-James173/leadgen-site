# Apex — Lead Generation Site

A high-performance, conversion-focused single-page application built with React + Vite (frontend) and Node.js/Express (backend), storing leads and analytics in Supabase.

---

## Project Structure

```
leadgen-site/
├── client/          # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/   # Navbar, Hero, Services, Results, Testimonials, ContactForm, Footer
│   │   ├── hooks/        # useAnalytics, useInView
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── index.js      # Entry point
│   │   ├── routes.js     # /api/leads, /api/analytics, /api/health
│   │   ├── supabase.js   # Supabase client
│   │   └── mailer.js     # Nodemailer email notifications
│   └── package.json
├── package.json     # Root monorepo scripts
└── README.md
```

---

## Prerequisites

- Node.js 18+
- A Supabase project (tables created via migration — see below)
- SMTP credentials (Gmail App Password recommended)

---

## Quick Start (Local Dev)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/leadgen-site.git
cd leadgen-site
npm install                   # installs concurrently at root
npm run install:all           # installs client and server deps
```

### 2. Configure environment variables

**Server:**
```bash
cp server/.env.example server/.env
# Edit server/.env with your Supabase URL, service role key, and SMTP creds
```

**Client (optional — Vite proxy handles API calls in dev):**
```bash
cp client/.env.example client/.env
```

### 3. Run both dev servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port (default: `3001`) |
| `NODE_ENV` | No | `development` or `production` |
| `SUPABASE_URL` | **Yes** | From Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Service role key (keep secret — server only) |
| `SMTP_HOST` | No | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | No | SMTP port (e.g. `587`) |
| `SMTP_USER` | No | SMTP username / email |
| `SMTP_PASS` | No | SMTP password / App Password |
| `NOTIFICATION_EMAIL` | No | Email to receive new lead alerts |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |

### Supabase Values

Find them at: **Supabase Dashboard → Your Project → Project Settings → API**

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  ← secret_key (not anon key)
```

---

## Database

The database schema is applied via Supabase migration. It creates:

- **`leads`** — stores form submissions (id, name, email, message, source, ip_address, user_agent, created_at)
- **`analytics_events`** — stores click/interaction events (id, event_type, event_data, session_id, ip_address, created_at)

Row-level security is enabled on both tables. The server uses the service-role key to bypass RLS.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/leads` | Submit a new lead (rate-limited: 5/15 min per IP) |
| `GET` | `/api/leads` | List all leads (protect with auth in production) |
| `POST` | `/api/analytics` | Track an event |
| `GET` | `/api/analytics` | List events + aggregated counts |
| `GET` | `/api/health` | Health check with DB connectivity status |

---

## Build for Production

### Frontend

```bash
cd client
npm run build
# Output: client/dist/  → deploy to Vercel, Netlify, or serve with Nginx
```

### Backend

```bash
cd server
npm start
# Or use PM2: pm2 start src/index.js --name apex-api
```

---

## Deployment

### Option A — Vercel (frontend) + Railway (backend)

**Frontend → Vercel:**
1. Connect your GitHub repo to Vercel
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var: `VITE_API_URL=https://your-railway-app.up.railway.app`

**Backend → Railway:**
1. Connect repo, set root to `server`
2. Start command: `node src/index.js`
3. Add all `server/.env` variables in Railway's environment panel

### Option B — VPS with Nginx + PM2

```nginx
# /etc/nginx/sites-available/apex
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build
    root /var/www/apex/client/dist;
    index index.html;

    # Proxy API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# On VPS
pm2 start server/src/index.js --name apex-api
pm2 save && pm2 startup
```

### Option C — Serverless (Render)

Deploy `server/` as a Web Service on Render. Set start command to `node src/index.js`.

---

## Performance

Target: **Lighthouse ≥ 90 on mobile**

Optimisations built in:
- Vite code-splitting (vendor chunk separated)
- Google Fonts loaded with `display=swap`
- Images served from CDN (no large local assets)
- Animations use CSS transforms (GPU-composited)
- Analytics fire-and-forget (non-blocking)
- Rate limiting protects API from abuse

---

## License

MIT — use freely, attribution appreciated.
