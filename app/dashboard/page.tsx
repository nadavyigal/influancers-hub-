"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, TrendingUp, Instagram, Youtube, Music2, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading && user) {
      setIsLoading(false)
    }
  }, [loading, user])

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your influencer metrics.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+0.8%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Content Reach</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128.5K</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+12.3%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Performance by Platform</CardTitle>
            <CardDescription>Your engagement metrics across social platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center bg-muted/40 rounded-md">
              <p className="text-muted-foreground text-sm">Performance chart will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Followers by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 bg-pink-100 dark:bg-pink-900/20 p-2 rounded-md">
                  <Instagram className="h-5 w-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-sm font-medium">24.5K</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 bg-red-100 dark:bg-red-900/20 p-2 rounded-md">
                  <Youtube className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">YouTube</p>
                    <p className="text-sm font-medium">12.8K</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <Music2 className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">TikTok</p>
                    <p className="text-sm font-medium">7.9K</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <Card className="border-border/40">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="border-border/40">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-md mr-4" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 