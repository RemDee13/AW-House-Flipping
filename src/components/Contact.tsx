import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const ENDPOINT = 'https://formspree.io/f/REPLACE_ME' // swap for a real Formspree id to enable live submit
const BASE = import.meta.env.BASE_URL

export default function Contact() {
  const [status, setStatus] = useState('')
  // construction background video — off under reduced-motion
  const [bgVideo, setBgVideo] = useState(true)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setBgVideo(false)
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (ENDPOINT.includes('REPLACE_ME')) {
      const body =
        `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n` +
        `Property: ${data.get('property') || ''}\n\n${data.get('message') || ''}`
      window.location.href =
        'mailto:hello@ashwoodrevival.example?subject=Estimate%20request&body=' + encodeURIComponent(body)
      setStatus('Opening your email app…')
      return
    }
    setStatus('Sending…')
    fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then((r) => {
        if (r.ok) { form.reset(); setStatus('Thanks — we’ll be in touch within one business day.') }
        else setStatus('Something went wrong. Email hello@ashwoodrevival.example.')
      })
      .catch(() => setStatus('Network error — please email us directly.'))
  }

  const field = 'w-full bg-white/[0.04] border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand transition-colors'

  return (
    <section id="contact" className="relative overflow-hidden bg-black">
      {/* construction background video (drop public/reno-bg.mp4; section stays black until then) */}
      {bgVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          src={`${BASE}reno-bg.mp4`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
        />
      )}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-14">
        <div className="reveal-up">
          <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Get an estimate</p>
          <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">
            Tell us about<br />the house
          </h2>
          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
            Send the address and a few photos and we’ll come back with a scope and a number. (Demo form —
            wire it to your own inbox before going live.)
          </p>
          <div className="mt-8 space-y-3 text-white/80">
            <div className="flex items-center gap-3"><Mail size={18} className="text-brand" /> hello@ashwoodrevival.example</div>
            <div className="flex items-center gap-3"><Phone size={18} className="text-brand" /> (555) 014-2278</div>
            <div className="flex items-center gap-3"><MapPin size={18} className="text-brand" /> Pacific Northwest, USA</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="reveal-up space-y-4" action={ENDPOINT} method="POST">
          <div>
            <label htmlFor="cf-name" className="block text-xs uppercase tracking-[0.12em] text-white/45 mb-2">Name</label>
            <input id="cf-name" name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor="cf-email" className="block text-xs uppercase tracking-[0.12em] text-white/45 mb-2">Email</label>
            <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor="cf-prop" className="block text-xs uppercase tracking-[0.12em] text-white/45 mb-2">Property address</label>
            <input id="cf-prop" name="property" type="text" className={field} />
          </div>
          <div>
            <label htmlFor="cf-msg" className="block text-xs uppercase tracking-[0.12em] text-white/45 mb-2">What needs work?</label>
            <textarea id="cf-msg" name="message" required rows={4} className={field + ' resize-y'} />
          </div>
          <button type="submit" className="bg-brand hover:bg-brand-dark text-white font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-95">
            Request estimate
          </button>
          <p className="text-sm text-[#3fb68b] min-h-[1.2em]" role="status">{status}</p>
        </form>
      </div>
    </section>
  )
}
