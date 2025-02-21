
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// 🔥 Firebase Config (Replace with your actual Firebase credentials)

const firebaseConfig = {
  apiKey: "AIzaSyC7nMJXadpaUx4Qg1-nqYBqeSHhmzK3iWs",
  authDomain: "convergence-326f7.firebaseapp.com",
  projectId: "convergence-326f7",
  storageBucket: "convergence-326f7.firebasestorage.app",
  messagingSenderId: "214799286744",
  appId: "1:214799286744:web:c10cdc67b89c3c476a72ad",
  measurementId: "G-T3TSNEYNQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fix: Export everything in one statement
export { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp };
