import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Story from './components/Story'
import Process from './components/Process'
import Quote from './components/Quote'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // smooth scrolling (Lenis), disabled under reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  // scroll-in reveals
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal-up'))
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.18 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div id="top" className="bg-black tracking-[-0.02em]" style={{ fontFamily: 'Inter' }}>
      {/* portfolio ribbon — makes the demo framing explicit */}
      <div className="fixed top-0 left-0 right-0 z-[110] bg-black/70 backdrop-blur-md border-b border-white/10 text-center text-[11px] sm:text-xs text-white/65 py-1.5 px-4">
        <span className="text-white font-medium">Portfolio demo</span>
        <span className="mx-1.5 text-brand">•</span>
        Not a real Company
        <span className="mx-1.5 text-brand">•</span>
        built by{' '}
        <a
          href="https://pavlov-ai.online"
          target="_blank"
          rel="noopener"
          className="text-white font-medium underline underline-offset-2 decoration-white/30 hover:text-brand hover:decoration-brand transition-colors"
        >
          Anton Pavlov
        </a>
      </div>

      <Navbar />
      <Hero />

      {/* dark curtain — these sections slide up over the pinned hero */}
      <div className="relative z-20 bg-black">
        <Stats />
        <Story />
        <Process />
        <Quote />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
