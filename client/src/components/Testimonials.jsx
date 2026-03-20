import { useState, useEffect, useCallback } from 'react'
import { useInView } from '../hooks/useInView'
import { useAnalytics } from '../hooks/useAnalytics'

const testimonials = [
  {
    quote: "Before Apex, we were burning $14,000/month on ads with nothing to show for it. Within 60 days they rebuilt our entire funnel, cut our cost-per-lead by 68%, and we hit our best revenue quarter ever. I wish we'd found them two years earlier.",
    name: 'Daniel Okafor',
    role: 'CEO, BrightPath SaaS',
    avatar: 'DO',
    metric: '68%',
    metricLabel: 'Lower cost-per-lead',
    gradient: 'from-violet-600/20 to-indigo-600/20',
    accentColor: '#a78bfa',
  },
  {
    quote: "We launched a brand new product with zero audience. Apex built the landing page, the email sequences, and the ad creative from scratch. We closed $380,000 in pre-sales in the first 30 days. Their team works like they have equity in your business.",
    name: 'Amara Diallo',
    role: 'Founder, Kova Fintech',
    avatar: 'AD',
    metric: '$380K',
    metricLabel: 'Pre-sales in 30 days',
    gradient: 'from-emerald-600/20 to-teal-600/20',
    accentColor: '#34d399',
  },
  {
    quote: "Our old site took 6.8 seconds to load on mobile. Apex rebuilt it in React and got us to 0.9 seconds. That single change lifted our conversion rate by 41% and moved us from page 3 to position 4 on Google — organically, without a single backlink campaign.",
    name: 'Sophie Marchetti',
    role: 'Head of Digital, Solum Media',
    avatar: 'SM',
    metric: '0.9s',
    metricLabel: 'Mobile load time',
    gradient: 'from-sky-600/20 to-blue-600/20',
    accentColor: '#38bdf8',
  },
  {
    quote: "I've worked with five agencies in eight years. Most take your money, send reports, and shrug. Apex is different — they own outcomes. When something didn't work, they told us immediately, pivoted, and fixed it at no extra cost. That accountability alone is worth every penny.",
    name: 'Marcus Wellington',
    role: 'VP Growth, Talara B2B',
    avatar: 'MW',
    metric: '4.1×',
    metricLabel: 'Pipeline ROI',
    gradient: 'from-orange-600/20 to-rose-600/20',
    accentColor: '#fb923c',
  },
  {
    quote: "Our email list was completely dead — 8% open rate, no clicks, no revenue. Apex restructured our segmentation, rewrote every sequence, and set up behavioral triggers. Open rates are now at 44% and our email channel generates $90,000/month on autopilot.",
    name: 'Priya Nair',
    role: 'COO, Revel Commerce',
    avatar: 'PN',
    metric: '$90K/mo',
    metricLabel: 'Email revenue',
    gradient: 'from-pink-600/20 to-fuchsia-600/20',
    accentColor: '#e879f9',
  },
  {
    quote: "We needed a full CRM integration, lead scoring system, and automated follow-up flows built in three weeks for a product launch. Apex delivered on day 19. The system has since captured over 2,400 qualified leads and our sales team has never been more productive.",
    name: 'James Osei',
    role: 'Founder, Fieldstone Labs',
    avatar: 'JO',
    metric: '2,400+',
    metricLabel: 'Qualified leads captured',
    gradient: 'from-acid/20 to-lime-600/20',
    accentColor: '#C8FF00',
  },
  {
    quote: "Apex didn't just redesign our website — they redesigned how we think about growth. The strategy session alone was worth the entire contract. Six months later we've doubled our team, tripled MRR, and we're oversubscribed for the next quarter.",
    name: 'Lena Hofmann',
    role: 'Co-Founder, Stratum Analytics',
    avatar: 'LH',
    metric: '3×',
    metricLabel: 'MRR in 6 months',
    gradient: 'from-cyan-600/20 to-teal-600/20',
    accentColor: '#22d3ee',
  },
  {
    quote: "The ROI tracking dashboard they built for us surfaced something we'd been missing for 18 months — one ad set was consuming 40% of our budget and converting at 0.3%. We killed it, reallocated, and added $1.2M in attributable revenue in Q3 alone.",
    name: 'Robert Mwangi',
    role: 'CMO, Vantage Logistics',
    avatar: 'RM',
    metric: '$1.2M',
    metricLabel: 'Added Q3 revenue',
    gradient: 'from-amber-600/20 to-yellow-600/20',
    accentColor: '#fbbf24',
  },
]

