import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-black tracking-[-0.02em]" style={{ fontFamily: 'Inter' }}>
      {/* portfolio ribbon — makes the demo framing explicit */}
      <div className="fixed top-0 left-0 right-0 z-[110] bg-black/70 backdrop-blur-md border-b border-white/10 text-center text-[11px] sm:text-xs text-white/65 py-1.5 px-4">
        <span className="text-white font-medium">Portfolio demo</span>
        <span className="mx-1.5 text-brand">•</span>
        fictional company
        <span className="mx-1.5 text-brand">•</span>
        built by <span className="text-white font-medium">Anton Pavlov</span>
      </div>

      <Navbar />
      <Hero />
    </div>
  )
}
