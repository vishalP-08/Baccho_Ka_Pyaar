import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addWish, subscribeWishCount } from '../services/firestore'

let floatId = 0

export default function HeartWishes() {
  const [count, setCount] = useState(0)
  const [floaters, setFloaters] = useState([])
  const [pop, setPop] = useState(false)
  const localPending = useRef(0)

  // Live subscription to the global wish counter.
  useEffect(() => {
    const unsub = subscribeWishCount((value) => {
      // Ignore stale server values while our optimistic clicks settle.
      setCount((prev) => Math.max(prev, value))
      localPending.current = 0
    })
    return unsub
  }, [])

  const handleClick = async () => {
    // Optimistic UI — bump instantly, reconcile via subscription.
    setCount((c) => c + 1)
    localPending.current += 1
    setPop(true)
    setTimeout(() => setPop(false), 400)

    // Spawn a few floating hearts.
    const burst = Array.from({ length: 5 }).map(() => ({
      id: ++floatId,
      x: (Math.random() - 0.5) * 160,
      delay: Math.random() * 0.2,
      scale: 0.7 + Math.random() * 0.8,
    }))
    setFloaters((f) => [...f, ...burst])
    setTimeout(
      () =>
        setFloaters((f) => f.filter((h) => !burst.some((b) => b.id === h.id))),
      2200,
    )

    try {
      await addWish()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Could not record wish:', err)
    }
  }

  return (
    <section
      id="wishes"
      className="section-pad relative flex flex-col items-center text-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-3xl font-700 text-white md:text-5xl"
      >
        Send Your Best Wishes to{' '}
        <span className="text-gradient">Fellow Mariners</span>
      </motion.h2>
      <p className="mt-4 max-w-md text-slate-300">
        One tap = one wish. Light up the ocean of support for every aspirant
        sailing into IMU-CET 2026.
      </p>

      <div className="relative mt-14 flex flex-col items-center">
        {/* Floating hearts */}
        <AnimatePresence>
          {floaters.map((h) => (
            <motion.span
              key={h.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -220, scale: h.scale }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, delay: h.delay, ease: 'easeOut' }}
              style={{ left: `calc(50% + ${h.x}px)` }}
              className="pointer-events-none absolute bottom-24 text-3xl"
            >
              ❤️
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.85 }}
          aria-label="Send a wish"
          className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/30 to-ocean-500/20 text-6xl shadow-[0_0_60px_rgba(244,63,94,0.5)] transition-shadow duration-300 hover:shadow-[0_0_90px_rgba(244,63,94,0.8)]"
        >
          <span
            className="absolute inset-0 animate-ping rounded-full bg-rose-500/20"
            aria-hidden
          />
          <motion.span
            animate={pop ? { scale: [1, 1.35, 0.95, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="animate-heartBeat"
          >
            ❤️
          </motion.span>
        </motion.button>

        <div className="mt-10 glass rounded-2xl px-8 py-5">
          <p className="text-xs font-600 uppercase tracking-[0.3em] text-ocean-400">
            Total wishes sent
          </p>
          <motion.p
            key={count}
            initial={{ scale: 1.15, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.35 }}
            className="font-display text-5xl font-700 text-white"
          >
            {count.toLocaleString()}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
