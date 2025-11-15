import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzG4H0LUJJhLhhJL9gDtCUDteI3cucN-I",
  authDomain: "move-e6520.firebaseapp.com",
  projectId: "move-e6520",
  storageBucket: "move-e6520.firebasestorage.app",
  messagingSenderId: "1046671223542",
  appId: "1:1046671223542:web:cbf5533fd2cdb1136a1ad7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);