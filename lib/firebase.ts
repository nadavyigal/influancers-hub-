import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

// Only log in development
const isDev = process.env.NODE_ENV === 'development'
const disableFirebase = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true'

if (isDev) {
  console.log("Firebase config environment variables:", {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Not set",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Not set",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set",
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Define the type for our global Firebase object
interface FirebaseInstance {
  app: FirebaseApp | undefined;
  auth: Auth | undefined;
  db: Firestore | undefined;
  storage: FirebaseStorage | undefined;
}

// Extend the global namespace
declare global {
  var firebase: FirebaseInstance | undefined;
}

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Prevent multiple initializations
if (!global.firebase) {
  try {
    if (!firebaseConfig.apiKey) {
      throw new Error("Firebase API Key is missing. Check your environment variables.");
    }
    
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    if (isDev) {
      console.log("Firebase initialized successfully");
    }
    
    // Store in global to prevent re-initialization
    global.firebase = { app, auth, db, storage };
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Use existing instances
  app = global.firebase.app;
  auth = global.firebase.auth;
  db = global.firebase.db;
  storage = global.firebase.storage;
}

// Initialize Firebase only if not disabled
if (!disableFirebase) {
  // Existing Firebase initialization code
  // ...
} else {
  console.log("Firebase is disabled by environment variable");
}

export { app, auth, db, storage }

