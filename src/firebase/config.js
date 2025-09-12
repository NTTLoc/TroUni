import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyA-W4zK286oafaHsfAqQFz1FAHuD8DdV5E",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };
const firebaseConfig = {
  apiKey: "AIzaSyA-W4zK286oafaHsfAqQFz1FAHuD8DdV5E",
  authDomain: "rental-housing-4398e.firebaseapp.com",
  projectId: "rental-housing-4398e",
  storageBucket: "rental-housing-4398e.appspot.com",
  messagingSenderId: "255713535170",
  appId: "1:255713535170:web:xxxxxx",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
