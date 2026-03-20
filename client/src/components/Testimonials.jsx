import { useState, useEffect, useCallback } from 'react'
import { useInView } from '../hooks/useInView'
import { useAnalytics } from '../hooks/useAnalytics'

const testimonials = [
  {
    quote: "Apex didn't just build us a website—they rebuilt our entire lead capture pipeline. We went from 40 leads a month to over 300 in the first quarter.",
    name: 'Sarah Chen',
    role: 'CEO, Meridian SaaS',
    avatar: 'SC',
    color: 'from-purple-500/20 to-blue-500/20',
  },
  {
    quote: "Their conversion-first approach is unlike any agency I've worked with. Every decision ties back to revenue. We 4×'d our pipeline value in six months.",
    name: 'Marcus Williams',
    role: 'VP Growth, Talara B2B',
    avatar: 'MW',
    color: 'from-emerald-500/20 to-cyan-500/20',
  },
  {
    quote: "The site they built loads in under a second and our Lighthouse score sits at 98. That alone moved us 14 spots on Google. Phenomenal engineering.",
    name: 'Priya Nair',
    role: 'Head of Digital, Solum Media',
    avatar: 'PN',
    color: 'from-orange-500/20 to-rose-500/20',
  },
  {
    quote: "From strategy to deployment in 3 weeks. Clean code, beautiful design, and they actually explain what they're doing. Rare combination.",
    name: 'James O\'Brien',
    role: 'Founder, Fieldstone Labs',
    avatar: 'JO',
    color: 'from-acid/20 to-lime-500/20',
  },
  {
    quote: "Our email automation sequences alone generate $80K/month in recovered revenue. The ROI on this engagement was immediately obvious.",
    name: 'Amara Osei',
    role: 'COO, Revel Commerce',
    avatar: 'AO',
    color: 'from-pink-500/20 to-violet-500/20',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const { ref, inView } = useInView()
  const { track } = useAnalytics()

  const next = useCallback(() => {
    setActive((a) => (a + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
  }, [])

  // Auto-advance every 5s unless paused
  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  const handleDot = (i) => {
    setActive(i)
    track('testimonial_dot_click', { index: i })
    setPaused(true)
    setTimeout(() => setPaused(false), 8000)
  }

  const t = testimonials[active]

  return (
    <section id="testimonials" className="py-28 bg-ink-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent" />

      {/* Marquee logos strip */}
      <div className="mb-20 overflow-hidden border-y border-white/5 py-5">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {['Meridian', 'Talara', 'Solum Media', 'Fieldstone', 'Revel', 'Orbis', 'Stratum', 'Vantage', 'Pinnacle', 'Nexus',
            'Meridian', 'Talara', 'Solum Media', 'Fieldstone', 'Revel', 'Orbis', 'Stratum', 'Vantage', 'Pinnacle', 'Nexus'].map((name, i) => (
            <span key={i} className="font-display font-bold text-sm text-white/20 uppercase tracking-widest shrink-0">{name}</span>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 text-center mb-14 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label justify-center">
            <span className="w-4 h-px bg-acid" />
            Testimonials
            <span className="w-4 h-px bg-acid" />
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            Don't take our word for it.
          </h2>
        </div>

        {/* Main testimonial card */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="glass-card p-10 md:p-14 relative overflow-hidden min-h-[280px] flex flex-col justify-between"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-30 transition-all duration-700 pointer-events-none`} />

          {/* Quote mark */}
          <div className="absolute top-8 right-10 font-display text-8xl text-acid/10 select-none leading-none">"</div>

          <blockquote className="relative z-10">
            <p className="font-body text-xl md:text-2xl text-white/80 leading-relaxed mb-8 font-light">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-acid/20 border border-acid/40 flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-sm text-acid">{t.avatar}</span>
              </div>
              <div>
                <div className="font-display font-semibold text-white">{t.name}</div>
                <div className="font-mono text-xs text-white/40 uppercase tracking-wider">{t.role}</div>
              </div>
            </div>
          </blockquote>

          {/* Navigation */}
          <div className="relative z-10 flex items-center justify-between mt-10 pt-6 border-t border-white/5">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-2 bg-acid' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { prev(); setPaused(true) }} className="w-10 h-10 glass-card hover:border-acid/40 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => { next(); setPaused(true) }} className="w-10 h-10 glass-card hover:border-acid/40 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
