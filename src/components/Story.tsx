const BASE = import.meta.env.BASE_URL

const PHOTOS = [
  { src: `${BASE}reno-interior.jpg`, alt: 'Ashwood Revival carpenter measuring inside a house gutted to the studs', caption: 'Down to the studs' },
  { src: `${BASE}reno-exterior.jpg`, alt: 'A house mid-renovation — new roof, fresh siding over house wrap, scaffolding up', caption: 'Re-roofed & re-clad' },
]

const hide = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none' }

export default function Story() {
  return (
    <section id="about" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 reveal-up">
            <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Our story</p>
            <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">
              Old bones,<br />
              <span className="italic">new life.</span>
            </h2>
          </div>
          <div className="md:col-span-5 reveal-up space-y-5 text-lg text-white/65 leading-relaxed">
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

        {/* real construction photos */}
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {PHOTOS.map((p) => (
            <figure
              key={p.src}
              className="reveal-up relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-gradient-to-br from-[#1c1f24] to-[#0d0e11]"
            >
              <img src={p.src} alt={p.alt} loading="lazy" onError={hide} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 -70px 80px -34px rgba(0,0,0,0.85)' }} />
              <figcaption className="absolute bottom-3.5 left-4 text-sm font-medium text-white/95 drop-shadow">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
