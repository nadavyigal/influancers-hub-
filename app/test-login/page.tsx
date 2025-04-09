"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function TestLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { bypassAuth } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    // Simulate login success
    setTimeout(() => {
      console.log("Test login successful")
      setLoading(false)
      void router.push("/dashboard")
    }, 1000)
  }

  const handleBypassAuth = () => {
    setLoading(true)
    
    // Use the bypass auth function from context
    bypassAuth()
    
    setTimeout(() => {
      setLoading(false)
      void router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Test Login Page</CardTitle>
          <CardDescription>This is a test login page that bypasses Firebase</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded">
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your@email.com"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleBypassAuth}
              disabled={loading}
            >
              {loading ? "Bypassing..." : "Bypass Authentication (Test Mode)"}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => void router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 