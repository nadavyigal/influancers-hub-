import { auth, db } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  type User,
  type Auth,
  type UserCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  type Firestore,
  type DocumentReference,
  type DocumentData,
  type WithFieldValue,
  type DocumentSnapshot,
  type SetOptions,
  serverTimestamp,
  Timestamp,
  FieldValue
} from "firebase/firestore"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  instagramHandle: string
  youtubeHandle?: string
  twitterHandle?: string
  tiktokHandle?: string
  linkedinHandle?: string
  bio?: string
  isOnboardingComplete: boolean
  createdAt: Timestamp | number | FieldValue // Support Timestamp, number, and FieldValue for serverTimestamp()
  lastLoginAt: number
}

// Mock user profile for test mode
const mockTimestamp = { 
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
  toDate: () => new Date(),
  toMillis: () => Date.now(),
  isEqual: () => false,
  valueOf: () => "",
  toJSON: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 })
} as unknown as Timestamp;

const mockUserProfile: UserProfile = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "",
  instagramHandle: "testuser",
  youtubeHandle: "TestUserChannel",
  twitterHandle: "testuser",
  tiktokHandle: "testuser",
  linkedinHandle: "test-user",
  bio: "This is a test user for development",
  isOnboardingComplete: true,
  createdAt: mockTimestamp,
  lastLoginAt: Date.now()
};

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export const signUpWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  console.log("Test mode: Simulating sign up with email:", email);
  return { ...mockUserProfile, email };
}

export const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false): Promise<UserProfile> => {
  console.log("Test mode: Simulating sign in with email:", email);
  return { ...mockUserProfile, email };
}

export const signInWithGoogle = async (): Promise<UserProfile> => {
  console.log("Test mode: Simulating sign in with Google");
  return mockUserProfile;
}

export const signOutUser = async (): Promise<void> => {
  console.log("Test mode: Simulating sign out");
  return Promise.resolve();
}

export const resetPassword = async (email: string): Promise<void> => {
  console.log("Test mode: Simulating password reset for:", email);
  return Promise.resolve();
}

export const deleteUserAccount = async (uid: string): Promise<void> => {
  console.log("Test mode: Simulating account deletion for:", uid);
  return Promise.resolve();
}

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  console.log("Test mode: Returning mock user profile for:", uid);
  return { ...mockUserProfile, uid };
}

export const updateUserLastLogin = async (uid: string): Promise<void> => {
  console.log("Test mode: Simulating last login update for:", uid);
  return Promise.resolve();
}

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  console.log("Test mode: Simulating profile update for:", uid, data);
  return Promise.resolve();
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Create a mock user object that matches the Firebase User interface
  const mockUser = {
    uid: mockUserProfile.uid,
    email: mockUserProfile.email,
    displayName: mockUserProfile.displayName,
    photoURL: mockUserProfile.photoURL,
    emailVerified: true,
    isAnonymous: false,
    metadata: { creationTime: new Date().toString(), lastSignInTime: new Date().toString() },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-id-token',
    getIdTokenResult: async () => ({ token: 'mock-token' } as any),
    reload: async () => {},
    toJSON: () => ({})
  } as unknown as User;
  
  // Call the callback immediately with the mock user
  setTimeout(() => callback(mockUser), 0);
  
  // Return a function to "unsubscribe"
  return () => console.log("Test mode: Unsubscribing from auth state changes");
}

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return true; // Always return true in test mode
}

// Helper function to get current user
export const getCurrentUser = (): User | null => {
  // Return a mock user
  return {
    uid: mockUserProfile.uid,
    email: mockUserProfile.email,
    displayName: mockUserProfile.displayName,
    photoURL: mockUserProfile.photoURL,
    emailVerified: true,
    // Add other required properties to satisfy User interface
    isAnonymous: false,
    metadata: { creationTime: new Date().toString(), lastSignInTime: new Date().toString() },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-id-token',
    getIdTokenResult: async () => ({ token: 'mock-token' } as any),
    reload: async () => {},
    toJSON: () => ({})
  } as unknown as User;
}

// Add these new functions for session management
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

// Update the timestamp when the user was last active
export const updateUserActivity = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lastActivityTime', Date.now().toString());
  }
};

// Check if the session has timed out
export const hasSessionExpired = (): boolean => {
  return false; // Never expire in test mode
}

// Check session timeout and handle accordingly
export const checkSessionTimeout = async (): Promise<boolean> => {
  console.log("Test mode: Session timeout check - always active");
  return false; // Session never expires in test mode
}

// Create a monitor for session timeout
export const createSessionTimeoutMonitor = (onTimeout: () => void) => {
  console.log("Test mode: Creating mock session timeout monitor");
  
  // Return a cleanup function
  return () => console.log("Test mode: Cleaning up session timeout monitor");
}

