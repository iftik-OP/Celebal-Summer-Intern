// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzs0uHwwhXFd200lMZ6C6xWAwp5RlMpm0",
  authDomain: "cnjfjhf-d3265.firebaseapp.com",
  projectId: "cnjfjhf-d3265",
  storageBucket: "cnjfjhf-d3265.appspot.com",
  messagingSenderId: "122787585336",
  appId: "1:122787585336:web:e2785947d556c6fbc135cd",
  measurementId: "G-LY0VJXKXJ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };
