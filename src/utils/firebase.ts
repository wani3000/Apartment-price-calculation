// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACVbGrJtNwEXbz2TszysYrHdP774H7J5g",
  authDomain: "aptgugu.firebaseapp.com",
  projectId: "aptgugu",
  storageBucket: "aptgugu.firebasestorage.app",
  messagingSenderId: "765863537085",
  appId: "1:765863537085:web:e612d1d4f092db6f700ad4",
  measurementId: "G-NNTQM1ZTN1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 