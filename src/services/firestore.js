// ─────────────────────────────────────────────────────────────
// Firestore data access
//
// Two collections / docs are used:
//   • registrations            → one document per student
//   • stats/wishes  { count }  → single counter for the heart button
//
// Every function degrades gracefully to a localStorage-backed
// "demo mode" when Firebase is not configured, so the UI is always
// fully interactive (great for previews and offline development).
// ─────────────────────────────────────────────────────────────
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'

const DEMO_WISHES_KEY = 'bma_demo_wishes'

/**
 * Persist a student's registration.
 * @param {{fullName:string, mobile:string, rollNumber:string}} data
 */
export async function saveRegistration(data) {
  const payload = {
    fullName: data.fullName.trim(),
    mobile: data.mobile.trim(),
    rollNumber: data.rollNumber.trim().toUpperCase(),
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  }

  if (!isFirebaseConfigured || !db) {
    // Demo mode — pretend it succeeded after a short delay.
    await new Promise((r) => setTimeout(r, 700))
    return { id: `demo-${Date.now()}`, demo: true }
  }

  const ref = await addDoc(collection(db, 'registrations'), payload)
  return { id: ref.id, demo: false }
}

/** Read the current total number of wishes. */
export async function getWishCount() {
  if (!isFirebaseConfigured || !db) {
    return Number(localStorage.getItem(DEMO_WISHES_KEY) || 0)
  }
  const snap = await getDoc(doc(db, 'stats', 'wishes'))
  return snap.exists() ? Number(snap.data().count || 0) : 0
}

/**
 * Atomically add one wish and return the (optimistic) new total.
 * Uses Firestore's server-side increment to stay correct under load.
 */
export async function addWish() {
  if (!isFirebaseConfigured || !db) {
    const next = Number(localStorage.getItem(DEMO_WISHES_KEY) || 0) + 1
    localStorage.setItem(DEMO_WISHES_KEY, String(next))
    return next
  }
  const ref = doc(db, 'stats', 'wishes')
  await setDoc(ref, { count: increment(1) }, { merge: true })
  return null // real total arrives via the live subscription
}

/**
 * Subscribe to live wish-count updates.
 * @param {(count:number)=>void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeWishCount(callback) {
  if (!isFirebaseConfigured || !db) {
    callback(Number(localStorage.getItem(DEMO_WISHES_KEY) || 0))
    return () => {}
  }
  return onSnapshot(doc(db, 'stats', 'wishes'), (snap) => {
    callback(snap.exists() ? Number(snap.data().count || 0) : 0)
  })
}
