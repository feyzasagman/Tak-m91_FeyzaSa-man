import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAioOAEXhbsZkZnumlIlYO9X4Oj4RLlVs4",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "internai-a8bb6.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "internai-a8bb6",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "internai-a8bb6.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "110353690310",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:110353690310:web:9a25acd5198287434df1c7",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-RW1HDFTT5D",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
