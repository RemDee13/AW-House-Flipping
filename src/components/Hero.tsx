import { useEffect, useRef, useState } from 'react'
import { HOTSPOTS } from '../data/hotspots'
import InfoPanel from './InfoPanel'

const BASE = import.meta.env.BASE_URL
const SPOTLIGHT_R = 300 // px radius of the reveal hole
const IMG_W = 2752
const IMG_H = 1536 // natural size of new.jpg / old.mp4 frame (16:9)

/** Map an image fraction (0..1) to a viewport pixel position under object-cover. */
function coverPos(fx: number, fy: number, w: number, h: number) {
  const scale = Math.max(w / IMG_W, h / IMG_H)
  const dispW = IMG_W * scale
  const dispH = IMG_H * scale
  const offX = (w - dispW) / 2
  const offY = (h - dispH) / 2
  return { x: offX + fx * dispW, y: offY + fy * dispH }
}

export default function Hero() {
  const maskRef = useRef<HTMLImageElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const [hideHint, setHideHint] = useState(false)
  const [vp, setVp] = useState({ w: 1280, h: 720 })
  const [active, setActive] = useState<string | null>(null)

  // viewport size (for hotspot positioning)
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // close panel on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // spotlight reveal
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

      {/* scrims: dark top (nav/heading) + dark bottom gradient + edge vignette */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%), ' +
            'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.62) 16%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0) 62%)',
        }}
      />
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.5)' }}
      />

      {/* HOTSPOTS — small pulsing amber dots over the house (above text so they stay clickable) */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {HOTSPOTS.map((h) => {
          const p = coverPos(h.x, h.y, vp.w, vp.h)
          const isOn = active === h.id
          return (
            <button
              key={h.id}
              onClick={() => setActive((a) => (a === h.id ? null : h.id))}
              aria-label={`${h.label} — see what we repaired`}
              aria-pressed={isOn}
              className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
              style={{ left: p.x, top: p.y, width: 34, height: 34 }}
            >
              <span
                className={`hotspot-dot block rounded-full transition-all duration-200 ${isOn ? 'w-3.5 h-3.5 bg-white' : 'w-2.5 h-2.5 bg-[#f6b73c] group-hover:w-3.5 group-hover:h-3.5'}`}
                style={{ boxShadow: '0 0 10px 1px rgba(246,183,60,0.7)' }}
              />
              <span className="pointer-events-none absolute bottom-[130%] whitespace-nowrap rounded-md border border-white/15 bg-black/85 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {h.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* hero text overlays — fade to an "inspect mode" while a hotspot panel is open */}
      <div className={`transition-opacity duration-300 ${active ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* heading */}
      <div className="absolute top-[12%] left-0 right-0 z-[45] flex flex-col items-center text-center px-5 pointer-events-none">
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
        className="hero-anim hero-fade hidden sm:block absolute bottom-16 left-8 md:left-14 max-w-[260px] z-[45] pointer-events-none"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-sm text-white/85 leading-relaxed drop-shadow">
          Every house has a past. Drag across this one to see the storm-wrecked ruin we started with — then tap a dot.
        </p>
      </div>

      {/* bottom-right microcopy + CTA */}
      <div
        className="hero-anim hero-fade absolute bottom-12 sm:bottom-20 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[270px] z-[45] flex flex-col items-start gap-4 pointer-events-none"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow">
          Full-home flips — roof, windows, plumbing and curb appeal — rebuilt from the studs out.
        </p>
        <a
          href="#contact"
          className="pointer-events-auto bg-brand hover:bg-brand-dark text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-brand/30"
        >
          Start your flip
        </a>
      </div>

      {/* drag hint */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-[45] flex items-center gap-2 text-white/70 text-xs sm:text-sm pointer-events-none transition-opacity duration-500 ${hideHint ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="inline-block h-[1px] w-6 bg-white/40" />
        Drag across the house · tap a dot
        <span className="inline-block h-[1px] w-6 bg-white/40" />
      </div>
      </div>

      {/* info panel (right glass / mobile bottom-sheet) */}
      {active && <InfoPanel hotspot={HOTSPOTS.find((h) => h.id === active)!} onClose={() => setActive(null)} />}
    </section>
  )
}
