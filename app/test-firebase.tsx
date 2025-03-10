"use client"

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function TestFirebase() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    try {
      if (auth) {
        setStatus('Firebase auth initialized successfully')
      } else {
        setStatus('Firebase auth is undefined')
      }
    } catch (error: any) {
      setStatus(`Error initializing Firebase: ${error.message}`)
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Firebase Test</h1>
      <p className="mt-2">{status}</p>
    </div>
  )
} 