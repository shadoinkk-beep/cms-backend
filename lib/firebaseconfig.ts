// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Your Firebase config from Firebase Console
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
// };
const firebaseConfig = {
  apiKey: "AIzaSyC1t1Px3GI7yUeWEM5AsDdh20GIbz18U3g",
  authDomain: "cms-testing-fa3a0.firebaseapp.com",
  projectId: "cms-testing-fa3a0",
  storageBucket: "cms-testing-fa3a0.firebasestorage.app",
  messagingSenderId: "520492751633",
  appId: "1:520492751633:web:a493350f8529bf901d4ab0",
  measurementId: "G-FSYNK2V3WK"
};

// Initialize Firebase only once (for Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// if (location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "127.0.0.1", 8081);
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectStorageEmulator(storage, "127.0.0.1", 9199);
// }
