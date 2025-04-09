import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Only log in development
const isDev = process.env.NODE_ENV === 'development'
const disableFirebase = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true'

// Add initialization state tracking
let isInitializing = false
let initializationError: Error | null = null
let initializationAttempts = 0
const MAX_INIT_ATTEMPTS = 3

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Log Firebase config for debugging (only keys, not values)
if (isDev) {
  console.log('Firebase config check:', Object.keys(firebaseConfig).reduce((acc, key) => {
    return {
      ...acc,
      [key]: firebaseConfig[key as keyof typeof firebaseConfig] ? 'Set' : 'Missing'
    };
  }, {}));
}

// Global Firebase instances
let firebaseApp: FirebaseApp | undefined
let authInstance: ReturnType<typeof getAuth> | undefined
let firestoreInstance: ReturnType<typeof getFirestore> | undefined
let storageInstance: ReturnType<typeof getStorage> | undefined
let functionsInstance: ReturnType<typeof getFunctions> | undefined

// Initialize Firebase with retry mechanism
function initializeFirebase(attempt = 1): void {
  try {
    if (firebaseApp) {
      console.log('Firebase already initialized, skipping');
      return;
    }
    
    if (process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true') {
      console.log('Firebase is disabled via environment variable');
      return;
    }

    // Check for development mode with test flag
    const isTestMode = isDev && process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE === 'true';
    if (isTestMode) {
      console.log('Test mode enabled, using development fallbacks');
    }

    // In test mode, use fallback values
    const configToUse = isTestMode ? {
      apiKey: firebaseConfig.apiKey || 'test-api-key',
      authDomain: firebaseConfig.authDomain || 'test-project.firebaseapp.com',
      projectId: firebaseConfig.projectId || 'test-project',
      storageBucket: firebaseConfig.storageBucket || 'test-project.appspot.com',
      messagingSenderId: firebaseConfig.messagingSenderId || '123456789',
      appId: firebaseConfig.appId || '1:123456789:web:abcdef',
      measurementId: firebaseConfig.measurementId || 'G-ABCDEF123'
    } : firebaseConfig;

    isInitializing = true;
    initializationAttempts = attempt;
    
    const apps = getApps();
    
    if (apps.length === 0) {
      console.log(`Initializing Firebase (attempt ${attempt}/${MAX_INIT_ATTEMPTS})`);
      
      try {
        firebaseApp = initializeApp(configToUse);
        console.log('Firebase app initialized successfully');
      } catch (initError) {
        console.error('Error during initializeApp:', initError);
        throw initError;
      }
    } else {
      console.log('Firebase app already exists, getting reference');
      firebaseApp = getApp();
    }
    
    // Initialize services
    console.log('Initializing Firebase services');
    try {
      authInstance = getAuth(firebaseApp);
      console.log('Auth service initialized');
      
      firestoreInstance = getFirestore(firebaseApp);
      console.log('Firestore service initialized');
      
      storageInstance = getStorage(firebaseApp);
      console.log('Storage service initialized');
      
      functionsInstance = getFunctions(firebaseApp);
      console.log('Functions service initialized');
    } catch (serviceError) {
      console.error('Error initializing Firebase services:', serviceError);
      throw serviceError;
    }
    
    // Connect to emulators if in development
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      try {
        if (authInstance) connectAuthEmulator(authInstance, 'http://localhost:9099', { disableWarnings: true });
        if (firestoreInstance) connectFirestoreEmulator(firestoreInstance, 'localhost', 8080);
        if (storageInstance) connectStorageEmulator(storageInstance, 'localhost', 9199);
        if (functionsInstance) connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
        
        console.log('Connected to Firebase emulators');
      } catch (emulatorError) {
        console.error('Error connecting to emulators:', emulatorError);
      }
    }
    
    console.log('Firebase initialized successfully');
    isInitializing = false;
    initializationError = null;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    isInitializing = false;
    initializationError = error instanceof Error ? error : new Error(String(error));
    
    // Dispatch custom event to notify listeners of initialization failure
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('firebase-init-error', { 
          detail: { error: error instanceof Error ? error.message : String(error) } 
        })
      );
    }
    
    // Retry initialization if attempts remain
    if (attempt < MAX_INIT_ATTEMPTS) {
      console.log(`Retrying Firebase initialization (${attempt}/${MAX_INIT_ATTEMPTS})`);
      setTimeout(() => initializeFirebase(attempt + 1), 1000);
    }
  }
}

// Initialize Firebase on module load - only on client side
if (typeof window !== 'undefined' && !disableFirebase) {
  console.log('Initializing Firebase on client-side');
  // Add a small delay to ensure the environment is fully loaded
  setTimeout(() => {
    initializeFirebase();
  }, 100);
} else {
  console.log('Server-side rendering detected or Firebase disabled, skipping Firebase initialization');
}

// Export initialized instances
export const app = firebaseApp;
export const auth = authInstance;
export const db = firestoreInstance;
export const storage = storageInstance;
export const functions = functionsInstance;

// Helper to check if Firebase is ready
export const isFirebaseReady = (): boolean => {
  return Boolean(firebaseApp && authInstance);
}

// Function to reinitialize Firebase if needed
export const ensureFirebaseInitialized = (): boolean => {
  if (!isFirebaseReady() && process.env.NEXT_PUBLIC_DISABLE_FIREBASE !== 'true') {
    initializeFirebase();
    return false;
  }
  return isFirebaseReady();
}

// Export as a single object to avoid duplicate export issues
export {
  initializeFirebase,
  isInitializing,
  initializationError,
  initializationAttempts,
  MAX_INIT_ATTEMPTS,
  firebaseConfig
};

export default firebaseApp;

