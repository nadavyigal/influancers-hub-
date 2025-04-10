"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

function LayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Don't show sidebar on auth pages or onboarding
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password'
  const isOnboardingPage = pathname === '/onboarding'
  
  useEffect(() => {
    try {
      setMounted(true)
    } catch (err) {
      console.error("Error in LayoutContent useEffect:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle errors
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-red-500 text-4xl">⚠️</div>
          <p className="text-lg font-medium text-red-500">Something went wrong</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  // During server-side rendering or before mounting, return a simple loading state
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthPage || isOnboardingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background to-muted/30">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// Default export for dynamic import
export default LayoutContent; 