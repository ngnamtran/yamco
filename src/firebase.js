// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase,ref,push,onValue } from "firebase/database";
import { getFirestore, doc, setDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzRi2y7wk-72F3IX3S7SM5_Mz99hmEPEM",
  authDomain: "yamco-5500.firebaseapp.com",
  projectId: "yamco-5500",
  storageBucket: "yamco-5500.firebasestorage.app",
  messagingSenderId: "126428222440",
  appId: "1:126428222440:web:96ebf20a6b8d8936264a5d",
  measurementId: "G-HXJ50HPZSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);           // Authentication
export const db = getFirestore(app);        // Firestore Database
export const database = getDatabase(app);   // Realtime Database

// Export useful methods for convenience
export { ref, push, onValue };             // Realtime Database methods
export { doc, setDoc };            // Firestore methods