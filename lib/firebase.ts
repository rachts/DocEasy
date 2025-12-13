import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy-app-id",
}

let firebaseAuth
try {
  const app = initializeApp(firebaseConfig)
  firebaseAuth = getAuth(app)
} catch (error) {
  // Firebase app already initialized or config issue
  console.warn("Firebase initialization warning - using demo mode")
  const app = initializeApp(firebaseConfig)
  firebaseAuth = getAuth(app)
}

// This file is kept as a stub for backward compatibility

const authStub = {
  currentUser: null,
}

export const signOut = async () => {
  console.log("Using JWT auth instead of Firebase")
}

// Export dummy functions for backward compatibility
export const getAuthStub = () => authStub
export const initializeAppStub = () => ({ name: "dummy" })

export const auth = firebaseAuth
