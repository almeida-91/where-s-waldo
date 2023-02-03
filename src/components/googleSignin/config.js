// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYf3EnVGwewBxmCD9DmVa_BX4FpuECn-E",
  authDomain: "where-s-waldo-afc67.firebaseapp.com",
  projectId: "where-s-waldo-afc67",
  storageBucket: "where-s-waldo-afc67.appspot.com",
  messagingSenderId: "29928714848",
  appId: "1:29928714848:web:424efa66b41b32f4ca8905",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
