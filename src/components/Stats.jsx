import { motion } from 'framer-motion'
import useCountUp from '../hooks/useCountUp'

function StatCard({ end, suffix, label, delay }) {
  const [value, ref] = useCountUp(end)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center"
    >
      <p className="font-display text-4xl font-800 text-ocean-400 sm:text-5xl">
        {value.toLocaleString()}
        <span>{suffix}</span>
      </p>
      <p className="mt-2 max-w-[10rem] text-sm font-600 text-slate-200 sm:text-base">
        {label}
      </p>
    </motion.div>
  )
}

const STATS = [
  { end: 5, suffix: '+', label: 'Years of Experience' },
  { end: 3000, suffix: '+', label: 'Students Trained' },
  { end: 2500, suffix: '+', label: 'Students Selected' },
  { end: 100000, suffix: '+', label: 'Merchant Navy Aspirants Community' },
]

export default function Stats() {
  return (
    <section className="px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-stats-gradient p-10 md:p-14">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-display text-2xl font-800 text-white md:text-4xl"
        >
          Trusted by the <span className="text-gradient">merchant navy community</span>
        </motion.h2>

        <div className="mt-12 grid grid-cols-2 gap-y-12 gap-x-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              end={s.end}
              suffix={s.suffix}
              label={s.label}
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
