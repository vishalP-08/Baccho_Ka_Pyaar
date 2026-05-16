import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Ambient ocean background: a soft radial glow, slowly drifting
 * "bubble" particles, and layered animated waves at the bottom.
 * Purely decorative — pointer-events are disabled.
 */
export default function ParticlesBackground() {
  // Pre-compute particle positions once so they stay stable across renders.
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        size: 4 + Math.random() * 14,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 14,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ocean-gradient">
      {/* Top glow */}
      <div className="absolute inset-0 bg-glow-radial" />

      {/* Drifting particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-ocean-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: -40,
            opacity: p.opacity,
            filter: 'blur(1px)',
          }}
          animate={{ y: [0, -1100], opacity: [0, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Layered waves */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <div className="wave-strip absolute inset-0 animate-wave opacity-60" />
        <div
          className="wave-strip absolute inset-0 animate-wave opacity-40"
          style={{ animationDuration: '18s', animationDirection: 'reverse' }}
        />
      </div>
    </div>
  )
}
