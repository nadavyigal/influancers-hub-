"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Facebook, Twitter, Linkedin, Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SocialMediaConnectorProps {
  connectedAccounts: string[]
  setConnectedAccounts: (accounts: string[]) => void
}

export function SocialMediaConnector({ connectedAccounts, setConnectedAccounts }: SocialMediaConnectorProps) {
  const { toast } = useToast()
  const [connecting, setConnecting] = useState<string | null>(null)

  const socialPlatforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
  ]

  const handleConnect = async (platformId: string) => {
    if (connectedAccounts.includes(platformId)) {
      // Disconnect
      setConnectedAccounts(connectedAccounts.filter(id => id !== platformId))
      toast({
        title: "Account disconnected",
        description: `Your ${platformId} account has been disconnected.`,
      })
      return
    }

    // Connect
    setConnecting(platformId)
    
    try {
      // In a real implementation, this would initiate OAuth flow
      // For demo purposes, we'll use a timeout to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setConnectedAccounts([...connectedAccounts, platformId])
      toast({
        title: "Account connected",
        description: `Your ${platformId} account has been successfully connected.`,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Failed to connect your ${platformId} account. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {socialPlatforms.map((platform) => {
        const isConnected = connectedAccounts.includes(platform.id)
        const isConnecting = connecting === platform.id
        
        return (
          <Card key={platform.id} className={`border-2 ${isConnected ? 'border-primary' : 'border-border'}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${platform.color}`}>
                  <platform.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">{platform.name}</div>
                  {isConnected && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button 
                variant={isConnected ? "outline" : "default"} 
                size="sm"
                onClick={() => handleConnect(platform.id)}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <Check className="mr-2 h-3 w-3" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 