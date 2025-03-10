"use client"

import { useState } from "react"
import { signInWithEmail, signUpWithEmail } from "@/lib/firebase-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setResult("Attempting to sign up...")
    try {
      const user = await signUpWithEmail(email, password)
      setResult(`Sign up successful! User ID: ${user.uid}`)
    } catch (error: any) {
      setResult(`Sign up error: ${error.message}`)
      console.error("Sign up error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setLoading(true)
    setResult("Attempting to sign in...")
    try {
      const user = await signInWithEmail(email, password)
      setResult(`Sign in successful! User ID: ${user.uid}`)
    } catch (error: any) {
      setResult(`Sign in error: ${error.message}`)
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Auth Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleSignUp} disabled={loading}>
                Sign Up
              </Button>
              <Button onClick={handleSignIn} disabled={loading}>
                Sign In
              </Button>
            </div>
            <div className="mt-4 p-4 border rounded">
              <h3 className="font-bold">Result:</h3>
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 