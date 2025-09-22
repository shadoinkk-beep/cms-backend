// scripts/firebaseConfigNode.js
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getFirestore, connectFirestoreEmulator } = require("firebase/firestore");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1t1Px3GI7yUeWEM5AsDdh20GIbz18U3g",
  authDomain: "cms-testing-fa3a0.firebaseapp.com",
  projectId: "cms-testing-fa3a0",
  storageBucket: "cms-testing-fa3a0.firebasestorage.app",
  messagingSenderId: "520492751633",
  appId: "1:520492751633:web:a493350f8529bf901d4ab0",
};

// Initialize app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// FORCE emulator connection
// connectFirestoreEmulator(db, "127.0.0.1", 8081);
// console.log("Connected to Firestore emulator at 127.0.0.1:8081");

module.exports = { db };
