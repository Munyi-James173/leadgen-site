import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import routes from './routes.js'

const app = express()
const PORT = process.env.PORT || 3001

// ─── Trust proxy (needed behind Nginx / Render / Railway) ────────────────────
app.set('trust proxy', 1)

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '16kb' }))

// ─── Rate limiting ────────────────────────────────────────────────────────────
const leadsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // max 5 form submissions per IP per window
  message: { error: 'Too many submissions. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 60,                   // 60 analytics events per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/leads', leadsLimiter)
app.use('/api/analytics', analyticsLimiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ─── Root health ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ service: 'Apex Lead Gen API', version: '1.0.0', status: 'running' })
})

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[server] Unhandled error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Apex API running on http://localhost:${PORT}`)
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Supabase URL: ${process.env.SUPABASE_URL || '⚠️  Not set'}`)
})
