import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

const results = [
  { metric: '312%', label: 'Lead Volume Increase', client: 'SaaS Platform', detail: 'From 200 to 824 qualified leads/mo in 90 days' },
  { metric: '$2.4M', label: 'Pipeline Generated', client: 'B2B Services', detail: 'In 6 months from a dead CRM' },
  { metric: '0.8s', label: 'Load Time Achieved', client: 'E-commerce Brand', detail: 'Down from 4.2s—conversion up 41%' },
  { metric: '98', label: 'Lighthouse Score', client: 'Media Company', detail: 'Performance on mobile after rebuild' },
]

function AnimatedNumber({ target, suffix = '' }) {
  const [display, setDisplay] = useState('0')
  const { ref, inView } = useInView()
  const animated = useRef(false)

  useEffect(() => {
    if (!inView || animated.current) return
    animated.current = true

    const isFloat = target.includes('.')
    const raw = parseFloat(target.replace(/[^0-9.]/g, ''))
    const prefix = target.match(/^\$/) ? '$' : ''
    const unitSuffix = target.replace(/[\d.$]/g, '')

    let start = 0
    const duration = 1800
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = raw * ease

      if (isFloat) {
        setDisplay(`${prefix}${current.toFixed(1)}${unitSuffix}`)
      } else if (raw >= 1000) {
        setDisplay(`${prefix}${(current / 1000).toFixed(1)}M${unitSuffix}`)
      } else {
        setDisplay(`${prefix}${Math.round(current)}${unitSuffix}`)
      }

      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{display}</span>
}

export default function Results() {
  const { ref, inView } = useInView()

  return (
    <section id="results" className="py-28 bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-acid/3 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 mb-16 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="section-label">
            <span className="w-4 h-px bg-acid" />
            Proven Results
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight max-w-2xl">
            Numbers that tell
            <span className="gradient-text"> the real story.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((r, i) => (
            <ResultCard key={r.label} {...r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ResultCard({ metric, label, client, detail, index }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`glass-card p-8 relative overflow-hidden transition-all duration-500
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-acid/60 rounded-full" />
      <div className="font-display font-extrabold text-5xl text-acid mb-2 pl-4">
        <AnimatedNumber target={metric} />
      </div>
      <div className="font-display font-semibold text-xl text-white mb-1 pl-4">{label}</div>
      <div className="font-mono text-xs text-acid/60 uppercase tracking-wider mb-3 pl-4">{client}</div>
      <p className="font-body text-sm text-white/40 pl-4 border-t border-white/5 pt-3">{detail}</p>
    </div>
  )
}
