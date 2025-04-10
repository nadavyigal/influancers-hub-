import { AppUserProfile } from '../types/user';
import { auth, db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  Firestore,
  DocumentSnapshot
} from 'firebase/firestore';

// Mock user profile for test mode
const mockUserProfile: AppUserProfile = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isOnboardingComplete: true,
  instagramHandle: "testuser",
  youtubeHandle: "TestUserChannel",
  twitterHandle: "testuser",
  tiktokHandle: "testuser",
  linkedinHandle: "test-user",
  bio: "This is a test user for development",
  interests: ["photography", "social media", "marketing"],
  contentTypes: ["photos", "reels", "stories"]
};

export async function getUserProfile(uid: string): Promise<AppUserProfile> {
  try {
    console.log("Test mode: Returning mock user profile for:", uid);
    return { ...mockUserProfile, uid };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { ...mockUserProfile, uid };
  }
}

export async function updateUserProfile(uid: string, data: Partial<AppUserProfile>): Promise<AppUserProfile> {
  try {
    console.log("Test mode: Simulating profile update for:", uid, data);
    // Return merged user profile
    return { ...mockUserProfile, ...data, uid, updatedAt: Date.now() };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { ...mockUserProfile, uid };
  }
} 