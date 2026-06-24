const BASE = import.meta.env.BASE_URL

export default function Story() {
  return (
    <section id="about" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* text */}
        <div className="reveal-up">
          <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Our story</p>
          <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">
            Old bones,<br />
            <span className="italic">new life.</span>
          </h2>
          <div className="mt-7 space-y-5 text-lg text-white/65 leading-relaxed max-w-md">
            <p>
              Ashwood Revival exists to prove a simple idea: almost any house is worth saving. We take on the
              homes everyone else drives past — the leaking roofs, the boarded windows, the yards gone to weeds —
              and bring them all the way back to life.
            </p>
            <p>
              Every flip is run by one accountable crew with a fixed scope and a real timeline, so the work behind
              the walls is as honest as the finish in front of them.
            </p>
          </div>
        </div>

        {/* construction photo (drop public/reno-interior.jpg; graceful placeholder until then) */}
        <div className="reveal-up relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-gradient-to-br from-[#1c1f24] to-[#0d0e11]">
          <span className="absolute inset-0 grid place-items-center text-white/20 text-sm tracking-wide">
            Construction photo
          </span>
          <img
            src={`${BASE}reno-interior.jpg`}
            alt="Ashwood Revival crew renovating a house down to the studs"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 -80px 90px -40px rgba(0,0,0,0.7)' }} />
        </div>
      </div>
    </section>
  )
}
