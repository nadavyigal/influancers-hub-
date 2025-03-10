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
  type UserCredential
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

export const signUpWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    
    const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password)
    const user = userCredential.user
    
    // Send email verification
    await sendEmailVerification(user);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      instagramHandle: "",
      isOnboardingComplete: false,
      createdAt: serverTimestamp(),
      lastLoginAt: Date.now()
    }
    await setDoc(doc(db as Firestore, "users", user.uid), userProfile)
    return userProfile
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(`Failed to sign up: ${error.message}`);
  }
}

export const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false): Promise<UserProfile> => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    
    // Set persistence based on rememberMe option
    // Note: This would require importing and using setPersistence and the appropriate persistence type
    // from firebase/auth, which we'll implement in a separate function
    
    const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password)
    
    // Update last login timestamp
    const userProfile = await getUserProfile(userCredential.user.uid)
    await updateUserLastLogin(userCredential.user.uid)
    
    return userProfile
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(`Failed to sign in: ${error.message}`);
  }
}

export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth as Auth, provider)
    const user = userCredential.user
    
    // Check if user exists
    const userDocRef = doc(db as Firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // Determine if this is a new user
    const isNewUser = !userDoc.exists();
    
    // For new users, use serverTimestamp, for existing users keep their timestamp or create a new one
    const createdAt = isNewUser 
      ? serverTimestamp() 
      : (userDoc.exists() && userDoc.data().createdAt 
          ? userDoc.data().createdAt 
          : serverTimestamp());
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      instagramHandle: "",
      isOnboardingComplete: isNewUser ? false : (userDoc.exists() ? userDoc.data().isOnboardingComplete || false : false),
      createdAt: createdAt,
      lastLoginAt: Date.now()
    }
    
    // Update the user profile in Firestore
    await setDoc(userDocRef, userProfile, { merge: true })
    
    // Update last login timestamp
    await updateUserLastLogin(user.uid)
    
    return userProfile;
  } catch (error: any) {
    console.error("Google sign in error:", error);
    throw new Error(`Failed to sign in with Google: ${error.message}`);
  }
}

export const signOutUser = async (): Promise<void> => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    
    await signOut(auth as Auth)
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error(`Failed to sign out: ${error.message}`);
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    
    await sendPasswordResetEmail(auth as Auth, email);
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}

export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
    if (!auth || !auth.currentUser) throw new Error("Firebase auth is not initialized or user not logged in");
    
    // Delete user data from Firestore
    await deleteDoc(doc(db as Firestore, "users", uid));
    
    // Delete the user authentication account
    await deleteUser(auth.currentUser);
  } catch (error: any) {
    console.error("Delete account error:", error);
    throw new Error(`Failed to delete account: ${error.message}`);
  }
}

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  try {
    if (!db) throw new Error("Firebase Firestore is not initialized");
    
    const userDoc = await getDoc(doc(db as Firestore, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    throw new Error("User profile not found")
  } catch (error: any) {
    console.error("Get user profile error:", error);
    throw new Error(`Failed to get user profile: ${error.message}`);
  }
}

export const updateUserLastLogin = async (uid: string): Promise<void> => {
  try {
    if (!db) throw new Error("Firebase Firestore is not initialized");
    
    await setDoc(doc(db as Firestore, "users", uid), { lastLoginAt: Date.now() }, { merge: true });
  } catch (error: any) {
    console.error("Update last login error:", error);
    // Non-critical error, don't throw
  }
}

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    if (!db) throw new Error("Firebase Firestore is not initialized");
    
    await setDoc(doc(db as Firestore, "users", uid), data, { merge: true });
  } catch (error: any) {
    console.error("Update user profile error:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.error("Firebase auth is not initialized");
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth as Auth, callback)
}

