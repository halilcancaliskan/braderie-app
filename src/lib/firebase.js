// Firebase client initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getDatabase, ref, onValue, set, push, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAQaEoazLGMYi06CPbahRXgiO7I6py50g4",
  authDomain: "braderie-finder.firebaseapp.com",
  databaseURL: "https://braderie-finder-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "braderie-finder",
  storageBucket: "braderie-finder.appspot.com",
  messagingSenderId: "95501519889",
  appId: "1:95501519889:web:b9d9943cee501bbe2435b0",
  measurementId: "G-X7CJ9EC5T3"
};

export const app = initializeApp(firebaseConfig);

// Client-only initialization (skip during tests/SSR)
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  // Optionally enable App Check for Storage if enforcement is ON in console.
  // Use REACT_APP_APPCHECK_DEBUG=true in .env.local to enable the debug token on localhost.
  try {
    if (process.env.REACT_APP_APPCHECK_DEBUG === 'true') {
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    const siteKey = process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch {}

  // Analytics only when supported
  isSupported().then((ok) => { if (ok) getAnalytics(app); }).catch(() => {});
}

export const db = getDatabase(app);
// Bind storage to the correct default bucket. If a wrong bucket is set, uploads can fail with CORS/preflight errors.
export const storage = getStorage(app, 'gs://braderie-finder.appspot.com');

// Dev hint: log the bucket actually in use (helps diagnose CORS/bucket mismatches)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try { console.debug('[storage] bucket =', sRef(storage, '').bucket); } catch {}
}

// Realtime helpers
export function subscribeToStands(cb, { limit = 100 } = {}) {
  const standsRef = query(ref(db, 'stands'), orderByChild('updatedAt'), limitToLast(limit));
  return onValue(standsRef, (snap) => {
    const val = snap.val() || {};
    const arr = Object.entries(val).map(([id, v]) => ({ id, ...v })).sort((a,b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    cb(arr);
  });
}

export async function createStand(data) {
  const col = ref(db, 'stands');
  const docRef = push(col);
  const payload = {
    title: '',
    description: '',
    categories: [],
    items: [],
    photos: [],
    priceFrom: 0,
    distanceKm: null,
    fair: null,
    location: { lat: null, lng: null, address: '' },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...data,
  };
  await set(docRef, payload);
  return { id: docRef.key, ...payload };
}

export async function saveUser(uid, profile) {
  const userRef = ref(db, `users/${uid}`);
  const payload = { updatedAt: serverTimestamp(), ...profile };
  await set(userRef, payload);
  return payload;
}

// Upload a single image to Storage and return its download URL
export async function uploadImage(file, { prefix = 'uploads' } = {}) {
  const cleanName = (file.name || 'photo').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const path = `${prefix}/${Date.now()}_${cleanName}`;
  const refObj = sRef(storage, path);
  await uploadBytes(refObj, file);
  const url = await getDownloadURL(refObj);
  return { path, url };
}
