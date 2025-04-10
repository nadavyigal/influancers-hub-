"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  
  // Auto-redirect to dashboard
  useEffect(() => {
    // Short delay to allow for any context initialization
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 100)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Influencer's Hub</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        The all-in-one platform for social media influencers to manage their content, analytics, and audience.
      </p>

      <div className="mb-8">
        <Button onClick={() => router.push("/dashboard")} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Go to Dashboard
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          No login required - Test Mode Enabled
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-muted-foreground">Create, schedule, and manage your content across multiple platforms.</p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance with detailed analytics and insights.</p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
          <p className="text-muted-foreground">Get content ideas, captions, and optimization suggestions powered by AI.</p>
        </div>
      </div>
    </div>
  )
}

