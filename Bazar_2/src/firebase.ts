import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set as rtdbSet } from 'firebase/database';

// Read configuration from env; keep allowing partial override via env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Consider configured if at least authDomain + projectId + apiKey + appId are present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

let app: ReturnType<typeof initializeApp> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;
let rtdbInstance: ReturnType<typeof getDatabase> | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig as any);
  authInstance = getAuth(app);
  try {
    firestoreInstance = getFirestore(app);
  } catch (err) {
    // Firestore optional
    console.warn('No se pudo inicializar Firestore:', err);
  }
  try {
    if (firebaseConfig.databaseURL) {
      rtdbInstance = getDatabase(app);
    }
  } catch (err) {
    console.warn('No se pudo inicializar Realtime Database:', err);
  }

  // If both auth and rtdb are available, listen for auth state and write basic user info to DB
  if (authInstance && rtdbInstance) {
    onAuthStateChanged(authInstance, (user) => {
      if (user) {
        try {
          const userRef = ref(rtdbInstance as any, `users/${user.uid}`);
          rtdbSet(userRef, {
            username: user.displayName || 'Usuario',
            email: user.email || null,
            lastSeen: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Error escribiendo usuario en Realtime DB:', err);
        }
      }
    });
  }
} else {
  console.warn('Firebase no está configurado. Por favor configura las variables en .env y reinicia la app.');
}

export const auth = authInstance as ReturnType<typeof getAuth> | null;
export const db = firestoreInstance as ReturnType<typeof getFirestore> | null;
export const rtdb = rtdbInstance as ReturnType<typeof getDatabase> | null;
