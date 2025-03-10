"use client"

import { useState, useRef, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Bell, Check, X, AlertCircle, Info, BarChart2, Users, MessageCircle, Search } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock API functions for the Engagement Manager agent
const mockTrackMentions = async (brandName: string, platforms: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate API delay
  
  // Return mock mentions data
  return [
    {
      id: 1,
      platform: "Twitter",
      username: "user123",
      profileImage: "/placeholder.svg?height=40&width=40",
      text: `I love using ${brandName}! Best product ever.`,
      sentiment: "positive",
      reach: 1200,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      platform: "Instagram",
      username: "influencer_official",
      profileImage: "/placeholder.svg?height=40&width=40",
      text: `Just tried ${brandName} for the first time. Not sure how I feel about it yet.`,
      sentiment: "neutral",
      reach: 15000,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      platform: "Facebook",
      username: "customer_feedback",
      profileImage: "/placeholder.svg?height=40&width=40",
      text: `Had issues with my ${brandName} order. Customer service was not helpful.`,
      sentiment: "negative",
      reach: 350,
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ];
};

const mockGenerateResponses = async (mentions: any[]) => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
  
  // Generate mock responses for each mention
  return mentions.map(mention => ({
    ...mention,
    response: mention.sentiment === "positive" 
      ? `Thank you for your kind words about our product! We're thrilled you're enjoying it. Have you tried our new features yet?` 
      : mention.sentiment === "neutral"
      ? `Thanks for giving us a try! We'd love to hear more about your experience. Is there anything specific you'd like to know more about?`
      : `We're sorry to hear about your experience. Please DM us with your order details, and we'll make it right for you immediately.`,
    responseStatus: "pending" // pending, approved, sent
  }));
};

