"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, RefreshCw, DollarSign, TrendingUp, ShoppingBag, Users } from "lucide-react"
import { SocialMediaConnector } from "./social-media-connector"
import { MonetizationStrategies } from "./monetization-strategies"
import { ContentAnalysis } from "./content-analysis"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { runMonetizationAgency } from "@/lib/agency-swarm/monetization-agency"

export function MonetizationDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("connect")
  const [isLoading, setIsLoading] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([])
  const [contentAnalyzed, setContentAnalyzed] = useState(false)
  const [strategies, setStrategies] = useState<any[]>([])

  // Check if user has connected accounts
  useEffect(() => {
    if (user) {
      // This would normally fetch from the database
      // For demo purposes, we'll use mock data
      setConnectedAccounts(["instagram"])
    }
  }, [user])

  const handleAnalyzeContent = async () => {
    if (connectedAccounts.length === 0) {
      toast({
        title: "No accounts connected",
        description: "Please connect at least one social media account first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // In a real implementation, this would call the backend API
      // For demo purposes, we'll use a timeout to simulate API call
      setTimeout(() => {
        setContentAnalyzed(true)
        setActiveTab("analysis")
        setIsLoading(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Error analyzing content",
        description: "There was an error analyzing your content. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleGenerateStrategies = async () => {
    if (!contentAnalyzed) {
      toast({
        title: "Content not analyzed",
        description: "Please analyze your content first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // In a real implementation, this would call the monetization agency
      const result = await runMonetizationAgency()
      setStrategies(result.strategies)
      setActiveTab("strategies")
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error generating strategies",
        description: "There was an error generating monetization strategies. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <DollarSign className="h-4 w-4" />
        <AlertTitle>Monetization Hub</AlertTitle>
        <AlertDescription>
          Connect your social media accounts, analyze your content, and discover personalized monetization strategies.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="analysis" disabled={connectedAccounts.length === 0}>Analysis</TabsTrigger>
          <TabsTrigger value="strategies" disabled={!contentAnalyzed}>Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Accounts</CardTitle>
              <CardDescription>
                Connect your social media accounts to analyze your content and generate monetization strategies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SocialMediaConnector 
                connectedAccounts={connectedAccounts} 
                setConnectedAccounts={setConnectedAccounts} 
              />
              
              {connectedAccounts.length > 0 && (
                <Button 
                  onClick={handleAnalyzeContent} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Analyze Content
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>
                Review your content analysis and generate monetization strategies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContentAnalysis />
              
              <Button 
                onClick={handleGenerateStrategies} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Strategies...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Monetization Strategies
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Strategies</CardTitle>
              <CardDescription>
                Personalized monetization strategies based on your content and audience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonetizationStrategies strategies={strategies} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 