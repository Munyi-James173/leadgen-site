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

          {/* Navigation links */}
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

          {/* Contact details */}
          <div>
            <h4 className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Get In Touch</h4>
            <ul className="space-y-3">

              {/* Email */}
              <li className="flex items-center gap-2.5">
                <span className="text-acid shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 3.5L7 8L13 3.5M1 3.5H13V11H1V3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <a href="mailto:drlegumes80@gmail.com" className="font-body text-sm text-white/50 hover:text-acid transition-colors">
                  drlegumes80@gmail.com
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-2.5">
                <span className="text-acid shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2.5C2 2.5 3 1 4.5 1C5.5 1 6 2 6.5 3S7 5 6 5.5C5 6 5.5 7 6.5 8S8 9 8.5 8C9 7 10 7.5 11 8S13 9 13 10C13 11.5 11.5 13 10 13C5 13 1 8 1 4C1 2.5 2 2.5 2 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <a href="tel:+254 756 438 171" className="font-body text-sm text-white/50 hover:text-acid transition-colors">
                  +254 756 438 171
                </a>
              </li>
            </ul>

            {/* Social icons with proper SVGs */}
            <div className="flex gap-3 mt-5">

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('social_click', { platform: 'twitter' })}
                className="w-9 h-9 glass-card flex items-center justify-center text-white/40 hover:border-acid/40 hover:text-acid transition-all duration-200"
                aria-label="Twitter"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <path d="M0.5 0.5L5.1 7L0.5 12.5H1.6L5.6 7.7L8.9 12.5H12.5L7.6 5.6L11.9 0.5H10.8L7.1 5L4 0.5H0.5Z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('social_click', { platform: 'linkedin' })}
                className="w-9 h-9 glass-card flex items-center justify-center text-white/40 hover:border-acid/40 hover:text-acid transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <path d="M1.5 0C0.67 0 0 0.67 0 1.5V11.5C0 12.33 0.67 13 1.5 13H11.5C12.33 13 13 12.33 13 11.5V1.5C13 0.67 12.33 0 11.5 0H1.5ZM2.5 3.5C2.5 2.95 2.95 2.5 3.5 2.5C4.05 2.5 4.5 2.95 4.5 3.5C4.5 4.05 4.05 4.5 3.5 4.5C2.95 4.5 2.5 4.05 2.5 3.5ZM2.5 5.5H4.5V10.5H2.5V5.5ZM5.5 5.5H7.5V6.3C7.85 5.85 8.4 5.5 9.2 5.5C10.4 5.5 10.5 6.4 10.5 7.5V10.5H8.5V7.8C8.5 7.3 8.3 7 7.8 7C7.3 7 7 7.3 7 7.8V10.5H5.5V5.5Z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Munyi-James173"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('social_click', { platform: 'github' })}
                className="w-9 h-9 glass-card flex items-center justify-center text-white/40 hover:border-acid/40 hover:text-acid transition-all duration-200"
                aria-label="GitHub"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
                  <path d="M6.5 0C2.91 0 0 2.91 0 6.5C0 9.37 1.86 11.79 4.44 12.65C4.77 12.71 4.88 12.51 4.88 12.34C4.88 12.18 4.87 11.65 4.87 11.01C3.07 11.39 2.69 10.24 2.69 10.24C2.39 9.48 1.96 9.28 1.96 9.28C1.36 8.88 2.01 8.89 2.01 8.89C2.67 8.93 3.02 9.56 3.02 9.56C3.61 10.56 4.57 10.27 4.9 10.1C4.96 9.68 5.13 9.4 5.32 9.24C3.49 9.07 1.57 8.36 1.57 5.95C1.57 5.22 1.83 4.62 2.28 4.15C2.21 3.98 1.97 3.29 2.35 2.35C2.35 2.35 2.91 2.17 4.87 3.07C5.57 2.88 6.3 2.79 7.03 2.78C7.76 2.79 8.49 2.88 9.19 3.07C11.14 2.17 11.7 2.35 11.7 2.35C12.08 3.29 11.84 3.98 11.77 4.15C12.23 4.62 12.48 5.22 12.48 5.95C12.48 8.37 10.55 9.06 8.72 9.23C8.97 9.44 9.19 9.86 9.19 10.5C9.19 11.38 9.18 12.1 9.18 12.34C9.18 12.51 9.29 12.72 9.62 12.65C12.14 11.79 13 9.37 13 6.5C13 2.91 10.09 0 6.5 0Z"/>
                </svg>
              </a>
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
