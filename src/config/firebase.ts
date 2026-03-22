import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════
// FIREBASE SETUP — Replace these with your own Firebase config
//
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Add a Web app (</> icon)
// 4. Copy the config object below
// 5. Enable Authentication → Email/Password in Firebase Console
// 6. Create Firestore Database (start in test mode)
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyBM0KsC95x3OWVpOnBWahh7kAaRTZmYrKw",
  authDomain: "bridgeapp-e26e3.firebaseapp.com",
  projectId: "bridgeapp-e26e3",
  storageBucket: "bridgeapp-e26e3.firebasestorage.app",
  messagingSenderId: "678290183973",
  appId: "1:678290183973:web:73a3d5e5beea227ae92ccc",
};

// Check if Firebase is configured (not using placeholder values)
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('YOUR_');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export default app;
