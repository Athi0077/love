// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhWv9k9KmXXCsMcLGromRoXG1om8sar6Y",
  authDomain: "funproject-3f0bc.firebaseapp.com",
  projectId: "funproject-3f0bc",
  storageBucket: "funproject-3f0bc.firebasestorage.app",
  messagingSenderId: "322548309736",
  appId: "1:322548309736:web:87dd37df0189717bdd735d",
  measurementId: "G-4Q1N8EJ5QD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
