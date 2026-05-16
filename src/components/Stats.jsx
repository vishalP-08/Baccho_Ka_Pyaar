import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'

function StatCard({ end, suffix, label, icon, delay }) {
  const [value, ref] = useCountUp(end)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-10 text-center"
    >
      <span className="text-4xl">{icon}</span>
      <p className="mt-4 font-display text-5xl font-700 text-white">
        {value.toLocaleString()}
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-500 uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-3xl font-700 text-white md:text-5xl"
        >
          A legacy of <span className="text-gradient">proven results</span>
        </motion.h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <StatCard
            end={5000}
            suffix="+"
            label="Aspirants Guided"
            icon="🧭"
            delay={0}
          />
          <StatCard
            end={1000}
            suffix="+"
            label="Selections"
            icon="🎖️"
            delay={0.15}
          />
          <StatCard
            end={24}
            suffix="/7"
            label="Support"
            icon="📞"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  )
}
