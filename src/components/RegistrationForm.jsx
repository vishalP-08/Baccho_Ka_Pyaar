import { useState } from 'react'
import { motion } from 'framer-motion'
import { saveRegistration } from '../services/firestore'
import SuccessPopup from './SuccessPopup'

const EMPTY = { fullName: '', mobile: '', email: '', rollNumber: '' }
const MAX_PHOTO_BYTES = 10 * 1024 * 1024 // 10 MB

/** Programmatically start a file download in a new tab. */
function startDownload(url) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function validate(values, photo, agree) {
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

  if (!values.email.trim()) {
    errors.email = 'Email is required (we email your timetable here)'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.rollNumber.trim()) {
    errors.rollNumber = 'IMU-CET roll number is required'
  } else if (values.rollNumber.trim().length < 4) {
    errors.rollNumber = 'Roll number looks invalid'
  }

  if (!photo) {
    errors.photo = 'Please upload your passport-size photo'
  } else {
    const isJpeg =
      photo.type === 'image/jpeg' || /\.jpe?g$/i.test(photo.name)
    if (!isJpeg) {
      errors.photo = 'Photo must be a JPEG (.jpg / .jpeg) file'
    } else if (photo.size > MAX_PHOTO_BYTES) {
      errors.photo = 'Photo must be less than 10 MB'
    }
  }

  if (!agree) {
    errors.agree = 'You must accept the terms & conditions'
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
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    icon: '✉️',
    inputMode: 'email',
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
  const [photo, setPhoto] = useState(null)
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [popup, setPopup] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [pdf, setPdf] = useState(null)
  const [serverError, setServerError] = useState('')

  const revalidate = (v = values, p = photo, a = agree) =>
    setErrors(validate(v, p, a))

  const handleChange = (e) => {
    const { name, value } = e.target
    const next =
      name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value
    const updated = { ...values, [name]: next }
    setValues(updated)
    if (touched[name]) revalidate(updated)
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    revalidate()
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0] || null
    setPhoto(file)
    setTouched((t) => ({ ...t, photo: true }))
    revalidate(values, file, agree)
  }

  const handleAgree = (e) => {
    const checked = e.target.checked
    setAgree(checked)
    setTouched((t) => ({ ...t, agree: true }))
    revalidate(values, photo, checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = validate(values, photo, agree)
    setErrors(found)
    setTouched({
      fullName: true,
      mobile: true,
      email: true,
      rollNumber: true,
      photo: true,
      agree: true,
    })
    if (Object.keys(found).length > 0) return

    try {
      setSubmitting(true)
      const result = await saveRegistration({ ...values, photo })
      setSubmittedName(values.fullName)
      setPdf(result?.pdf || null)
      if (result?.pdf?.downloadUrl) startDownload(result.pdf.downloadUrl)
      setPopup(true)
      setValues(EMPTY)
      setPhoto(null)
      setAgree(false)
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
      <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-2">
        {/* Left — copy + instructions */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-700 uppercase tracking-[0.35em] text-ocean-400">
            Reserve your seat
          </p>
          <h2 className="mt-4 font-display text-3xl font-800 text-white md:text-5xl">
            Your journey to the{' '}
            <span className="text-gradient">high seas</span> starts with one
            step.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-slate-300">
            Register once and unlock both FREE mock tests. Every great officer
            was once a nervous aspirant who simply refused to give up. Today,
            that&apos;s you.
          </p>

          <div className="mt-8 rounded-2xl border border-ocean-400/25 bg-ocean-400/[0.06] p-6">
            <h3 className="flex items-center gap-2 font-700 text-ocean-400">
              📋 Important Instructions
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-200">
              <li className="flex gap-2">
                <span className="text-ocean-400">⚓</span>
                You need to give the test online using the direct link
                provided to you in your time table.
              </li>
              <li className="flex gap-2">
                <span className="text-ocean-400">⚓</span>
                You need to provide your photo for verification of your
                identity at the time of exam, as the exam is{' '}
                <span className="font-700 text-ocean-400">AI&nbsp;proctored</span>.
              </li>
            </ul>
          </div>
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
          <h3 className="font-display text-2xl font-800 text-white">
            Register Now
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Takes less than a minute.
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
                        : 'border-white/10 focus-within:border-ocean-400 focus-within:shadow-[0_0_18px_rgba(242,201,76,0.25)]'
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

            {/* Passport photo upload */}
            <div>
              <label
                htmlFor="photo"
                className="mb-2 block text-sm font-500 text-slate-300"
              >
                Passport-size Photo{' '}
                <span className="text-slate-500">(JPEG, max 10 MB)</span>
              </label>
              <label
                htmlFor="photo"
                className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white/5 px-4 py-3 transition-all duration-200 ${
                  touched.photo && errors.photo
                    ? 'border-rose-400/60'
                    : 'border-white/10 hover:border-ocean-400/60'
                }`}
              >
                <span className="select-none text-lg opacity-70">🖼️</span>
                <span
                  className={`truncate text-sm ${
                    photo ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {photo ? photo.name : 'Choose a JPEG photo…'}
                </span>
                <span className="ml-auto rounded-full bg-ocean-400 px-3 py-1 text-xs font-700 text-black">
                  Browse
                </span>
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,.jpg,.jpeg"
                onChange={handlePhoto}
                className="hidden"
              />
              <p className="mt-2 text-xs text-slate-500">
                Clear, front-facing, passport-style photo. Used only for exam
                identity verification.
              </p>
              {touched.photo && errors.photo && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs font-500 text-rose-300"
                >
                  {errors.photo}
                </motion.p>
              )}
            </div>

            {/* Terms & conditions */}
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={handleAgree}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#F2C94C]"
                />
                <span>
                  I agree to the{' '}
                  <span className="font-700 text-ocean-400">
                    terms &amp; conditions
                  </span>{' '}
                  and confirm the details and photo provided are correct.
                </span>
              </label>
              {touched.agree && errors.agree && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-500 text-rose-300"
                >
                  {errors.agree}
                </motion.p>
              )}
            </div>
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
        pdf={pdf}
        onClose={() => setPopup(false)}
      />
    </section>
  )
}
