import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'Mock Tests', href: '#mock-tests' },
  { label: 'Register', href: '#register' },
  { label: 'Wishes', href: '#wishes' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 md:px-8 ${
          scrolled ? 'glass-strong' : 'bg-transparent'
        }`}
      >
        <a href="#top" className="flex items-center gap-3">
          <img
            src="https://storebybm.com/cdn/shop/files/66616e0050ff99708325d1d7.png?v=1740412439&width=140"
            alt="Budding Mariners"
            className="h-11 w-auto"
          />
          <span className="font-display text-lg font-800 uppercase leading-none tracking-wide text-white md:text-xl">
            Budding{' '}
            <span className="text-ocean-400">Mariners</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-600 text-slate-300 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="transition-colors duration-200 hover:text-ocean-400"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#register"
          className="rounded-full bg-ocean-400 px-5 py-2 text-sm font-700 text-black transition-all duration-200 hover:bg-gold-400 hover:shadow-[0_0_22px_rgba(242,201,76,0.55)]"
        >
          Join Now
        </a>
      </nav>
    </motion.header>
  )
}
