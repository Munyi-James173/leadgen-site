import { useEffect, useRef } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

export default function Hero() {
  const { track } = useAnalytics()
  const canvasRef = useRef(null)

  useEffect(() => {
    track('page_view', { section: 'hero' })
  }, [])

  // Particle grid background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = []
    const cols = 20
    const rows = 12
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: (i / (cols - 1)) * canvas.offsetWidth,
          y: (j / (rows - 1)) * canvas.offsetHeight,
          offset: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6,
        })
      }
    }

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      t += 0.008
      dots.forEach((d) => {
        const pulse = Math.sin(t * d.speed + d.offset)
        const alpha = 0.06 + pulse * 0.06
        const r = 1 + pulse * 0.5
        ctx.beginPath()
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,255,0,${alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleCTA = (label) => {
    track('hero_cta_click', { button: label })
    if (label === 'primary') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-950 pt-16">
      {/* Canvas particle bg */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-acid/5 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-acid/3 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
        {/* Label */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-acid rounded-full animate-pulse" />
          <span className="font-mono text-xs text-white/60 uppercase tracking-widest">Now Taking New Clients</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8 animate-fade-up">
          <span className="text-white">Growth That</span>
          <br />
          <span className="gradient-text">Compounds.</span>
        </h1>

        {/* Subheadline */}
        <p className="font-body text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animation-delay-100 opacity-0-init">
          We partner with ambitious companies to architect digital systems that capture leads, convert visitors, and scale revenue—measurably.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-200 opacity-0-init">
          <button onClick={() => handleCTA('primary')} className="btn-primary text-sm py-4 px-10 shadow-[0_0_40px_rgba(200,255,0,0.2)]">
            Start Your Project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => handleCTA('secondary')} className="btn-outline text-sm py-4 px-10">
            See Our Work
          </button>
        </div>

        {/* Trust bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 animate-fade-up animation-delay-400 opacity-0-init">
          {[
            { value: '3.2×', label: 'Avg. ROI Increase' },
            { value: '94%', label: 'Client Retention' },
            { value: '140+', label: 'Projects Delivered' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-3xl text-acid">{stat.value}</div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse_slow">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">Scroll</span>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-white/20">
          <path d="M8 1V15M4 11L8 15L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
