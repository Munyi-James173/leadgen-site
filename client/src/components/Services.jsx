import { useInView } from '../hooks/useInView'
import { useAnalytics } from '../hooks/useAnalytics'

const services = [
  {
    icon: '⚡',
    title: 'Conversion Architecture',
    desc: 'We engineer every touchpoint—from first click to signed contract—to maximize conversion rates and minimize drop-off.',
    tags: ['CRO', 'Funnel Design', 'A/B Testing'],
  },
  {
    icon: '🎯',
    title: 'Performance Marketing',
    desc: 'Targeted campaigns across paid search, social, and content channels tuned for cost-per-acquisition efficiency.',
    tags: ['PPC', 'Meta Ads', 'SEO'],
  },
  {
    icon: '🔧',
    title: 'Full-Stack Development',
    desc: 'Blazing-fast React frontends paired with robust Node.js backends—built to scale from day one.',
    tags: ['React', 'Node.js', 'Supabase'],
  },
  {
    icon: '📊',
    title: 'Analytics & Intelligence',
    desc: 'Real-time dashboards, cohort analysis, and automated alerts so you always know what\'s driving growth.',
    tags: ['Dashboards', 'Reports', 'Insights'],
  },
  {
    icon: '✉️',
    title: 'Email & Automation',
    desc: 'Behavioral email sequences that nurture leads on autopilot and re-engage dormant customers.',
    tags: ['Drip Flows', 'Segmentation', 'CRM'],
  },
  {
    icon: '🛡️',
    title: 'Brand Strategy',
    desc: 'Positioning, messaging, and visual identity that make you the obvious choice in a crowded market.',
    tags: ['Positioning', 'Messaging', 'Identity'],
  },
]

export default function Services() {
  const { ref, inView } = useInView()
  const { track } = useAnalytics()

  return (
    <section id="services" className="py-28 bg-ink-950 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-xl mb-16">
            <span className="section-label">
              <span className="w-4 h-px bg-acid" />
              What We Do
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
              Every service designed for one outcome:
              <span className="gradient-text"> your growth.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <ServiceCard key={svc.title} {...svc} delay={i * 80} onHover={() => track('service_hover', { title: svc.title })} />
          ))}
        </div>

        {/* Mid-page CTA */}
        <div className="mt-20 glass-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-acid/5 via-transparent to-acid/5 pointer-events-none" />
          <h3 className="font-display font-bold text-3xl text-white mb-3">Not sure where to start?</h3>
          <p className="font-body text-white/50 mb-8 max-w-lg mx-auto">Book a free 30-minute strategy call. We'll map out exactly what moves the needle for your business.</p>
          <button
            onClick={() => { track('mid_cta_click'); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn-primary"
          >
            Book Free Strategy Call
          </button>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon, title, desc, tags, delay, onHover }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      onMouseEnter={onHover}
      className={`glass-card p-7 group hover:border-acid/30 hover:bg-white/8 transition-all duration-300 cursor-default
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</div>
      <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
      <p className="font-body text-sm text-white/50 leading-relaxed mb-5">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="font-mono text-xs text-acid/70 bg-acid/10 rounded-full px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
