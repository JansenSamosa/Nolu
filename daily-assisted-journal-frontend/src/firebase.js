// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup, onAuthStateChanged, signOut
} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL4l2VVr8ivsGRGMfS5-qvuUhTRDWGLrY",
  authDomain: "nolu-eb8a6.firebaseapp.com",
  // authDomain: "nolu-eb8a6.firebaseapp.com",
  projectId: "nolu-eb8a6",
  storageBucket: "nolu-eb8a6.firebasestorage.app",
  messagingSenderId: "682028316923",
  appId: "1:682028316923:web:aa4fec1b2a78375e83185e",
  measurementId: "G-X0EGK6KVX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
auth.languageCode = 'it';

const providerGoogle = new GoogleAuthProvider()

export {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  GoogleAuthProvider, providerGoogle, signInWithRedirect, getRedirectResult, signInWithPopup, onAuthStateChanged
}