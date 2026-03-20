import { useAnalytics } from '../hooks/useAnalytics'

export default function Footer() {
  const { track } = useAnalytics()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-950 border-t border-white/5 py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 bg-acid rounded-lg flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" fill="#0A0A0F" />
                </svg>
              </span>
              <span className="font-display font-bold text-lg text-white">APEX</span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
              We build high-performance digital products that turn visitors into revenue. Growth that compounds.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {['Services', 'Results', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => track('footer_link_click', { label: item })}
                    className="font-body text-sm text-white/50 hover:text-acid transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Get In Touch</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:hello@apexgrowth.io" className="font-body text-sm text-white/50 hover:text-acid transition-colors">
                  hello@apexgrowth.io
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="font-body text-sm text-white/50 hover:text-acid transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {['twitter', 'linkedin', 'github'].map((s) => (
                <a
                  key={s}
                  href={`https://${s}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('social_click', { platform: s })}
                  className="w-8 h-8 glass-card flex items-center justify-center hover:border-acid/40 transition-colors"
                  aria-label={s}
                >
                  <span className="font-mono text-xs text-white/40 capitalize">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/20">© {year} Apex Growth. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="font-mono text-xs text-white/20 hover:text-white/50 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
