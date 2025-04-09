"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only handle redirects if not already redirecting to prevent loops
    if (!loading && !isRedirecting) {
      // If not authenticated, redirect to login
      if (!user) {
        setIsRedirecting(true)
        void router.push("/login")
        return
      }
      
      // If onboarding is not complete, redirect to onboarding
      if (userProfile && !userProfile.isOnboardingComplete) {
        setIsRedirecting(true)
        void router.push("/onboarding")
        return
      }
    }
  }, [user, userProfile, loading, router, isRedirecting])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Redirecting...</span>
      </div>
    )
  }

  if (!user || (userProfile && !userProfile.isOnboardingComplete)) {
    return null
  }

  // Simply render the children without additional layout elements
  // since the Sidebar and Header are already provided by the LayoutContent component
  return children
} 