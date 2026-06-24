const MARQUEE = ['Restore', 'Renew', 'Revive', 'Rebuild', 'Reimagine']

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* marquee strip */}
      <div className="border-b border-white/10 py-5 overflow-hidden">
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max text-white/30 font-playfair text-2xl italic">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w}<span className="text-brand not-italic">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <a href="#top" className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path d="M32 12 L54 36 H46 V52 H18 V36 H10 Z" stroke="#fff" strokeWidth="3.4" strokeLinejoin="round" />
              <path d="M27 52 V40 H37 V52" stroke="#e8702a" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-2xl font-playfair italic">Ashwood Revival</span>
          </a>
          <ul className="flex gap-7 text-sm text-white/55">
            <li><a href="#work" className="hover:text-white transition-colors">Work</a></li>
            <li><a href="#process" className="hover:text-white transition-colors">Process</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/45">
          <span>
            Made by <strong className="text-white/80">Pavlov Anton</strong> ·{' '}
            <a href="https://pavlov-ai.online" target="_blank" rel="noopener" className="text-brand hover:underline">pavlov-ai.online</a>
          </span>
          <span>© {year} Ashwood Revival — fictional company, portfolio demo.</span>
        </div>
      </div>

      {/* giant cropped wordmark */}
      <div className="select-none pointer-events-none w-full text-center font-playfair font-semibold tracking-tight leading-[0.7] text-white/[0.05] whitespace-nowrap text-[24vw] -mb-[3.5vw]">
        ASHWOOD
      </div>
    </footer>
  )
}
