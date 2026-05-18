import { AnimatePresence, motion } from 'framer-motion'

export default function SuccessPopup({ open, name, pdf, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="glass-strong relative w-full max-w-md rounded-3xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ocean-500/15 text-5xl"
            >
              ⚓
            </motion.div>
            <h3 className="mt-6 font-display text-3xl font-700 text-white">
              You&apos;re aboard{name ? `, ${name.split(' ')[0]}` : ''}! 🎉
            </h3>
            <p className="mt-3 text-slate-300">
              Your registration for the FREE IMU-CET mock tests is confirmed.
              Smooth seas and full sails — we&apos;ll see you on the 20th
              &amp; 22nd!
            </p>

            {pdf && pdf.downloadUrl ? (
              <div className="mt-6 rounded-2xl border border-ocean-400/25 bg-ocean-400/[0.06] p-5">
                <p className="text-sm text-slate-200">
                  📄 Your personalised <strong>test timetable</strong> is
                  downloading. If it didn&apos;t start automatically, use the
                  buttons below.
                </p>
                <a
                  href={pdf.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow mt-4 w-full"
                >
                  ⬇ Download Timetable (PDF)
                </a>
                {pdf.viewUrl && (
                  <a
                    href={pdf.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-600 text-ocean-400 underline-offset-4 hover:underline"
                  >
                    or open it online
                  </a>
                )}
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="btn-glow mt-6 w-full"
            >
              Set Sail ⛵
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
