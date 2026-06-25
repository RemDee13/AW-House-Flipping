import { useEffect, useRef, useState } from 'react'
import { Hand } from 'lucide-react'
import { HOTSPOTS } from '../data/hotspots'
import type { Hotspot } from '../data/hotspots'
import InfoPanel from './InfoPanel'

const BASE = import.meta.env.BASE_URL
const IMG_W = 2752
const IMG_H = 1536 // natural size of new.jpg / old.mp4 frame (16:9)
const MOBILE = 768

const DESKTOP_R = 300
const MOBILE_R = 150 // spotlight radius on touch devices

/** Map an image fraction (0..1) to a viewport pixel position under object-cover (desktop). */
function coverPos(fx: number, fy: number, w: number, h: number) {
  const scale = Math.max(w / IMG_W, h / IMG_H)
  const dispW = IMG_W * scale
  const dispH = IMG_H * scale
  return { x: (w - dispW) / 2 + fx * dispW, y: (h - dispH) / 2 + fy * dispH }
}

function holeGradient(x: number, y: number, r: number) {
  return `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0, transparent 42%, rgba(0,0,0,0.6) 65%, #000 85%)`
}

export default function Hero() {
  const maskRef = useRef<HTMLImageElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const [vp, setVp] = useState({ w: 1280, h: 720 })
  const [coarse, setCoarse] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [hideHint, setHideHint] = useState(false)
  // load order: paint the renovated photo FIRST, then mount + fade in the old-house video
  const [imgLoaded, setImgLoaded] = useState(false)
  const [videoOn, setVideoOn] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  // touch devices use the mobile hero in BOTH orientations (don't flip on rotate)
  const isMobile = coarse || vp.w < MOBILE
  // stage = the photo at object-cover size for the current viewport (portrait → wider than
  // screen, swipe to pan; landscape → fills width, slight vertical crop). Keeps the image's
  // aspect so hotspot fractions stay exact.
  const scale = Math.max(vp.w / IMG_W, vp.h / IMG_H)
  const stageW = IMG_W * scale
  const stageH = IMG_H * scale

  // viewport size + pointer type — re-checked on resize and orientation change
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const update = () => { setVp({ w: window.innerWidth, h: window.innerHeight }); setCoarse(mq.matches) }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    mq.addEventListener?.('change', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      mq.removeEventListener?.('change', update)
    }
  }, [])

  // close panel on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // center the mobile pan on mount
  useEffect(() => {
    if (isMobile && scrollRef.current) scrollRef.current.scrollLeft = Math.max(0, (stageW - vp.w) / 2)
  }, [isMobile, stageW, vp.w])

  // a cached new.jpg can finish loading before React attaches onLoad → the event never fires.
  // Re-check the ref on mount / branch swap so imgLoaded still flips.
  useEffect(() => {
    const img = maskRef.current
    if (img && img.complete && img.naturalWidth > 0) setImgLoaded(true)
  }, [isMobile])

  // defer the old-house video until the renovated photo has painted (+ small delay) so the
  // site never opens on the broken house
  useEffect(() => {
    if (!imgLoaded) return
    const t = setTimeout(() => setVideoOn(true), 450)
    return () => clearTimeout(t)
  }, [imgLoaded])

  // DESKTOP — cursor-following spotlight. No hole until the mouse actually MOVES over the page
  // (so the site never opens on a stray black circle with no cursor under it), and the hole is
  // cleared whenever the cursor leaves the window.
  useEffect(() => {
    if (isMobile || !videoOn) return
    const el = maskRef.current
    if (!el) return
    const apply = (x: number, y: number) => {
      el.style.webkitMaskImage = holeGradient(x, y, DESKTOP_R)
      el.style.maskImage = holeGradient(x, y, DESKTOP_R)
    }
    const clear = () => { el.style.webkitMaskImage = 'none'; el.style.maskImage = 'none' }
    clear() // start clean: full renovated house, no spotlight until the user moves the cursor
    let tracking = false
    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.14
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.14
      apply(smooth.current.x, smooth.current.y)
      raf.current = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      setHideHint(true)
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!tracking) {
        tracking = true
        smooth.current = { x: e.clientX, y: e.clientY }
        apply(e.clientX, e.clientY)
        raf.current = requestAnimationFrame(tick)
      }
    }
    const stop = () => { tracking = false; cancelAnimationFrame(raf.current); clear() }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', stop) // cursor leaves the viewport
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', stop)
      window.removeEventListener('blur', stop)
      cancelAnimationFrame(raf.current)
    }
  }, [isMobile, videoOn])

  // MOBILE — reveal only under the finger (off by default) + pin to the tapped hotspot
  useEffect(() => {
    if (!isMobile) return
    const el = maskRef.current
    const stage = stageRef.current
    const setHole = (lx: number, ly: number) => {
      if (!el) return
      el.style.webkitMaskImage = holeGradient(lx, ly, MOBILE_R)
      el.style.maskImage = holeGradient(lx, ly, MOBILE_R)
    }
    const clear = () => { if (el) { el.style.webkitMaskImage = 'none'; el.style.maskImage = 'none' } }
    const pinActive = () => {
      const h = HOTSPOTS.find((x) => x.id === active)
      if (h) setHole(h.x * stageW, h.y * stageH); else clear()
    }
    pinActive() // default: clear, or pin to the open hotspot

    if (!stage) return
    let touching = false
    const at = (e: TouchEvent) => {
      const t = e.touches[0]
      const r = stage.getBoundingClientRect()
      setHole(t.clientX - r.left, t.clientY - r.top)
    }
    const onStart = (e: TouchEvent) => { touching = true; setHideHint(true); at(e) }
    const onMove = (e: TouchEvent) => { if (touching) at(e) }
    const onEnd = () => { touching = false; pinActive() }
    stage.addEventListener('touchstart', onStart, { passive: true })
    stage.addEventListener('touchmove', onMove, { passive: true })
    stage.addEventListener('touchend', onEnd, { passive: true })
    stage.addEventListener('touchcancel', onEnd, { passive: true })
    return () => {
      stage.removeEventListener('touchstart', onStart)
      stage.removeEventListener('touchmove', onMove)
      stage.removeEventListener('touchend', onEnd)
      stage.removeEventListener('touchcancel', onEnd)
    }
  }, [isMobile, active, stageW, stageH])

  const toggle = (id: string) => setActive((a) => (a === id ? null : id))

  const dot = (h: Hotspot, left: number, top: number) => {
    const isOn = active === h.id
    return (
      <button
        key={h.id}
        onClick={() => toggle(h.id)}
        aria-label={`${h.label} — see what we repaired`}
        aria-pressed={isOn}
        className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
        style={{ left, top, width: 40, height: 40 }}
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
  }

  return (
    <section className="sticky top-0 z-0 w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {isMobile ? (
        /* MOBILE — full-height photo, swipe left/right to pan; reveal under finger */
        <div
          ref={scrollRef}
          className="absolute inset-0 z-10 flex items-center overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ touchAction: 'pan-x' }}
        >
          <div ref={stageRef} className="relative shrink-0" style={{ width: stageW, height: stageH }}>
            {videoOn && (
              <video
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                src={`${BASE}old.mp4`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onLoadedData={() => setVideoReady(true)}
              />
            )}
            <img ref={maskRef} className="absolute inset-0 w-full h-full object-cover select-none" src={`${BASE}new.jpg`} alt="The renovated house" draggable={false} decoding="async" onLoad={() => setImgLoaded(true)} />
            <div className="absolute inset-0 z-20">
              {HOTSPOTS.map((h) => dot(h, h.x * stageW, h.y * stageH))}
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP — full-bleed, cursor spotlight */
        <>
          {videoOn && (
            <video
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              src={`${BASE}old.mp4`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
            />
          )}
          <img ref={maskRef} className="absolute inset-0 w-full h-full object-cover z-20 select-none" src={`${BASE}new.jpg`} alt="The renovated house" draggable={false} decoding="async" onLoad={() => setImgLoaded(true)} />
          <div className="absolute inset-0 z-50 pointer-events-none">
            {HOTSPOTS.map((h) => {
              const p = coverPos(h.x, h.y, vp.w, vp.h)
              return dot(h, p.x, p.y)
            })}
          </div>
        </>
      )}

      {/* scrims */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%), ' +
            'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.62) 16%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0) 62%)',
        }}
      />
      <div className="absolute inset-0 z-30 pointer-events-none" style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.5)' }} />

      {/* hero text overlays — fade to "inspect mode" while a hotspot panel is open */}
      <div className={`transition-opacity duration-300 ${active ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* heading */}
        <div className="absolute top-[12%] left-0 right-0 z-[45] flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95] drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
            <span className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl" style={{ letterSpacing: '-0.04em', animationDelay: '0.25s' }}>We rebuild</span>
            <span className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1" style={{ letterSpacing: '-0.06em', animationDelay: '0.42s' }}>what time forgot</span>
          </h1>
        </div>

        {/* bottom-left microcopy (desktop) */}
        <div className="hero-anim hero-fade hidden sm:block absolute bottom-16 left-8 md:left-14 max-w-[260px] z-[45] pointer-events-none" style={{ animationDelay: '0.7s' }}>
          <p className="text-sm text-white/85 leading-relaxed drop-shadow">
            Every house has a past. Drag across this one to see the storm-wrecked ruin we started with — then tap a dot.
          </p>
        </div>

        {/* bottom-right microcopy + CTA */}
        <div className="hero-anim hero-fade absolute bottom-12 sm:bottom-20 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[270px] z-[45] flex flex-col items-start gap-4 pointer-events-none" style={{ animationDelay: '0.85s' }}>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed drop-shadow">
            Full-home flips — roof, windows, plumbing and curb appeal — rebuilt from the studs out.
          </p>
          <a href="#contact" className="pointer-events-auto bg-brand hover:bg-brand-dark text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-brand/30">Start your flip</a>
        </div>

        {/* interaction hint — desktop: bottom; mobile: center of screen */}
        <div
          className={`hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-[45] items-center gap-2 text-white/80 text-sm pointer-events-none transition-opacity duration-500 ${hideHint ? 'opacity-0' : 'opacity-100'}`}
        >
          <span className="inline-block h-[1px] w-6 bg-white/40" />
          Drag across the house · tap a dot
          <span className="inline-block h-[1px] w-6 bg-white/40" />
        </div>
        <div
          className={`sm:hidden absolute top-1/2 left-1/2 z-[45] pointer-events-none transition-opacity duration-500 ${hideHint ? 'opacity-0 -translate-x-1/2 -translate-y-1/2' : 'hint-pulse-center'}`}
        >
          <span className="flex items-center gap-2 rounded-full bg-black/45 backdrop-blur-md border border-white/20 px-4 py-2.5 text-white text-sm whitespace-nowrap shadow-lg">
            <Hand size={16} className="text-brand" />
            Touch &amp; swipe · tap a point
          </span>
        </div>
      </div>

      {/* info panel (liquid-glass: right panel on desktop, bottom sheet on mobile) —
          appears instantly on tap, then glides in over ~1.5s (see .panel-in in index.css) */}
      {active && <InfoPanel hotspot={HOTSPOTS.find((h) => h.id === active)!} onClose={() => setActive(null)} />}
    </section>
  )
}
