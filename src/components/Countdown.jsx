import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// IMU-CET 2026 target date. Adjust here if the official date changes.
const EXAM_DATE = new Date('2026-06-06T10:00:00+05:30')

function getRemaining() {
  const diff = Math.max(0, EXAM_DATE.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    over: diff === 0,
  }
}

export default function Countdown() {
  const [time, setTime] = useState(getRemaining)

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = useMemo(
    () => [
      { label: 'Days', value: time.days },
      { label: 'Hours', value: time.hours },
      { label: 'Minutes', value: time.minutes },
      { label: 'Seconds', value: time.seconds },
    ],
    [time],
  )

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-4 text-xs font-600 uppercase tracking-[0.35em] text-slate-400">
        {time.over ? 'All the very best, cadets!' : 'IMU-CET 2026 begins in'}
      </p>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="glass flex flex-col items-center rounded-2xl py-4"
          >
            <motion.span
              key={u.value}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="font-display text-3xl font-700 text-white sm:text-4xl"
            >
              {String(u.value).padStart(2, '0')}
            </motion.span>
            <span className="mt-1 text-[10px] font-600 uppercase tracking-widest text-ocean-400 sm:text-xs">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
