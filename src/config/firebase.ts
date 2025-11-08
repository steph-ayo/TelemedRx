// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDBRYMC_h7FwHXQwKwfABjkP0lKo4A6qw4",
  authDomain: "telemedrx-63aba.firebaseapp.com",
  projectId: "telemedrx-63aba",
  storageBucket: "telemedrx-63aba.appspot.com",
  messagingSenderId: "275013999917",
  appId: "1:275013999917:web:dc54a3b77729b4285c47a4",
  measurementId: "G-SRVB9HXG08",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Enable analytics safely

isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});
