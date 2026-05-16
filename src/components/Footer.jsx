import { motion } from 'framer-motion'

const SOCIALS = [
  { label: 'Website', href: 'https://www.buddingmariners.com/', icon: '🌐' },
  { label: 'Instagram', href: '#', icon: '📸' },
  { label: 'YouTube', href: '#', icon: '▶️' },
  { label: 'Telegram', href: '#', icon: '✈️' },
]

export default function Footer() {
  return (
    <footer id="contact" className="relative mt-10">
      <div className="wave-strip h-24 w-full opacity-50" aria-hidden />
      <div className="glass-strong border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚓</span>
              <span className="font-display text-xl font-700 text-white">
                Budding Mariners Academy
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Guiding future officers of the merchant navy with mentorship,
              practice and unwavering belief. Fair winds, cadet. 🌊
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm font-600 uppercase tracking-widest text-ocean-400">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="mailto:info@buddingmariners.com"
                  className="transition-colors hover:text-ocean-400"
                >
                  ✉️ info@buddingmariners.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+910000000000"
                  className="transition-colors hover:text-ocean-400"
                >
                  📞 +91 00000 00000
                </a>
              </li>
              <li>🏢 Mumbai, Maharashtra, India</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm font-600 uppercase tracking-widest text-ocean-400">
              Follow the voyage
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-all duration-200 hover:border-ocean-400/50 hover:text-ocean-400 hover:shadow-[0_0_18px_rgba(56,189,248,0.3)]"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Budding Mariners Academy · Wishing every
          IMU-CET 2026 aspirant smooth seas and great success. ⚓
        </div>
      </div>
    </footer>
  )
}
