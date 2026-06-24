import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = ['Work', 'Process', 'About', 'Contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="hero-anim hero-fade-down fixed top-7 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6 py-2"
      style={{ animationDelay: '0.1s' }}
    >
      {/* logo */}
      <a href="#top" className="flex items-center gap-2.5">
        <svg width="26" height="26" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M32 12 L54 36 H46 V52 H18 V36 H10 Z" stroke="#fff" strokeWidth="3.4" strokeLinejoin="round" />
          <path d="M27 52 V40 H37 V52" stroke="#e8702a" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">Ashwood</span>
      </a>

      {/* center pill */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1">
        {LINKS.map((l, i) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className={
              i === 0
                ? 'bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium'
                : 'text-white/80 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium'
            }
          >
            {l}
          </a>
        ))}
      </div>

      {/* right CTA */}
      <a
        href="#contact"
        className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        Get an Estimate
      </a>

      {/* mobile toggle */}
      <button className="md:hidden text-white p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="md:hidden absolute top-full right-4 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white/85 text-sm" onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <a href="#contact" className="bg-brand hover:bg-brand-dark text-white text-sm text-center px-4 py-2 rounded-full transition-colors" onClick={() => setOpen(false)}>
            Get an Estimate
          </a>
        </div>
      )}
    </nav>
  )
}
