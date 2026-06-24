import { useEffect, useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL
const SPOTLIGHT_R = 230 // px radius of the reveal hole

/**
 * Full-screen hero.
 *  - BOTTOM layer (z-10): OLD house — looping rainy video, always playing.
 *  - TOP layer   (z-20): NEW house — static photo, masked with a soft transparent
 *    hole that follows the cursor, so the old house shows through under the spotlight.
 * The cursor position is smoothed with rAF + lerp; on coarse pointers it auto-drifts.
 */
export default function Hero() {
  const maskRef = useRef<HTMLImageElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const [hideHint, setHideHint] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    smooth.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.55 }
    mouse.current = { ...smooth.current }

    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      setHideHint(true)
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    const apply = (x: number, y: number) => {
      const el = maskRef.current
      if (!el) return
      const g = `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, transparent 0, transparent 40%, rgba(0,0,0,0.55) 62%, #000 82%)`
      el.style.webkitMaskImage = g
      el.style.maskImage = g
    }
    apply(smooth.current.x, smooth.current.y)

    const t0 = performance.now()
    const tick = (t: number) => {
      if (!fine || reduced) {
        const cx = window.innerWidth / 2
        const cy = window.innerHeight * 0.55
        const r = Math.min(window.innerWidth, window.innerHeight) * 0.22
        const tt = (t - t0) * 0.0004
        mouse.current = { x: cx + Math.cos(tt) * r, y: cy + Math.sin(tt) * r * 0.7 }
      }
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.12
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.12
      apply(smooth.current.x, smooth.current.y)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {/* BOTTOM — OLD house, rainy video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-10"
        src={`${BASE}old.mp4`}
        poster={`${BASE}old-poster.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* TOP — NEW house, masked with the spotlight hole */}
      <img
        ref={maskRef}
        className="absolute inset-0 w-full h-full object-cover z-20 select-none"
        src={`${BASE}new.jpg`}
        alt="The renovated house"
        draggable={false}
      />

      {/* edge vignette for text legibility */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.55)' }}
      />

      {/* heading */}
      <div className="absolute top-[12%] left-0 right-0 z-40 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 className="text-white leading-[0.95] drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: '-0.04em', animationDelay: '0.25s' }}
          >
            We rebuild
          </span>
          <span
            className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ letterSpacing: '-0.06em', animationDelay: '0.42s' }}
          >
            what time forgot
          </span>
        </h1>
      </div>

      {/* bottom-left microcopy */}
      <div
        className="hero-anim hero-fade hidden sm:block absolute bottom-16 left-8 md:left-14 max-w-[260px] z-40"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-sm text-white/85 leading-relaxed drop-shadow">
          Every house has a past. Drag across this one to see the storm-wrecked ruin we started with.
        </p>
      </div>

      {/* bottom-right microcopy + CTA */}
      <div
        className="hero-anim hero-fade absolute bottom-12 sm:bottom-20 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[270px] z-40 flex flex-col items-start gap-4"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow">
          Full-home flips — roof, windows, plumbing and curb appeal — rebuilt from the studs out.
        </p>
        <a
          href="#contact"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-brand/30"
        >
          Start your flip
        </a>
      </div>

      {/* drag hint */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 text-white/70 text-xs sm:text-sm pointer-events-none transition-opacity duration-500 ${hideHint ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="inline-block h-[1px] w-6 bg-white/40" />
        Drag across the house
        <span className="inline-block h-[1px] w-6 bg-white/40" />
      </div>
    </section>
  )
}
