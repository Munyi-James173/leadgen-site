import { useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useInView } from '../hooks/useInView'

const INITIAL = { name: '', email: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})
  const { track } = useAnalytics()
  const { ref, inView } = useInView()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Please write at least 20 characters'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleFocus = (field) => {
    track('form_field_focus', { field })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    track('form_submit_attempt')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Server error')

      setStatus('success')
      setForm(INITIAL)
      track('form_submit_success')
    } catch {
      setStatus('error')
      track('form_submit_error')
    }
  }

  if (status === 'success') {
    return (
      <section id="contact" className="py-28 bg-ink-900 relative">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass-card p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-acid/10 to-transparent pointer-events-none" />
            <div className="w-20 h-20 bg-acid/20 border border-acid/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16L13 23L26 9" stroke="#C8FF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-3xl text-white mb-3">You're in the pipeline.</h3>
            <p className="font-body text-white/50 mb-8">We'll review your message and get back to you within one business day. Check your inbox for a confirmation.</p>
            <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
              Send another message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-28 bg-ink-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-acid/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: copy */}
          <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="section-label">
              <span className="w-4 h-px bg-acid" />
              Let's Talk
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight mb-6">
              Ready to start growing
              <span className="gradient-text"> faster?</span>
            </h2>
            <p className="font-body text-white/50 text-lg leading-relaxed mb-10">
              Tell us about your business and your goals. We'll put together a no-fluff strategy session tailored to where you are right now.
            </p>

            <div className="space-y-5">
              {[
                { icon: '⏱', title: '24-hour response', desc: 'We reply to every inquiry within one business day.' },
                { icon: '🔒', title: 'Confidential', desc: 'Your details are never shared or sold.' },
                { icon: '🎁', title: 'Free strategy call', desc: '30 minutes of expert insight, zero obligation.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="font-display font-semibold text-white text-sm">{item.title}</div>
                    <div className="font-body text-white/40 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <form onSubmit={handleSubmit} noValidate className="glass-card p-8 md:p-10 space-y-6">
              <h3 className="font-display font-bold text-2xl text-white">Get in touch</h3>

              {/* Name */}
              <div>
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  placeholder="Jane Smith"
                  className={`w-full bg-ink-800 border rounded-xl px-4 py-3.5 text-white font-body placeholder:text-white/20 focus:outline-none transition-colors duration-200 text-sm
                    ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-acid/50'}`}
                />
                {errors.name && <p className="font-mono text-xs text-red-400 mt-1.5">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  placeholder="jane@company.com"
                  className={`w-full bg-ink-800 border rounded-xl px-4 py-3.5 text-white font-body placeholder:text-white/20 focus:outline-none transition-colors duration-200 text-sm
                    ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-acid/50'}`}
                />
                {errors.email && <p className="font-mono text-xs text-red-400 mt-1.5">{errors.email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest block mb-2">
                  Tell us about your project
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  placeholder="We're a B2B SaaS company looking to triple our inbound leads..."
                  rows={5}
                  className={`w-full bg-ink-800 border rounded-xl px-4 py-3.5 text-white font-body placeholder:text-white/20 focus:outline-none transition-colors duration-200 text-sm resize-none
                    ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-acid/50'}`}
                />
                {errors.message && <p className="font-mono text-xs text-red-400 mt-1.5">{errors.message}</p>}
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <p className="font-mono text-xs text-red-400">Something went wrong. Please try again or email us directly.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(200,255,0,0.15)]"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>

              <p className="font-mono text-xs text-white/25 text-center">
                By submitting you agree to our Privacy Policy. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
