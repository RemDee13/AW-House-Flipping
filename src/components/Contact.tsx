import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

// Web3Forms — paste the access key from web3forms.com to start receiving submissions.
const ACCESS_KEY = 'b1bdae2d-bc38-41e1-a070-6637a6b0d3a8'
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const FALLBACK_EMAIL = 'hello@ashwoodrevival.example'
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

    // until a real key is set, fall back to opening the visitor's email app
    if (ACCESS_KEY.startsWith('YOUR_')) {
      const body =
        `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n` +
        `Property: ${data.get('property') || ''}\n\n${data.get('message') || ''}`
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=Estimate%20request&body=` + encodeURIComponent(body)
      setStatus('Opening your email app…')
      return
    }

    setStatus('Sending…')
    fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) { form.reset(); setStatus('Thanks — we’ll be in touch within one business day.') }
        else setStatus('Something went wrong. Please email us directly.')
      })
      .catch(() => setStatus('Network error — please try again.'))
  }

  const field = 'w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand transition-colors'

  return (
    <section id="contact" className="relative overflow-hidden bg-black">
      {/* construction background video (drop public/reno-bg.mp4; section stays black until then) */}
      {bgVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-65"
          src={`${BASE}reno-bg.mp4`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none' }}
        />
      )}
      {/* lighter darkening — keep the video visible, just enough contrast for the text/form */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-14">
        <div className="reveal-up">
          <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Get an estimate</p>
          <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">
            Tell us about<br />the house
          </h2>
          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
            Send the address and a few photos and we’ll come back with a scope and a number — usually within
            one business day.
          </p>
          <div className="mt-8 space-y-3 text-white/80">
            <div className="flex items-center gap-3"><Mail size={18} className="text-brand" /> hello@ashwoodrevival.example</div>
            <div className="flex items-center gap-3"><Phone size={18} className="text-brand" /> (206) 555-0188</div>
            <div className="flex items-center gap-3"><MapPin size={18} className="text-brand" /> Pacific Northwest, USA</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="reveal-up space-y-4" action={WEB3FORMS_ENDPOINT} method="POST">
          {/* Web3Forms config */}
          <input type="hidden" name="access_key" value={ACCESS_KEY} />
          <input type="hidden" name="subject" value="New estimate request — Ashwood Revival" />
          <input type="hidden" name="from_name" value="Ashwood Revival website" />
          {/* honeypot */}
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="cf-name" className="block text-xs uppercase tracking-[0.12em] text-white/65 mb-2">Name</label>
            <input id="cf-name" name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor="cf-email" className="block text-xs uppercase tracking-[0.12em] text-white/65 mb-2">Email</label>
            <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor="cf-prop" className="block text-xs uppercase tracking-[0.12em] text-white/65 mb-2">Property address</label>
            <input id="cf-prop" name="property" type="text" className={field} />
          </div>
          <div>
            <label htmlFor="cf-msg" className="block text-xs uppercase tracking-[0.12em] text-white/65 mb-2">What needs work?</label>
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
