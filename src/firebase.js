// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7xE6On0sBiCoxRBfMORs26whYrkUMkAU",
  authDomain: "saad-81fed.firebaseapp.com",
  projectId: "saad-81fed",
  storageBucket: "saad-81fed.appspot.com",
  messagingSenderId: "1030532799215",
  appId: "1:1030532799215:web:f59d6db089e23d70b7991a",
  measurementId: "G-E8V7DSXKXX",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const analytics = getAnalytics(); // No need to pass app, it's globally available now
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
