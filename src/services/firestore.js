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

// Optional Google Apps Script web-app URL. When set, registrations are
// appended as rows to a Google Sheet (see README "Google Sheet setup").
const SHEETS_URL = import.meta.env.VITE_SHEETS_URL

/**
 * Persist a student's registration.
 *
 * Destination priority:
 *   1. Google Sheet  (if VITE_SHEETS_URL is set)
 *   2. Firestore     (if Firebase env vars are set)
 *   3. Demo mode     (no backend — resolves locally)
 *
 * @param {{fullName:string, mobile:string, rollNumber:string}} data
 */
export async function saveRegistration(data) {
  const clean = {
    fullName: data.fullName.trim(),
    mobile: data.mobile.trim(),
    rollNumber: data.rollNumber.trim().toUpperCase(),
  }

  // 1. Google Sheet ---------------------------------------------------
  if (SHEETS_URL) {
    const body = new URLSearchParams({
      ...clean,
      createdAt: new Date().toISOString(),
    })
    // Apps Script doesn't send CORS headers, so we use no-cors: the row
    // is still written; we just can't read the (opaque) response.
    await fetch(SHEETS_URL, { method: 'POST', mode: 'no-cors', body })
    return { id: `sheet-${Date.now()}`, demo: false }
  }

  // 2. Firestore ------------------------------------------------------
  if (isFirebaseConfigured && db) {
    const ref = await addDoc(collection(db, 'registrations'), {
      ...clean,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, demo: false }
  }

  // 3. Demo mode ------------------------------------------------------
  await new Promise((r) => setTimeout(r, 700))
  return { id: `demo-${Date.now()}`, demo: true }
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
