import { motion } from 'framer-motion'

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@BuddingMariners',
    icon: '▶️',
  },
  { label: 'Telegram', href: 'https://t.me/MerchantNavyBM', icon: '✈️' },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bmonlineacademy?igsh=MXd1a2RoYnZyYmVxcA==',
    icon: '📸',
  },
  { label: 'Website', href: 'https://www.buddingmariners.com/', icon: '🌐' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export default function Footer() {
  return (
    <footer id="contact" className="relative mt-10">
      <div className="wave-strip h-24 w-full opacity-60" aria-hidden />
      <div className="glass-strong border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-12">
          {/* Brand */}
          <motion.div {...fade(0)}>
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Budding Mariners"
                className="h-12 w-12 rounded-full"
              />
              <span className="font-display text-xl font-800 uppercase tracking-wide text-white">
                Budding <span className="text-ocean-400">Mariners</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Personal mentorship. Industry-oriented training. Wishing every
              IMU-CET 2026 aspirant smooth seas and great success. ⚓
            </p>
            <a
              href="https://wa.me/917992199075"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ocean-400 px-5 py-2.5 text-sm font-700 text-black transition-all duration-200 hover:bg-gold-400 hover:shadow-[0_0_22px_rgba(242,201,76,0.5)]"
            >
              💬 Chat on WhatsApp
            </a>
          </motion.div>

          {/* Contact */}
          <motion.div {...fade(0.1)}>
            <h4 className="text-sm font-700 uppercase tracking-widest text-ocean-400">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>
                <a
                  href="mailto:buddingmarinersstore@gmail.com"
                  className="transition-colors hover:text-ocean-400"
                >
                  ✉️ buddingmarinersstore@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919120430530"
                  className="transition-colors hover:text-ocean-400"
                >
                  📞 +91 91204 30530
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917992199075"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ocean-400"
                >
                  💬 WhatsApp: +91 79921 99075
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/723obinbAD64rkv38?g_st=ac"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 leading-relaxed transition-colors hover:text-ocean-400"
                >
                  <span>📍</span>
                  <span>
                    Ground Floor, Garhwal Tower I, Arcadia Greens Rd, Vaishali
                    Estate, Jaipur, Rajasthan 302041
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div {...fade(0.2)}>
            <h4 className="text-sm font-700 uppercase tracking-widest text-ocean-400">
              Follow the voyage
            </h4>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-all duration-200 hover:border-ocean-400/50 hover:text-ocean-400 hover:shadow-[0_0_18px_rgba(242,201,76,0.3)]"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Budding Mariners · Wishing every IMU-CET
          2026 aspirant smooth seas and great success. ⚓
        </div>
      </div>
    </footer>
  )
}
