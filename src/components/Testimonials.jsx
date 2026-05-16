import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const QUOTES = [
  {
    text: 'The mock tests felt exactly like the real IMU-CET. Walking into the exam hall, I was calm because I had already sailed these waters.',
    name: 'Rohan Iyer',
    role: 'Selected · Marine Engineering',
  },
  {
    text: 'Budding Mariners did not just teach me concepts — they believed in me on the days I could not believe in myself.',
    name: 'Sneha Kulkarni',
    role: 'Selected · Nautical Science',
  },
  {
    text: 'From a confused aspirant to a confident cadet. The free mocks were the turning point of my entire preparation.',
    name: 'Aditya Verma',
    role: 'Selected · DNS Cadet',
  },
  {
    text: '24/7 support is not a tagline here. Someone always answered, even at 2 AM before my exam. That is family.',
    name: 'Priya Nair',
    role: 'Selected · Marine Engineering',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      5500,
    )
    return () => clearInterval(id)
  }, [])

  const active = QUOTES[index]

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-700 text-white md:text-5xl"
        >
          Voices of <span className="text-gradient">our cadets</span>
        </motion.h2>

        <div className="relative mt-12 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6 }}
              className="glass-strong mx-auto rounded-3xl p-10"
            >
              <div className="text-5xl text-ocean-400/40">“</div>
              <blockquote className="-mt-4 font-display text-xl font-500 italic leading-relaxed text-slate-100 md:text-2xl">
                {active.text}
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-600 text-white">{active.name}</p>
                <p className="text-sm text-ocean-400">{active.role}</p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-8 bg-ocean-400'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
