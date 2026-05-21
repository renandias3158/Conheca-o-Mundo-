import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSEBazdielZq3Eck_vbLUXXYxSd5sR97Q",
  authDomain: "zawardooooooo-2cf89.firebaseapp.com",
  projectId: "zawardooooooo-2cf89",
  storageBucket: "zawardooooooo-2cf89.firebasestorage.app",
  messagingSenderId: "486296322331",
  appId: "1:486296322331:web:4347c1c4c2f4ad6c9713be",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;