export default function Story() {
  return (
    <section id="about" className="bg-black">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-7 reveal-up">
          <p className="text-xs tracking-[0.28em] uppercase text-brand mb-6">Our story</p>
          <h2 className="font-playfair text-4xl md:text-6xl leading-[1.04]">
            Old bones,<br />
            <span className="italic">new life.</span>
          </h2>
        </div>
        <div className="md:col-span-5 md:pt-4 reveal-up space-y-5 text-lg text-white/65 leading-relaxed">
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
    </section>
  )
}