function EngagementManagerAgentBase() {
  const [brandName, setBrandName] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter", "Instagram"]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("monitor");
  
  const handlePlatformToggle = useCallback((platform: string) => {
    setPlatforms(prevPlatforms => {
      if (prevPlatforms.includes(platform)) {
        return prevPlatforms.filter(p => p !== platform);
      } else {
        return [...prevPlatforms, platform];
      }
    });
  }, []);
  
  const handleTrackMentions = useCallback(async () => {
    if (!brandName.trim()) return;
    
    setLoading(true);
    try {
      const mentionsData = await mockTrackMentions(brandName, platforms);
      setMentions(mentionsData);
      setResponses([]);
    } catch (error) {
      console.error("Error tracking mentions:", error);
    }
    setLoading(false);
  }, [brandName, platforms]);
  
  const handleGenerateResponses = useCallback(async () => {
    if (mentions.length === 0) return;
    
    setGenerating(true);
    try {
      const generatedResponses = await mockGenerateResponses(mentions);
      setResponses(generatedResponses);
    } catch (error) {
      console.error("Error generating responses:", error);
    }
    setGenerating(false);
  }, [mentions]);
  
  const handleApproveResponse = useCallback((id: number) => {
    setResponses(prevResponses => 
      prevResponses.map(response => 
        response.id === id 
          ? { ...response, responseStatus: "approved" } 
          : response
      )
    );
  }, []);
  
  const handleSendResponses = useCallback(() => {
    setResponses(prevResponses => 
      prevResponses.map(response => 
        response.responseStatus === "approved" 
          ? { ...response, responseStatus: "sent" } 
          : response
      )
    );
  }, []);
  
  const handleEditResponse = useCallback((id: number, newResponse: string) => {
    setResponses(prevResponses => 
      prevResponses.map(response => 
        response.id === id 
          ? { ...response, response: newResponse } 
          : response
      )
    );
  }, []);
  
  const approvedCount = responses.filter(r => r.responseStatus === "approved").length;
  const sentCount = responses.filter(r => r.responseStatus === "sent").length;
  
  return (
    <Card className="col-span-2 overflow-hidden border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-800 dark:to-purple-700 rounded-t-lg pb-8">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-white" />
          <CardTitle className="text-white text-xl">Engagement Manager Agent</CardTitle>
        </div>
        <CardDescription className="text-indigo-50 mt-1">
          AI-powered strategist specializing in boosting engagement and fostering audience interaction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="bg-white dark:bg-gray-950 rounded-t-xl -mt-6 p-6 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-2">
            <TabsList className="grid w-full grid-cols-3 bg-indigo-50 dark:bg-indigo-950/30 p-1">
              <TabsTrigger 
                value="monitor" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
              >
                <Bell className="mr-2 h-4 w-4" />
                Monitor Mentions
              </TabsTrigger>
              <TabsTrigger 
                value="respond" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Respond
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
              >
                <Info className="mr-2 h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="monitor" className="space-y-6 pt-6">
              <div className="space-y-6">
                {/* Brand and Platform Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Monitor Brand Mentions</h3>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                      Step 1
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="brand-name" className="text-sm font-medium">Brand Name</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="brand-name"
                          placeholder="Enter your brand name..."
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="pl-10 border-indigo-200 focus:border-indigo-500 bg-indigo-50/30 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Select Platforms</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Twitter", "Instagram", "Facebook", "LinkedIn", "TikTok", "YouTube"].map((platform) => (
                          <div 
                            key={platform} 
                            className={cn(
                              "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                              platforms.includes(platform) 
                                ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-700 dark:bg-indigo-950/20" 
                                : "border-gray-200 dark:border-gray-800"
                            )}
                          >
                            <Switch 
                              checked={platforms.includes(platform)}
                              onCheckedChange={() => handlePlatformToggle(platform)}
                              id={`platform-${platform}`}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                            <Label htmlFor={`platform-${platform}`} className="cursor-pointer">{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Track Mentions Button */}
                <div className="pt-2">
                  <Button 
                    onClick={handleTrackMentions} 
                    disabled={loading || !brandName.trim()} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Tracking Mentions...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-5 w-5" />
                        Track Brand Mentions
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Mentions Display */}
                {mentions.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Mentions</h3>
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-none">
                        {mentions.length} mentions found
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {mentions.map((mention) => (
                        <div 
                          key={mention.id} 
                          className="border border-indigo-100 dark:border-indigo-900 rounded-md overflow-hidden bg-white dark:bg-gray-950 shadow-sm"
                        >
                          <div className="bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={cn(
                                  "capitalize",
                                  mention.platform === "Twitter" ? "bg-blue-500 hover:bg-blue-500" :
                                  mention.platform === "Instagram" ? "bg-pink-500 hover:bg-pink-500" :
                                  mention.platform === "Facebook" ? "bg-blue-700 hover:bg-blue-700" :
                                  "bg-gray-500 hover:bg-gray-500"
                                )}
                              >
                                {mention.platform}
                              </Badge>
                              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">@{mention.username}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                mention.sentiment === "positive" ? "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400" :
                                mention.sentiment === "neutral" ? "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950/20 dark:text-gray-400" :
                                "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                              )}
                            >
                              {mention.sentiment}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <div className="flex gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={mention.profileImage} alt={mention.username} />
                                <AvatarFallback>{mention.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">{mention.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(mention.timestamp).toLocaleString()} • Reach: {mention.reach.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        onClick={() => setActiveTab("respond")} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Generate Responses
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="respond" className="space-y-6 pt-6">
              {mentions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Bell className="h-16 w-16 mx-auto text-indigo-300" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">No Mentions Found</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Track brand mentions first to generate personalized responses.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("monitor")} 
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Track Mentions
                  </Button>
                </div>
              ) : responses.length === 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Generate Responses</h3>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                      Step 2
                    </Badge>
                  </div>
                  
                  <div className="border border-indigo-100 dark:border-indigo-900 rounded-md p-4 bg-indigo-50/30 dark:bg-indigo-950/10">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Generate personalized responses to {mentions.length} brand mentions across {platforms.length} platforms.
                    </p>
                    <Button 
                      onClick={handleGenerateResponses} 
                      disabled={generating} 
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Responses...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Generate AI Responses
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Review & Approve Responses</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                        {approvedCount}/{responses.length} Approved
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                        {sentCount}/{responses.length} Sent
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div 
                        key={response.id} 
                        className="border border-indigo-100 dark:border-indigo-900 rounded-md overflow-hidden bg-white dark:bg-gray-950 shadow-sm"
                      >
                        <div className="bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={cn(
                                "capitalize",
                                response.platform === "Twitter" ? "bg-blue-500 hover:bg-blue-500" :
                                response.platform === "Instagram" ? "bg-pink-500 hover:bg-pink-500" :
                                response.platform === "Facebook" ? "bg-blue-700 hover:bg-blue-700" :
                                "bg-gray-500 hover:bg-gray-500"
                              )}
                            >
                              {response.platform}
                            </Badge>
                            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">@{response.username}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              response.responseStatus === "pending" ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-400" :
                              response.responseStatus === "approved" ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-400" :
                              "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
                            )}
                          >
                            {response.responseStatus === "pending" ? "Pending Approval" : 
                             response.responseStatus === "approved" ? "Approved" : "Sent"}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={response.profileImage} alt={response.username} />
                              <AvatarFallback>{response.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm">{response.text}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(response.timestamp).toLocaleString()} • Reach: {response.reach.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pl-12 border-l-2 border-indigo-200 dark:border-indigo-800">
                            <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">AI-Generated Response:</h4>
                            <Textarea
                              value={response.response}
                              onChange={(e) => handleEditResponse(response.id, e.target.value)}
                              className="min-h-[80px] border-indigo-200 focus:border-indigo-500 bg-indigo-50/30 focus:ring-indigo-500/20 resize-none text-sm"
                              disabled={response.responseStatus === "sent"}
                            />
                            
                            {response.responseStatus === "pending" && (
                              <div className="flex justify-end mt-2">
                                <Button 
                                  onClick={() => handleApproveResponse(response.id)} 
                                  size="sm"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                  <Check className="mr-2 h-3 w-3" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {approvedCount > 0 && sentCount < responses.length && (
                    <div className="pt-2">
                      <Button 
                        onClick={handleSendResponses} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send {approvedCount} Approved Responses
                      </Button>
                    </div>
                  )}
                  
                  {sentCount === responses.length && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-md p-4 flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">All Responses Sent</p>
                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                          All approved responses have been successfully sent to their respective platforms.
                        </p>
                        <Button 
                          onClick={() => setActiveTab("monitor")} 
                          className="mt-3 bg-green-500 hover:bg-green-600 text-white"
                          size="sm"
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Monitor New Mentions
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">About Engagement Manager Agent</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    A professional digital marketing strategist specializing in boosting engagement and fostering audience interaction. Ensures a high level of responsiveness and engagement across all social media platforms.
                  </p>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-md p-4">
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-200">Key Capabilities:</h4>
                  <ul className="mt-3 space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <span>Monitors brand mentions, comments, and DMs across all social platforms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <span>Generates personalized and engaging responses to user interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <span>Maintains a fast response time to improve follower interaction and retention</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <span>Analyzes engagement patterns to optimize response strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-indigo-500 mt-0.5" />
                      <span>Identifies and prioritizes high-value interactions from key audience segments</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Integrated Tools:</h4>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="border border-indigo-100 dark:border-indigo-900 rounded-md p-3 text-center bg-white dark:bg-gray-950">
                      <p className="text-indigo-700 dark:text-indigo-300 font-medium">ManyChat</p>
                    </div>
                    <div className="border border-indigo-100 dark:border-indigo-900 rounded-md p-3 text-center bg-white dark:bg-gray-950">
                      <p className="text-indigo-700 dark:text-indigo-300 font-medium">ChatGPT Bot</p>
                    </div>
                    <div className="border border-indigo-100 dark:border-indigo-900 rounded-md p-3 text-center bg-white dark:bg-gray-950">
                      <p className="text-indigo-700 dark:text-indigo-300 font-medium">Brand24</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export const EngagementManagerAgent = memo(EngagementManagerAgentBase); 