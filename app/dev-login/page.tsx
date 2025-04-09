"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { isFirebaseReady } from '@/lib/firebase'

export default function DevLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { bypassAuth } = useAuth()
  const { toast } = useToast()

  const handleDevLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = bypassAuth()
      console.log('Development login successful with mock auth:', result)
      
      toast({
        title: 'Development Login',
        description: 'Successfully logged in with development account',
      })
      
      // Redirect to dashboard
      void router.push('/dashboard')
    } catch (error: any) {
      console.error('Development login error:', error)
      setError(error?.message || 'Failed to login with development account')
      
      toast({
        title: 'Error',
        description: 'Failed to login with development account',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader className="bg-yellow-50 border-b border-yellow-100">
          <CardTitle>Development Login</CardTitle>
          <CardDescription>Use this page for local testing only</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm">
              <p>Firebase Ready: {isFirebaseReady() ? 'Yes' : 'No'}</p>
              <p className="mt-1">Environment: {process.env.NODE_ENV}</p>
              <p className="mt-1">Test Mode: {process.env.NEXT_PUBLIC_FIREBASE_TEST_MODE === 'true' ? 'Enabled' : 'Disabled'}</p>
            </div>
            
            <Button 
              onClick={handleDevLogin} 
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              {loading ? 'Logging in...' : 'Development Login'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-yellow-50 border-t border-yellow-100 text-xs text-center flex justify-center">
          For local development use only. Not for production.
        </CardFooter>
      </Card>
    </div>
  )
} 