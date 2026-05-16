// ─────────────────────────────────────────────────────────────
// Firebase initialization
//
// Reads config from environment variables (see .env.example).
// If the env vars are missing (e.g. first run before setup) the
// app still loads — Firestore calls will simply no-op so the UI
// keeps working for previews and local development.
// ─────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// True only when the essential keys are present.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let db = null

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Budding Mariners] Firebase env vars not found. ' +
      'Form submissions and wishes will run in local demo mode. ' +
      'Copy .env.example to .env and add your credentials.',
  )
}

export { db }
