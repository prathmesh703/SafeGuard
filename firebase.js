// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpUshz-esJQp0HVyD__w33glAWYFVNgQw",
  authDomain: "safeguard-f1000.firebaseapp.com",
  projectId: "safeguard-f1000",
  storageBucket: "safeguard-f1000.firebasestorage.app",
  messagingSenderId: "759739033908",
  appId: "1:759739033908:web:9afc4ad1c300a334891d61",
  measurementId: "G-QF5WJQNQL1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);