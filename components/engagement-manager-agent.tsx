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
  
  // Generate mock mentions data
  const mockMentions = [
    {
      id: "1",
      platform: "Twitter",
      username: "customer_happy",
      content: `I absolutely love ${brandName}'s new product line! The quality is amazing. #happycustomer`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sentiment: "positive",
      engagement: 42,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    {
      id: "2",
      platform: "Instagram",
      username: "product_reviewer",
      content: `Just tried ${brandName} for the first time. It's decent but a bit overpriced compared to competitors.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      sentiment: "neutral",
      engagement: 18,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy"
    },
    {
      id: "3",
      platform: "Facebook",
      username: "angry_customer",
      content: `Terrible customer service from ${brandName}! I've been waiting for a response for 3 days now. Will not recommend.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      sentiment: "negative",
      engagement: 31,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max"
    },
    {
      id: "4",
      platform: "Twitter",
      username: "tech_enthusiast",
      content: `${brandName}'s latest feature update is a game-changer! So intuitive and powerful.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      sentiment: "positive",
      engagement: 76,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
    },
    {
      id: "5",
      platform: "Instagram",
      username: "casual_user",
      content: `Been using ${brandName} for about a week now. It's alright, does what it says.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      sentiment: "neutral",
      engagement: 9,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"
    }
  ];
  
  return mockMentions;
};

const mockGenerateResponses = async (mentions: any[]) => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
  
  // Generate mock responses based on sentiment
  return mentions.map(mention => {
    let response = "";
    
    if (mention.sentiment === "positive") {
      response = `Thank you so much for your kind words, @${mention.username}! We're thrilled to hear you're enjoying our products. Your support means the world to us! 💯`;
    } else if (mention.sentiment === "neutral") {
      response = `We appreciate your feedback, @${mention.username}. We'd love to hear more about your experience and how we can make it even better. Feel free to DM us anytime!`;
    } else {
      response = `We're sorry to hear about your experience, @${mention.username}. This isn't the standard we aim for. Please DM us with more details so we can make things right.`;
    }
    
    return {
      ...mention,
      response,
      status: "pending" // pending, sent, failed
    };
  });
};

interface EngagementManagerAgentProps {
  apiKey?: string;
}

