"use client"

import { useState, useEffect } from 'react'
import { auth, isFirebaseReady } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export default function TestPage() {
  const [status, setStatus] = useState('Checking Firebase status...')
  const { bypassAuth } = useAuth()

  useEffect(() => {
    try {
      if (auth) {
        setStatus('Firebase auth initialized successfully')
      } else {
        setStatus('Firebase auth is undefined')
      }
    } catch (error: any) {
      setStatus(`Error checking Firebase: ${error.message}`)
    }
  }, [])

  const testBypassAuth = () => {
    try {
      bypassAuth()
      setStatus('Successfully created mock auth')
    } catch (error: any) {
      setStatus(`Error testing bypass auth: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Firebase Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded bg-slate-50">
            <h3 className="font-medium mb-2">Firebase Status:</h3>
            <p className="text-sm">{status}</p>
            <p className="text-sm mt-2">
              isFirebaseReady: {isFirebaseReady() ? 'Yes' : 'No'}
            </p>
          </div>
          
          <Button onClick={testBypassAuth}>
            Test Bypass Auth
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 