import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBP_eVHGYAIfBPD57-b5GCPzGsyRUhyvO4",
  authDomain: "summarist-79e0f.firebaseapp.com",
  projectId: "summarist-79e0f",
  storageBucket: "summarist-79e0f.firebasestorage.app",
  messagingSenderId: "155939624301",
  appId: "1:155939624301:web:4d301ce64fdaee8622f664",
  measurementId: "G-NEFPDF73K7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