const STARS = [1, 2, 3, 4, 5]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { ref, inView } = useInView()
  const { track } = useAnalytics()

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 200)
  }, [animating])

  const next = useCallback(() => goTo((active + 1) % testimonials.length), [active, goTo])
  const prev = useCallback(() => goTo((active - 1 + testimonials.length) % testimonials.length), [active, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [paused, next])

  const handleDot = (i) => {
    goTo(i)
    track('testimonial_dot_click', { index: i })
    setPaused(true)
    setTimeout(() => setPaused(false), 10000)
  }

  const t = testimonials[active]

  return (
    <section id="testimonials" className="py-28 bg-ink-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent" />

      {/* Scrolling client name marquee */}
      <div className="mb-20 overflow-hidden border-y border-white/5 py-4">
        <div className="flex gap-20 animate-marquee whitespace-nowrap">
          {[
            'BrightPath SaaS', 'Kova Fintech', 'Solum Media', 'Talara B2B',
            'Revel Commerce', 'Fieldstone Labs', 'Stratum Analytics', 'Vantage Logistics',
            'Orbis Capital', 'Nexus Health', 'Pinnacle RE', 'Meridian Cloud',
            // duplicate for seamless loop
            'BrightPath SaaS', 'Kova Fintech', 'Solum Media', 'Talara B2B',
            'Revel Commerce', 'Fieldstone Labs', 'Stratum Analytics', 'Vantage Logistics',
            'Orbis Capital', 'Nexus Health', 'Pinnacle RE', 'Meridian Cloud',
          ].map((name, i) => (
            <span key={i} className="font-display font-bold text-xs text-white/15 uppercase tracking-[0.2em] shrink-0">
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="section-label justify-center">
            <span className="w-4 h-px bg-acid" />
            Client Results
            <span className="w-4 h-px bg-acid" />
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Real clients. Real numbers.
            <span className="gradient-text"> No fluff.</span>
          </h2>
          <p className="font-body text-white/40 text-lg max-w-xl mx-auto">
            Every testimonial below is tied to a specific outcome we delivered — with the metric to prove it.
          </p>
        </div>

        {/* Main testimonial card */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className={`glass-card relative overflow-hidden transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Dynamic background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} transition-all duration-700 pointer-events-none`} />

          {/* Decorative quote mark */}
          <div className="absolute top-6 right-8 font-display text-[120px] leading-none select-none pointer-events-none"
               style={{ color: t.accentColor, opacity: 0.07 }}>
            "
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

              {/* Left: metric callout + author */}
              <div className="lg:col-span-1 flex flex-col justify-between gap-8">

                {/* Big metric */}
                <div className="glass-card p-6 text-center border-0 bg-white/5">
                  <div
                    className="font-display font-extrabold text-4xl mb-1 transition-all duration-500"
                    style={{ color: t.accentColor }}
                  >
                    {t.metric}
                  </div>
                  <div className="font-mono text-xs text-white/40 uppercase tracking-wider leading-tight">
                    {t.metricLabel}
                  </div>
                </div>

                {/* Author */}
                <div className="flex lg:flex-col items-center lg:items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-display font-bold text-base"
                    style={{ backgroundColor: `${t.accentColor}22`, border: `1px solid ${t.accentColor}44`, color: t.accentColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white text-base">{t.name}</div>
                    <div className="font-mono text-xs text-white/40 uppercase tracking-wider mt-0.5">{t.role}</div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-2">
                      {STARS.map((s) => (
                        <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={t.accentColor}>
                          <path d="M6 1L7.5 4.5H11L8 7L9 10.5L6 8.5L3 10.5L4 7L1 4.5H4.5L6 1Z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: quote */}
              <div className="lg:col-span-3 flex flex-col justify-center">
                <p className="font-body text-xl md:text-2xl text-white/85 leading-relaxed font-light">
                  "{t.quote}"
                </p>
              </div>
            </div>

            {/* Navigation row */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">

              {/* Dots */}
              <div className="flex gap-2 flex-wrap">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDot(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === active ? '24px' : '8px',
                      height: '8px',
                      backgroundColor: i === active ? t.accentColor : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/25">
                  {active + 1} / {testimonials.length}
                </span>
                <button
                  onClick={() => { prev(); setPaused(true) }}
                  className="w-10 h-10 glass-card hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => { next(); setPaused(true) }}
                  className="w-10 h-10 glass-card hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all"
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom mini-cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className={`glass-card p-4 text-left transition-all duration-300 hover:scale-105
                ${i === active ? 'border-white/20 bg-white/8' : 'hover:border-white/15'}`}
            >
              <div
                className="font-display font-bold text-xl mb-1"
                style={{ color: item.accentColor }}
              >
                {item.metric}
              </div>
              <div className="font-mono text-xs text-white/35 uppercase tracking-wider leading-tight line-clamp-2">
                {item.metricLabel}
              </div>
              <div className="font-body text-xs text-white/30 mt-2 truncate">{item.name}</div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-white/40 mb-6">
            Join 140+ companies that chose growth over guesswork.
          </p>
          <button
            onClick={() => {
              track('testimonials_cta_click')
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="btn-primary"
          >
            Get Results Like These
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
