"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, type UserProfile } from "@/lib/firebase-auth"
import { createUser, getUser, updateUser } from "@/lib/firestore"
import { useRouter, usePathname } from "next/navigation"
import { serverTimestamp } from "firebase/firestore"

// Add a flag to enable test mode
const TEST_MODE = true

// Check if Firebase is disabled
const disableFirebase = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  isNewUser: boolean
  bypassAuth: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  updateUserProfile: async () => {},
  isNewUser: false,
  bypassAuth: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [bypassAuthEnabled, setBypassAuthEnabled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Function to bypass authentication for testing
  const bypassAuth = () => {
    if (TEST_MODE) {
      console.log("Bypassing authentication for testing")
      
      // Create a mock user and profile
      const mockUser = {
        uid: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "",
      } as User
      
      const mockProfile: UserProfile = {
        uid: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "",
        instagramHandle: "testuser",
        isOnboardingComplete: true,
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      }
      
      setUser(mockUser)
      setUserProfile(mockProfile)
      setLoading(false)
      setBypassAuthEnabled(true)
    }
  }

  useEffect(() => {
    if (disableFirebase) {
      // Provide a mock user when Firebase is disabled
      const mockUser = {
        uid: "mock-user-id",
        email: "mock@example.com",
        displayName: "Mock User"
      } as User;
      
      const mockProfile: UserProfile = {
        uid: "mock-user-id",
        email: "mock@example.com",
        displayName: "Mock User",
        photoURL: "",
        instagramHandle: "mockuser",
        isOnboardingComplete: true,
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      };
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setLoading(false);
      return;
    }
    
    // If bypass is enabled, don't set up the auth listener
    if (bypassAuthEnabled) {
      return () => {}
    }
    
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      if (user) {
        try {
          let profile = await getUser(user.uid)
          let newUserFlag = false;
          
          if (!profile) {
            // This is a new user
            newUserFlag = true;
            profile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              instagramHandle: "",
              isOnboardingComplete: false,
              createdAt: serverTimestamp(),
              lastLoginAt: Date.now()
            }
            await createUser(user.uid, profile)
          }
          
          setUserProfile(profile as UserProfile)
          setIsNewUser(newUserFlag)
          
          // If this is a new user or onboarding is not complete, and they're not already on the onboarding page
          if ((newUserFlag || !profile.isOnboardingComplete) && 
              pathname !== '/onboarding' && 
              !pathname?.startsWith('/login')) {
            router.push('/onboarding')
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUserProfile(null)
        setIsNewUser(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [pathname, router, bypassAuthEnabled])

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (TEST_MODE && bypassAuthEnabled) {
      // In test mode, just update the local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null)
      return
    }
    
    if (user && userProfile) {
      const updatedProfile = { ...userProfile, ...data }
      await updateUser(user.uid, updatedProfile)
      setUserProfile(updatedProfile)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, updateUserProfile, isNewUser, bypassAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

