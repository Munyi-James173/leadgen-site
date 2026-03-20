import { Router } from 'express'
import validator from 'validator'
import supabase from './supabase.js'
import { sendLeadNotification, sendLeadConfirmation } from './mailer.js'

const router = Router()

// ─── POST /api/leads ─────────────────────────────────────────────────────────
router.post('/leads', async (req, res) => {
  const { name, email, message } = req.body

  // --- Validation ---
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  if (typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
  const userAgent = req.headers['user-agent'] || null

  // --- Insert into Supabase ---
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: validator.escape(name.trim()),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      source: 'contact_form',
      ip_address: ip,
      user_agent: userAgent,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[leads] Supabase insert error:', error)
    return res.status(500).json({ error: 'Failed to save lead. Please try again.' })
  }

  // --- Send emails (fire-and-forget, don't block response) ---
  Promise.all([
    sendLeadNotification({ name: name.trim(), email: email.trim(), message: message.trim(), id: data.id }),
    sendLeadConfirmation({ name: name.trim(), email: email.trim() }),
  ]).catch((err) => console.error('[leads] Email error (non-fatal):', err))

  return res.status(201).json({ success: true, id: data.id })
})

// ─── GET /api/leads ───────────────────────────────────────────────────────────
// Admin-only: list all leads (protect this in production with auth middleware)
router.get('/leads', async (req, res) => {
  const { data, error } = await supabase
    .from('leads')
    .select('id, name, email, message, source, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.json({ leads: data, count: data.length })
})

// ─── POST /api/analytics ─────────────────────────────────────────────────────
router.post('/analytics', async (req, res) => {
  const { event_type, event_data, session_id } = req.body

  if (!event_type || typeof event_type !== 'string') {
    return res.status(400).json({ error: 'event_type is required' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress

  const { error } = await supabase.from('analytics_events').insert({
    event_type: event_type.slice(0, 100),
    event_data: event_data || {},
    session_id: session_id || null,
    ip_address: ip,
    user_agent: req.headers['user-agent'] || null,
  })

  if (error) {
    console.error('[analytics] Insert error:', error.message)
    // Don't return error to client — analytics should never break UX
  }

  return res.status(202).json({ ok: true })
})

// ─── GET /api/analytics ───────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, event_data, session_id, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Aggregate event counts
  const counts = data.reduce((acc, row) => {
    acc[row.event_type] = (acc[row.event_type] || 0) + 1
    return acc
  }, {})

  return res.json({ events: data, counts, total: data.length })
})

// ─── GET /api/health ──────────────────────────────────────────────────────────
router.get('/health', async (req, res) => {
  const { error } = await supabase.from('leads').select('id').limit(1)
  return res.json({
    status: error ? 'degraded' : 'ok',
    db: error ? 'error' : 'connected',
    timestamp: new Date().toISOString(),
  })
})

export default router
