import { useState } from 'react'
import { motion } from 'framer-motion'
import { saveRegistration } from '../services/firestore'
import SuccessPopup from './SuccessPopup'

const EMPTY = { fullName: '', mobile: '', rollNumber: '' }

function validate(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Please enter your full name'
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Name looks too short'
  }

  if (!values.mobile.trim()) {
    errors.mobile = 'Mobile number is required'
  } else if (!/^[6-9]\d{9}$/.test(values.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number'
  }

  if (!values.rollNumber.trim()) {
    errors.rollNumber = 'IMU-CET roll number is required'
  } else if (values.rollNumber.trim().length < 4) {
    errors.rollNumber = 'Roll number looks invalid'
  }

  return errors
}

const FIELDS = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'e.g. Arjun Mehta',
    icon: '👤',
    inputMode: 'text',
  },
  {
    name: 'mobile',
    label: 'Mobile Number',
    type: 'tel',
    placeholder: '10-digit mobile number',
    icon: '📱',
    inputMode: 'numeric',
    maxLength: 10,
  },
  {
    name: 'rollNumber',
    label: 'IMU-CET Roll Number',
    type: 'text',
    placeholder: 'e.g. IMU2026XXXX',
    icon: '🎫',
    inputMode: 'text',
  },
]

export default function RegistrationForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [popup, setPopup] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    const next =
      name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value
    const updated = { ...values, [name]: next }
    setValues(updated)
    if (touched[name]) setErrors(validate(updated))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = validate(values)
    setErrors(found)
    setTouched({ fullName: true, mobile: true, rollNumber: true })
    if (Object.keys(found).length > 0) return

    try {
      setSubmitting(true)
      await saveRegistration(values)
      setSubmittedName(values.fullName)
      setPopup(true)
      setValues(EMPTY)
      setTouched({})
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setServerError(
        'Something went wrong while registering. Please try again in a moment.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="register" className="section-pad relative">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        {/* Left — emotional copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-600 uppercase tracking-[0.35em] text-ocean-400">
            Reserve your seat
          </p>
          <h2 className="mt-4 font-display text-3xl font-700 text-white md:text-5xl">
            Your journey to the{' '}
            <span className="text-gradient">high seas</span> starts with one
            step.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-slate-300">
            Register once and unlock all three FREE mock tests. Every great
            officer was once a nervous aspirant who simply refused to give up.
            Today, that&apos;s you.
          </p>
          <ul className="mt-8 space-y-3 text-slate-300">
            {[
              '3 full-length mock tests — absolutely free',
              'Detailed performance analysis',
              'Guidance from experienced mariners',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="text-ocean-400">⚓</span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — the form */}
        <motion.form
          noValidate
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          <h3 className="font-display text-2xl font-700 text-white">
            Register Now
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Takes less than 30 seconds.
          </p>

          <div className="mt-8 space-y-5">
            {FIELDS.map((f) => {
              const showError = touched[f.name] && errors[f.name]
              return (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    className="mb-2 block text-sm font-500 text-slate-300"
                  >
                    {f.label}
                  </label>
                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-white/5 px-4 py-3 transition-all duration-200 ${
                      showError
                        ? 'border-rose-400/60 focus-within:border-rose-400'
                        : 'border-white/10 focus-within:border-ocean-400 focus-within:shadow-[0_0_18px_rgba(56,189,248,0.25)]'
                    }`}
                  >
                    <span className="select-none text-lg opacity-70">
                      {f.icon}
                    </span>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      inputMode={f.inputMode}
                      maxLength={f.maxLength}
                      placeholder={f.placeholder}
                      value={values[f.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(showError)}
                      className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  {showError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs font-500 text-rose-300"
                    >
                      {errors[f.name]}
                    </motion.p>
                  )}
                </div>
              )
            })}
          </div>

          {serverError && (
            <p className="mt-5 rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow mt-8 w-full"
          >
            {submitting ? 'Securing your seat…' : 'Register Now 🚀'}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            We respect your privacy. Details are used only for mock test
            coordination.
          </p>
        </motion.form>
      </div>

      <SuccessPopup
        open={popup}
        name={submittedName}
        onClose={() => setPopup(false)}
      />
    </section>
  )
}
