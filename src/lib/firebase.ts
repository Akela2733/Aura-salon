import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0300015241",
  appId: "1:870215553330:web:84b21e49db3c07a1d3472b",
  apiKey: "AIzaSyDK5bxm9eLvUy8KVUiDtZ5gc0nuQBdAQNc",
  authDomain: "gen-lang-client-0300015241.firebaseapp.com",
  storageBucket: "gen-lang-client-0300015241.firebasestorage.app",
  messagingSenderId: "870215553330"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Connection verification logic as requested in SKILL.md
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase: Please check your network connection.");
    } else {
      console.log("Firebase initialized successfully.");
    }
  }
}

testConnection();

export { app, db };
