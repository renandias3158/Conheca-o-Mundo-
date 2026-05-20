// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSEBazdielZq3Eck_vbLUXXYxSd5sR97Q",
  authDomain: "zawardooooooo-2cf89.firebaseapp.com",
  projectId: "zawardooooooo-2cf89",
  storageBucket: "zawardooooooo-2cf89.firebasestorage.app",
  messagingSenderId: "486296322331",
  appId: "1:486296322331:web:4347c1c4c2f4ad6c9713be",
  measurementId: "G-MSTWL2LW6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);