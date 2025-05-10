import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD1oZdc2wsJ1Zlq2Qc62u7BqflaWHqaZVE",
  authDomain: "pwa-project-14ef8.firebaseapp.com",
  databaseURL: "https://pwa-project-14ef8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pwa-project-14ef8",
  storageBucket: "pwa-project-14ef8.appspot.com",
  messagingSenderId: "464656806153",
  appId: "1:464656806153:web:2e714b0a172200435d63d8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, ref, onValue };