function EngagementManagerAgentBase({ apiKey }: EngagementManagerAgentProps) {
  const [brandName, setBrandName] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter", "Instagram"]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState(false);
  const [activeTab, setActiveTab] = useState("mentions");
  const [autoRespond, setAutoRespond] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  
  // Track mentions
  const handleTrackMentions = async () => {
    if (!brandName) return;
    
    setLoading(true);
    try {
      const data = await mockTrackMentions(brandName, platforms);
      setMentions(data);
    } catch (error) {
      console.error("Error tracking mentions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate responses
  const handleGenerateResponses = async () => {
    if (mentions.length === 0) return;
    
    setResponding(true);
    try {
      const data = await mockGenerateResponses(mentions);
      setResponses(data);
      setActiveTab("responses");
    } catch (error) {
      console.error("Error generating responses:", error);
    } finally {
      setResponding(false);
    }
  };
  
  // Toggle platform selection
  const togglePlatform = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  // Send a response
  const sendResponse = (id: string) => {
    setResponses(prev => 
      prev.map(response => 
        response.id === id
          ? { ...response, status: "sent" }
          : response
      )
    );
  };
  
  // Filter mentions/responses
  const filteredItems = (items: any[]) => {
    return items.filter(item => {
      if (filterSentiment && item.sentiment !== filterSentiment) return false;
      if (filterPlatform && item.platform !== filterPlatform) return false;
      return true;
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterSentiment(null);
    setFilterPlatform(null);
  };
  
  // Get sentiment badge color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-500";
      case "neutral": return "bg-blue-500";
      case "negative": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-500" />
          Engagement Manager
        </CardTitle>
        <CardDescription>
          Monitor brand mentions across social platforms and respond to customer engagement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <Label htmlFor="brand-name">Brand or Product Name</Label>
              <Input
                id="brand-name"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1">
              <Label className="mb-2 block">Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {["Twitter", "Instagram", "Facebook"].map(platform => (
                  <Badge
                    key={platform}
                    variant={platforms.includes(platform) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      platforms.includes(platform) && "bg-blue-500 hover:bg-blue-600"
                    )}
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleTrackMentions} 
              disabled={!brandName || loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Mentions
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-respond"
                checked={autoRespond}
                onCheckedChange={setAutoRespond}
              />
              <Label htmlFor="auto-respond">Auto-respond</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Tabs Section */}
        {mentions.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="mentions" className="relative">
                  Mentions
                  {mentions.length > 0 && (
                    <Badge className="ml-2 bg-blue-500">{mentions.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="responses" className="relative">
                  Responses
                  {responses.length > 0 && (
                    <Badge className="ml-2 bg-green-500">{responses.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Badge
                    variant={filterSentiment === "positive" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      filterSentiment === "positive" && "bg-green-500"
                    )}
                    onClick={() => setFilterSentiment(prev => prev === "positive" ? null : "positive")}
                  >
                    Positive
                  </Badge>
                  <Badge
                    variant={filterSentiment === "neutral" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      filterSentiment === "neutral" && "bg-blue-500"
                    )}
                    onClick={() => setFilterSentiment(prev => prev === "neutral" ? null : "neutral")}
                  >
                    Neutral
                  </Badge>
                  <Badge
                    variant={filterSentiment === "negative" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      filterSentiment === "negative" && "bg-red-500"
                    )}
                    onClick={() => setFilterSentiment(prev => prev === "negative" ? null : "negative")}
                  >
                    Negative
                  </Badge>
                </div>
                
                {(filterSentiment || filterPlatform) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            <TabsContent value="mentions" className="space-y-4 mt-4">
              {mentions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No mentions found. Try tracking mentions first.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems(mentions).map(mention => (
                    <div 
                      key={mention.id}
                      className="rounded-lg border p-4 transition-all hover:bg-accent/50"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={mention.avatar} />
                          <AvatarFallback>{mention.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">@{mention.username}</span>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "text-white",
                                  mention.platform === "Twitter" ? "bg-blue-400" :
                                  mention.platform === "Instagram" ? "bg-purple-500" :
                                  mention.platform === "Facebook" ? "bg-blue-600" : "bg-gray-500"
                                )}
                              >
                                {mention.platform}
                              </Badge>
                              <Badge className={cn("text-white", getSentimentColor(mention.sentiment))}>
                                {mention.sentiment}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(mention.timestamp)}
                            </span>
                          </div>
                          
                          <p>{mention.content}</p>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                {mention.engagement}
                              </span>
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={handleGenerateResponses}
                              disabled={responding}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              {responding ? (
                                <>
                                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Generate Response"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="responses" className="space-y-4 mt-4">
              {responses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No responses generated yet. Generate responses first.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems(responses).map(response => (
                    <div 
                      key={response.id}
                      className="rounded-lg border p-4 transition-all hover:bg-accent/50"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={response.avatar} />
                          <AvatarFallback>{response.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">@{response.username}</span>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "text-white",
                                  response.platform === "Twitter" ? "bg-blue-400" :
                                  response.platform === "Instagram" ? "bg-purple-500" :
                                  response.platform === "Facebook" ? "bg-blue-600" : "bg-gray-500"
                                )}
                              >
                                {response.platform}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(response.timestamp)}
                            </span>
                          </div>
                          
                          <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm">{response.content}</p>
                          </div>
                          
                          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm">{response.response}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-white", getSentimentColor(response.sentiment))}>
                                {response.sentiment}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {response.status === "sent" ? "Response sent" : "Ready to send"}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <Info className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              
                              <Button
                                size="sm"
                                onClick={() => sendResponse(response.id)}
                                disabled={response.status === "sent"}
                                className={cn(
                                  "h-8",
                                  response.status === "sent" ? "bg-green-500 hover:bg-green-500 cursor-default" : "bg-blue-500 hover:bg-blue-600"
                                )}
                              >
                                {response.status === "sent" ? (
                                  <>
                                    <Check className="mr-2 h-3 w-3" />
                                    Sent
                                  </>
                                ) : (
                                  "Send Response"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  Engagement Analytics
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">{mentions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Mentions</div>
                  </div>
                  
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {mentions.filter(m => m.sentiment === "positive").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Positive Mentions</div>
                  </div>
                  
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {mentions.filter(m => m.sentiment === "negative").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Negative Mentions</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Sentiment Distribution</h4>
                  <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {mentions.length > 0 && (
                      <>
                        <div 
                          className="h-full bg-green-500 float-left"
                          style={{ 
                            width: `${(mentions.filter(m => m.sentiment === "positive").length / mentions.length) * 100}%` 
                          }}
                        />
                        <div 
                          className="h-full bg-blue-500 float-left"
                          style={{ 
                            width: `${(mentions.filter(m => m.sentiment === "neutral").length / mentions.length) * 100}%` 
                          }}
                        />
                        <div 
                          className="h-full bg-red-500 float-left"
                          style={{ 
                            width: `${(mentions.filter(m => m.sentiment === "negative").length / mentions.length) * 100}%` 
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Positive</span>
                    <span>Neutral</span>
                    <span>Negative</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Platform Distribution</h4>
                  <div className="space-y-2">
                    {["Twitter", "Instagram", "Facebook"].map(platform => {
                      const count = mentions.filter(m => m.platform === platform).length;
                      const percentage = mentions.length > 0 ? (count / mentions.length) * 100 : 0;
                      
                      return (
                        <div key={platform} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{platform}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div 
                              className={cn(
                                "h-full",
                                platform === "Twitter" ? "bg-blue-400" :
                                platform === "Instagram" ? "bg-purple-500" :
                                "bg-blue-600"
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Empty State */}
        {mentions.length === 0 && !loading && (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No mentions tracked yet</h3>
            <p className="text-muted-foreground mb-4">
              Enter your brand name and track mentions to see what people are saying
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const EngagementManagerAgent = memo(EngagementManagerAgentBase); 