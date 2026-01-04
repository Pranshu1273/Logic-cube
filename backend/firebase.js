const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// 🔐 Firebase configuration (PASTE YOUR REAL VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyARGSI3NVkc_H0lApMZSEEs2qA7nhW-lIk",
  authDomain: "industrial-pollution.firebaseapp.com",
  projectId: "industrial-pollution",
  storageBucket: "industrial-pollution.firebasestorage.app",
  messagingSenderId: "250836603098",
  appId: "1:250836603098:web:5bf69bbc8988fe86f195e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore database
module.exports = { db };
