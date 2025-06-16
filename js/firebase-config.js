import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzRi2y7wk-72F3IX3S7SM5_Mz99hmEPEM",
  authDomain: "yamco-5500.firebaseapp.com",
  projectId: "yamco-5500",
  storageBucket: "yamco-5500.appspot.com",
  messagingSenderId: "126428222440",
  appId: "1:126428222440:web:96ebf20a6b8d8936264a5d",
  measurementId: "G-HXJ50HPZSV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };