// // src/lib/firebase.js
// // ─────────────────────────────────────────────────────────────────────
// // SETUP INSTRUCTIONS:
// // 1. Go to https://console.firebase.google.com/ and create a new project
// // 2. Enable Authentication → Sign-in method → Email/Password
// // 3. Enable Firestore Database (start in test mode for development)
// // 4. Go to Project Settings → Your Apps → Add Web App
// // 5. Copy the firebaseConfig object values below
// // ─────────────────────────────────────────────────────────────────────

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   // apiKey: "YOUR_API_KEY",
//   // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   // projectId: "YOUR_PROJECT_ID",
//   // storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   // appId: "YOUR_APP_ID"
//   apiKey: "AIzaSyCsFp5oJJDvLqcMW79mQ-HUfsVamNGHZ3o",
//   authDomain: "stayops-hotel.firebaseapp.com",
//   projectId: "stayops-hotel",
//   storageBucket: "stayops-hotel.firebasestorage.app",
//   messagingSenderId: "798506474331",
//   appId: "1:798506474331:web:f601c83189c7077ab1d87e",
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export default app;


// import { initializeApp, getApps, getApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCsFp5oJJDvLqcMW79mQ-HUfsVamNGHZ3o",
//   authDomain: "stayops-hotel.firebaseapp.com",
//   projectId: "stayops-hotel",
//   storageBucket: "stayops-hotel.firebasestorage.app",
//   messagingSenderId: "798506474331",
//   appId: "1:798506474331:web:f601c83189c7077ab1d87e",
// };

// const app = !getApps().length
//   ? initializeApp(firebaseConfig)
//   : getApp();

// export default app;


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 ///
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;