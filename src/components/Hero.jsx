import { motion } from 'framer-motion'
import Countdown from './Countdown'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-block rounded-full glass px-5 py-2 text-xs font-600 uppercase tracking-[0.35em] text-ocean-400"
        >
          IMU-CET 2026 · Special Wishes
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-4xl font-700 leading-tight text-white sm:text-5xl md:text-7xl"
        >
          <span className="mr-2 inline-block animate-float">⚓</span>
          Best of Luck{' '}
          <span className="text-gradient">Future Mariners!</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
        >
          Budding Mariners wishes every aspirant success in the{' '}
          <span className="font-700 text-ocean-400">IMU-CET 2026</span>{' '}
          Examination. Your voyage to the merchant navy begins here.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href="#register" className="btn-glow animate-glowPulse">
            Register for Free Mock 🚀
          </a>
          <a
            href="#mock-tests"
            className="rounded-full border border-white/15 px-8 py-4 font-600 text-slate-200 transition-all duration-200 hover:border-ocean-400/50 hover:text-ocean-400"
          >
            View Test Dates
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-16">
          <Countdown />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.4, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 text-2xl text-ocean-400/70"
        aria-hidden
      >
        ⌄
      </motion.div>
    </section>
  )
}
