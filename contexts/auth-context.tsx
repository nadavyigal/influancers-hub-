"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, type UserProfile } from "@/lib/firebase-auth"
import { createUser, getUser, updateUser } from "@/lib/firestore"
import { useRouter, usePathname } from "next/navigation"
import { serverTimestamp } from "firebase/firestore"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  isNewUser: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  updateUserProfile: async () => {},
  isNewUser: false
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
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
  }, [pathname, router])

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user && userProfile) {
      const updatedProfile = { ...userProfile, ...data }
      await updateUser(user.uid, updatedProfile)
      setUserProfile(updatedProfile)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, updateUserProfile, isNewUser }}>
      {children}
    </AuthContext.Provider>
  )
}

