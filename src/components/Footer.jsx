import { motion } from 'framer-motion'

const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.25 3.6z" />
  </svg>
)

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.5.01-4.74.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.23-.07 1.6-.07 4.74s.01 3.51.07 4.74c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.23.06 1.6.07 4.74.07s3.51-.01 4.74-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.23.07-1.6.07-4.74s-.01-3.51-.07-4.74c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.23-.06-1.6-.07-4.74-.07zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96zm0 8.21a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46zm6.34-8.41a1.16 1.16 0 1 1-2.33 0 1.16 1.16 0 0 1 2.33 0z" />
  </svg>
)

const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M21.94 4.3 18.6 19.06c-.25 1.1-.92 1.37-1.86.86l-5.12-3.77-2.47 2.38c-.27.27-.5.5-1.03.5l.37-5.2 9.48-8.57c.41-.36-.09-.57-.64-.2L5.55 12.6.5 11.02c-1.1-.34-1.12-1.1.23-1.62L20.5 2.67c.92-.34 1.72.2 1.44 1.63z" />
  </svg>
)

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@BuddingMariners',
    Icon: YouTubeIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bmonlineacademy?igsh=MXd1a2RoYnZyYmVxcA==',
    Icon: InstagramIcon,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/MerchantNavyBM',
    Icon: TelegramIcon,
  },
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
                src="https://storebybm.com/cdn/shop/files/66616e0050ff99708325d1d7.png?v=1740412439&width=140"
                alt="Budding Mariners"
                className="h-12 w-auto"
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
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition-all duration-200 hover:border-ocean-400/50 hover:bg-ocean-400 hover:text-black hover:shadow-[0_0_18px_rgba(242,201,76,0.4)]"
                >
                  <Icon className="h-5 w-5" />
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
