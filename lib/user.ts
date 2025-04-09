import { AppUserProfile } from '../types/user';
import { auth, db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  Firestore,
  DocumentSnapshot
} from 'firebase/firestore';

export async function getUserProfile(uid: string): Promise<AppUserProfile> {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  
  try {
    const userDocRef = doc(db as Firestore, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // If user document doesn't exist, create a basic profile
      const currentUser = auth?.currentUser;
      const defaultProfile: AppUserProfile = {
        uid,
        email: currentUser?.email ?? '',
        displayName: currentUser?.displayName ?? '',
        photoURL: currentUser?.photoURL ?? '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Save the default profile
      await setDoc(userDocRef, defaultProfile);
      return defaultProfile;
    }
    
    return userDoc.data() as AppUserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function updateUserProfile(uid: string, data: Partial<AppUserProfile>): Promise<AppUserProfile> {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  
  try {
    // Get current profile to merge with updates
    const userDocRef = doc(db as Firestore, "users", uid);
    let currentProfile: Partial<AppUserProfile> = {};
    
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      currentProfile = userDoc.data() as AppUserProfile;
    }
    
    // Prepare updated profile data
    const updatedProfile = {
      ...currentProfile,
      ...data,
      uid, // Ensure UID is always set
      updatedAt: Date.now()
    };
    
    // Save to Firestore
    await setDoc(userDocRef, updatedProfile, { merge: true });
    
    return updatedProfile as AppUserProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(`Failed to update user profile: ${error instanceof Error ? error.message : String(error)}`);
  }
} 