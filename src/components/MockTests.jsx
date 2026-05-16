import { motion } from 'framer-motion'

const DATES = [
  { day: '18th', tag: 'Mock Test 1', note: 'Full-length simulation' },
  { day: '20th', tag: 'Mock Test 2', note: 'Sectional + analysis' },
  { day: '22nd', tag: 'Mock Test 3', note: 'Final confidence run' },
]

const fade = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
}

export default function MockTests() {
  return (
    <section id="mock-tests" className="section-pad relative">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-700 text-white md:text-5xl"
        >
          🎯 <span className="text-gradient">FREE Mock Tests</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-xl text-slate-300"
        >
          Three carefully crafted mock tests to sharpen your speed, accuracy
          and exam temperament — completely free for every aspirant.
        </motion.p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {DATES.map((d, i) => (
            <motion.div
              key={d.day}
              custom={i}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="glass group relative overflow-hidden rounded-3xl p-8"
            >
              <div className="absolute -right-8 -top-8 text-7xl opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                ⛵
              </div>
              <p className="text-xs font-600 uppercase tracking-[0.3em] text-ocean-400">
                {d.tag}
              </p>
              <p className="mt-3 font-display text-6xl font-700 text-white">
                {d.day}
              </p>
              <p className="mt-3 text-sm text-slate-400">{d.note}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-ocean-400/40 to-transparent" />
              <a
                href="#register"
                className="mt-5 inline-block text-sm font-600 text-ocean-400 transition-colors hover:text-gold-400"
              >
                Reserve my seat →
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 font-display text-2xl font-600 italic text-slate-200 md:text-3xl"
        >
          “Practice like a cadet. Perform like an officer.”
        </motion.p>
      </div>
    </section>
  )
}
