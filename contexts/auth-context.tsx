"use client"

import type { FC, ReactNode } from "react"
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, type UserProfile } from "@/lib/firebase-auth"
import { createUser, getUser, updateUser } from "@/lib/firestore"
import { useRouter, usePathname } from "next/navigation"
import { serverTimestamp } from "firebase/firestore"
import { auth } from "@/lib/firebase"
import { getUserProfile, updateUserProfile as updateProfile } from '@/lib/user'
import type { AppUserProfile } from '@/types/user'

// Constants
const CONFIG = {
  TEST_MODE: true,
  AUTH_TIMEOUT: 5000,
  FIREBASE_DISABLED: true,
  PUBLIC_PAGES: ["/login", "/signup", "/reset-password", "/test-login", "/dev-login"] as const,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const

// Types
type AuthContextValue = {
  user: User | null
  userProfile: AppUserProfile | null
  loading: boolean
  error: Error | null
  updateUserProfile: (data: Partial<AppUserProfile>) => Promise<void>
  isNewUser: boolean
  bypassAuth: () => MockAuthResult
  initialized: boolean
}

type MockAuthResult = {
  user: User
  profile: AppUserProfile
}

type AuthProviderProps = {
  children: ReactNode
}

type AuthState = {
  user: User | null
  userProfile: AppUserProfile | null
  loading: boolean
  error: Error | null
  isNewUser: boolean
  bypassAuthEnabled: boolean
  initialized: boolean
  retryCount: number
}

// Context
const AuthContext = createContext<AuthContextValue | null>(null)

// Create a persistent mock auth object to avoid re-creation
const MOCK_AUTH = (() => {
  const mockUser = {
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "",
    tenantId: null,
    phoneNumber: null,
    providerId: "password",
    delete: async () => {},
    getIdToken: async () => "",
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({})
  } as unknown as User

  const mockProfile: AppUserProfile = {
    uid: mockUser.uid,
    email: mockUser.email ?? "",
    displayName: mockUser.displayName ?? "",
    photoURL: mockUser.photoURL ?? "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isOnboardingComplete: false,
    instagramHandle: "",
    youtubeHandle: "",
    twitterHandle: "",
    tiktokHandle: "",
    linkedinHandle: "",
    bio: "",
    interests: [],
    contentTypes: []
  }

  return { user: mockUser, profile: mockProfile }
})()

// Hook
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Provider Component
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
  user: null,
  userProfile: null,
  loading: true,
    error: null,
  isNewUser: false,
    bypassAuthEnabled: false,
    initialized: false,
    retryCount: 0
  })
  
  const router = useRouter()
  const pathname = usePathname()

  // Firebase initialization error handler - memoized to avoid recreating on each render
  const handleFirebaseInitError = useCallback((event: CustomEvent<{ error: string }>) => {
    console.error("Firebase initialization error:", event.detail.error)
    setState(prev => ({
      ...prev,
      error: new Error(`Firebase initialization failed: ${event.detail.error}`),
      loading: false,
      initialized: false
    }))
  }, [])

  // Memoized profile update handler
  const updateUserProfile = useCallback(async (data: Partial<AppUserProfile>): Promise<void> => {
    try {
      if (CONFIG.TEST_MODE && state.bypassAuthEnabled) {
        setState(prev => ({
          ...prev,
          userProfile: prev.userProfile ? { ...prev.userProfile, ...data, updatedAt: Date.now() } : null
        }))
        return
      }
    
      if (!state.user) {
        throw new Error("You must be logged in to update your profile")
      }

      const updatedProfile = await updateProfile(state.user.uid, {
        ...data,
        updatedAt: Date.now()
      })

      setState(prev => ({ ...prev, userProfile: updatedProfile }))
    } catch (error) {
      console.error("Error updating user profile:", error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error(String(error))
      }))
      throw error
    }
  }, [state.user, state.bypassAuthEnabled])

  // Memoized bypass auth handler
  const bypassAuth = useCallback(() => {
    try {
      console.log("Bypass auth called in auth context");
      if (!CONFIG.TEST_MODE) {
        console.warn("Attempted to bypass auth in production mode");
        throw new Error("Auth bypass is only available in test mode");
      }
      
      setState(prev => ({
        ...prev,
        user: MOCK_AUTH.user,
        userProfile: MOCK_AUTH.profile,
        bypassAuthEnabled: true,
        loading: false,
        initialized: true,
        error: null
      }));
      
      console.log("Auth bypass successful, returning mock auth");
      return MOCK_AUTH;
    } catch (error) {
      console.error("Error in bypassAuth:", error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false
      }));
      throw error;
    }
  }, []);

  // Auth state effect
  useEffect(() => {
    window.addEventListener('firebase-init-error' as any, handleFirebaseInitError)

    const timeoutId = setTimeout(() => {
      setState(prev => prev.loading ? {
        ...prev,
        error: new Error('Authentication initialization timed out. Please refresh the page.'),
        loading: false,
        initialized: false
      } : prev)
    }, CONFIG.AUTH_TIMEOUT)

    let unsubscribe: (() => void) | undefined

    const setupAuth = async () => {
      try {
        // Skip if already initialized
        if (state.initialized && !state.loading) {
          return
        }

        // Automatically use test mode in development
        console.log("Using test mode authentication");
        setState(prev => ({
          ...prev,
          user: MOCK_AUTH.user,
          userProfile: MOCK_AUTH.profile,
          bypassAuthEnabled: true,
          loading: false,
          error: null,
          initialized: true
        }))
      } catch (error) {
        console.error('Error setting up auth listener:', error)
        setState(prev => ({
          ...prev,
          error: new Error(`Failed to initialize authentication: ${error instanceof Error ? error.message : String(error)}`),
          loading: false,
          initialized: false
        }))

        // Retry setup if under max attempts
        if (state.retryCount < CONFIG.MAX_RETRIES) {
          setTimeout(setupAuth, CONFIG.RETRY_DELAY)
        }
      }
    }

    void setupAuth()

    return () => {
      unsubscribe?.()
      clearTimeout(timeoutId)
      window.removeEventListener('firebase-init-error' as any, handleFirebaseInitError)
    }
  }, [state.retryCount, state.initialized, state.loading, handleFirebaseInitError])

  // Protected routes effect - disabled for test mode
  useEffect(() => {
    // Always skip redirects in test mode
    return
  }, [state.user, state.loading, pathname, router, state.initialized])

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user: state.user,
      userProfile: state.userProfile,
      loading: state.loading,
      error: state.error,
      updateUserProfile,
      isNewUser: state.isNewUser,
      bypassAuth,
      initialized: state.initialized
    }),
    [
      state.user,
      state.userProfile,
      state.loading,
      state.error,
      state.isNewUser,
      state.initialized,
      updateUserProfile,
      bypassAuth
    ]
  )

  // Memoize loading component to prevent re-renders
  const loadingComponent = useMemo(() => {
    if (!state.loading) return null

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            {state.retryCount > 0 ? `Initializing... (attempt ${state.retryCount}/${CONFIG.MAX_RETRIES})` : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }, [state.loading, state.retryCount])

  if (state.loading) {
    return loadingComponent
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

