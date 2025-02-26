import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, setDoc, getDoc, collection, getDocs, deleteDoc} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDneJI7CJBwBwIo4c68P6BooPscSPadOE",
  authDomain: "libtrack-f3027.firebaseapp.com",
  projectId: "libtrack-f3027",
  storageBucket: "libtrack-f3027.firebasestorage.app",
  messagingSenderId: "118118832701",
  appId: "1:118118832701:web:0b0f05c13d11e2a410a854",
  measurementId: "G-HTB9DEV87W"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };