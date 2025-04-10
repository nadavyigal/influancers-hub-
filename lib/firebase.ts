import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth, browserSessionPersistence, inMemoryPersistence, setPersistence } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Force disable Firebase
const disableFirebase = true

// Add initialization state tracking
let isInitializing = false
let initializationError: Error | null = null
let initializationAttempts = 0
const MAX_INIT_ATTEMPTS = 3

// Mock Firebase configuration
const firebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
  measurementId: 'G-ABCDEF123'
}

// Mock Firebase instances
let firebaseApp: FirebaseApp | undefined
let authInstance: ReturnType<typeof getAuth> | undefined
let firestoreInstance: ReturnType<typeof getFirestore> | undefined
let storageInstance: ReturnType<typeof getStorage> | undefined
let functionsInstance: ReturnType<typeof getFunctions> | undefined

// Create a mock db for Firestore
const mockDb = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: false,
        data: () => ({}),
        id: 'mock-id'
      }),
      set: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      collection: () => mockDb.collection()
    }),
    where: () => ({
      get: async () => ({
        empty: true,
        docs: [],
        forEach: () => {}
      }),
      limit: () => ({
        get: async () => ({
          empty: true,
          docs: [],
          forEach: () => {}
        })
      })
    }),
    add: async () => ({ id: 'mock-id' }),
    orderBy: () => ({
      limit: () => ({
        get: async () => ({
          empty: true,
          docs: [],
          forEach: () => {}
        })
      })
    })
  })
};

// Initialize Firebase with mock data
function initializeFirebase(): void {
  console.log('Firebase is disabled, using mock instances');
  
  // Do nothing - we'll use mock instances
  isInitializing = false;
  initializationError = null;
}

// Export dummy instances
export const auth = undefined;
export const firestore = undefined;
export const storage = undefined;
export const functions = undefined;
export const app = undefined;
export const db = mockDb;

// Helper to check if Firebase is ready
export const isFirebaseReady = (): boolean => {
  return true; // Always return true in test mode
}

// Function to reinitialize Firebase if needed
export const ensureFirebaseInitialized = (): boolean => {
  return true; // Always return true in test mode
}

// Export as a single object to avoid duplicate export issues
export {
  initializeFirebase,
  isInitializing,
  initializationError,
  initializationAttempts,
  MAX_INIT_ATTEMPTS,
  firebaseConfig,
  disableFirebase
};

export default undefined;

