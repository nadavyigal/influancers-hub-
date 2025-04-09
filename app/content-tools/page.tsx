"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChange, getUserProfile } from "@/lib/firebase-auth"
import { uploadContentMedia, createContent } from "@/lib/firebase-content"
import { generateHashtags } from "@/lib/openai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Upload, Sparkles, Instagram, Send, Image, Video, FileVideo, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import dynamic from 'next/dynamic'

// Dynamically import the ToolsAndAutomations component with SSR disabled
const DynamicToolsAndAutomations = dynamic(
  () => import('@/components/tools-and-automations').then(mod => mod.ToolsAndAutomations),
  { 
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Tools & Automations...</span>
      </div>
    ),
    ssr: false
  }
)

// Dynamically import the AgentDefinitionDisplay component with SSR disabled
const DynamicAgentDefinitionDisplay = dynamic(
  () => import('@/components/agent-definition-display').then(mod => mod.AgentDefinitionDisplay),
  { ssr: false }
)

// Dynamically import the AgencyFlowDiagram component with SSR disabled
const DynamicAgencyFlowDiagram = dynamic(
  () => import('@/components/agency-flow-diagram'),
  { 
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Agency Flow Diagram...</span>
      </div>
    ),
    ssr: false 
  }
)

// Agent definition code snippets
const contentSchedulerCode = `from agency_swarm import Agent

content_scheduler = Agent(
    name="Content Scheduler",
    description="A professional digital marketing specialist optimizing content scheduling to maximize audience growth and engagement. Uses AI to determine the best posting times and automate content distribution, but requires user approval before posting.",
    instructions="""
    1. Analyze past engagement data to determine the best time to post.
    2. Accept content input either manually or from the Content Strategist Agent.
    3. Generate a **proposed posting schedule** for the user's approval.
    4. **Wait for explicit user approval** before proceeding with auto-posting.
    5. Once approved, post the content at the scheduled time across multiple platforms.
    6. Ensure maximum reach and engagement by optimizing posting frequency.
    """,
    tools=[SprinklrTool, BufferTool, HootsuiteTool],  # Define tool classes
    temperature=0.6,
    max_prompt_tokens=2000
)`

const engagementManagerCode = `from agency_swarm import Agent

engagement_manager = Agent(
    name="Engagement Manager",
    description="A professional digital marketing strategist specializing in boosting engagement and fostering audience interaction. Ensures a high level of responsiveness and engagement across all social media platforms.",
    instructions="""
    1. Monitor brand mentions, comments, and DMs across all social platforms.
    2. Generate personalized and engaging responses to user interactions.
    3. Maintain a fast response time to improve follower interaction and retention.
    4. Analyze engagement patterns to optimize response strategies.
    5. Identify and prioritize high-value interactions from key audience segments.
    """,
    tools=[ManyChatTool, ChatGPTBotTool, Brand24Tool],  # Define tool classes
    temperature=0.5,
    max_prompt_tokens=2000
)`

const contentEditorCode = `from agency_swarm import Agent

content_editor = Agent(
    name="Content Editor",
    description="A professional digital marketing expert skilled in AI-driven video and image editing. Focuses on enhancing content quality to boost engagement and audience growth.",
    instructions="""
    1. Process and enhance visual content for maximum engagement.
    2. Auto-edit reels and TikTok videos for optimal performance.
    3. Generate high-performing thumbnails optimized for better click-through rates.
    4. Apply professional-grade enhancements to improve content quality.
    5. Adapt content to different platforms and aspect ratios as needed.
    """,
    tools=[RunwayMLTool, CanvaAITool, AdobeSenseiTool],  # Define tool classes
    temperature=0.5,
    max_prompt_tokens=2000
)`

const agencyFlowCode = `from agency_swarm import Agency

agency = Agency([
    content_strategist,
    content_scheduler,
    engagement_manager,
    content_editor,
    [content_strategist, content_scheduler],  # Captions pass to Scheduler
    [content_scheduler, engagement_manager],  # Scheduled content passes to Engagement
    [content_editor, content_scheduler]  # Edited content passes to Scheduling
])`

export default function ContentToolsPage() {
  // Create Content state
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentType, setContentType] = useState("reel")
  const [styleType, setStyleType] = useState("Consistency")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [hashtagCount, setHashtagCount] = useState(5)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [useAI, setUseAI] = useState(true)
  const [publishToInstagram, setPublishToInstagram] = useState(false)
  
  // Tools state
  const { bypassAuth } = useAuth()
  const [activeTab, setActiveTab] = useState("tools")
  const [mounted, setMounted] = useState(false)
  const [authBypassed, setAuthBypassed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const router = useRouter()

  // Use useCallback to prevent the function from being recreated on each render
  const handleBypassAuth = useCallback(() => {
    if (!authBypassed) {
      try {
        console.log("Bypassing auth for tools page...");
        const result = bypassAuth();
        if (result && result.user) {
          setUser(result.profile);
          setAuthBypassed(true);
          console.log("Auth bypassed successfully");
        } else {
          console.error("Bypass auth returned invalid result");
          setError("Failed to bypass authentication - invalid result");
        }
      } catch (err) {
        console.error("Error bypassing auth:", err);
        setError(err instanceof Error ? err.message : "Failed to bypass authentication");
      }
    }
  }, [bypassAuth, authBypassed])

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthStateChange(async (authUser) => {
        if (authUser) {
          try {
            console.log("User authenticated, fetching profile");
            const profile = await getUserProfile(authUser.uid);
            setUser(profile);
            // Only bypass auth if we have a valid user
            handleBypassAuth();
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setError(error instanceof Error ? error.message : "Failed to fetch user profile");
          }
        } else {
          console.log("No authenticated user, redirecting to login");
          router.push("/login");
        }
        setLoading(false);
        setMounted(true);
      });
    } catch (err) {
      console.error("Error setting up auth state change listener:", err);
      setError(err instanceof Error ? err.message : "Failed to set up authentication");
      setLoading(false);
      setMounted(true);
    }

    return () => unsubscribe();
  }, [router, handleBypassAuth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setMediaFiles(files)
      
      // Create preview for the first file
      const file = files[0]
      const reader = new FileReader()
      
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
      }
      
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateHashtags = async () => {
    if (!description) {
      toast({
        title: "Error",
        description: "Please enter a description first",
        variant: "destructive",
      })
      return
    }
    
    try {
      setProcessing(true)
      const generatedHashtags = await generateHashtags(description, hashtagCount)
      setHashtags(generatedHashtags)
      toast({
        title: "Success",
        description: `Generated ${generatedHashtags.length} hashtags`,
      })
    } catch (error) {
      console.error("Error generating hashtags:", error)
      toast({
        title: "Error",
        description: "Failed to generate hashtags",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create content",
        variant: "destructive",
      })
      return
    }
    
    if (!title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    try {
      setUploading(true)
      
      // Upload media files
      const uploadedUrls: string[] = []
      
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const url = await uploadContentMedia(user.uid, file)
          uploadedUrls.push(url)
        }
      }
      
      // Create content item
      const contentId = await createContent({
        userId: user.uid,
        title,
        description,
        contentType,
        styleType,
        mediaUrls: uploadedUrls,
        hashtags,
        status: "processing",
      })
      
      toast({
        title: "Success",
        description: "Content created successfully",
      })
      
      // Redirect to content detail page
      router.push(`/content/${contentId}`)
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRetry = () => {
    console.log("Retrying Tools section load...");
    setRetryCount(prev => prev + 1);
    setError(null);
    // Force remount of the component
    setMounted(false);
    setAuthBypassed(false);
    setTimeout(() => setMounted(true), 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Content Tools</h1>
      
      {/* Create Content Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Create New Content</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                  <CardDescription>Enter the details for your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter a title for your content"
                      disabled={uploading}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Enter a description or caption for your content"
                      disabled={uploading}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label>Content Type</Label>
                    <RadioGroup 
                      value={contentType} 
                      onValueChange={setContentType}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image" id="image" />
                        <Label htmlFor="image" className="flex items-center">
                          <Image className="h-4 w-4 mr-1" />
                          Image
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video" className="flex items-center">
                          <Video className="h-4 w-4 mr-1" />
                          Video
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="carousel" id="carousel" />
                        <Label htmlFor="carousel" className="flex items-center">
                          <Image className="h-4 w-4 mr-1" />
                          Carousel
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reel" id="reel" />
                        <Label htmlFor="reel" className="flex items-center">
                          <FileVideo className="h-4 w-4 mr-1" />
                          Reel
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label>Style Type</Label>
                    <RadioGroup 
                      value={styleType} 
                      onValueChange={setStyleType}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Consistency" id="consistency" />
                        <Label htmlFor="consistency">Consistency (Brand Aligned)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="New Styles" id="new-styles" />
                        <Label htmlFor="new-styles">New Styles (Creative)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Media Upload</CardTitle>
                  <CardDescription>Upload images or videos for your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid place-items-center border-2 border-dashed rounded-lg p-12">
                    {mediaPreview ? (
                      <div className="space-y-4 w-full">
                        {mediaPreview.startsWith('data:image') ? (
                          <img 
                            src={mediaPreview} 
                            alt="Preview" 
                            className="max-h-[300px] mx-auto rounded-lg"
                          />
                        ) : (
                          <video 
                            src={mediaPreview} 
                            controls 
                            className="max-h-[300px] w-full rounded-lg"
                          />
                        )}
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setMediaFiles([])
                            setMediaPreview(null)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Drag and drop files here, or click to browse
                        </p>
                        <Input
                          id="media-upload"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          disabled={uploading}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('media-upload')?.click()}
                          className="mt-4"
                          disabled={uploading}
                        >
                          Select Files
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>AI Enhancements</CardTitle>
                  <CardDescription>Use AI to enhance your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
                    <Label htmlFor="use-ai">Use AI to enhance content</Label>
                  </div>
                  
                  {useAI && (
                    <>
                      <div>
                        <Label htmlFor="hashtag-count">Number of Hashtags: {hashtagCount}</Label>
                        <Slider
                          id="hashtag-count"
                          min={0}
                          max={30}
                          step={1}
                          value={[hashtagCount]}
                          onValueChange={(value) => setHashtagCount(value[0])}
                          disabled={uploading || processing}
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={handleGenerateHashtags}
                        disabled={uploading || processing || !description}
                        className="w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Hashtags
                      </Button>
                      
                      {hashtags.length > 0 && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium mb-2">Generated Hashtags:</p>
                          <div className="flex flex-wrap gap-1">
                            {hashtags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                  <CardDescription>Choose where to publish your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="publish-instagram" 
                      checked={publishToInstagram} 
                      onCheckedChange={setPublishToInstagram} 
                    />
                    <Label htmlFor="publish-instagram" className="flex items-center">
                      <Instagram className="h-4 w-4 mr-1" />
                      Publish to Instagram
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={uploading}
                  >
                    {uploading ? (
                      "Creating Content..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Create Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
      
      {/* Tools Section */}
      <div className="mt-12 pt-12 border-t">
        <h2 className="text-2xl font-semibold mb-6">AI Tools & Automations</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={handleRetry} className="mt-4">
              Retry Loading
            </Button>
          </Alert>
        )}
        
        {mounted && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="tools">Tools & Automations</TabsTrigger>
              <TabsTrigger value="definitions">Agent Definitions</TabsTrigger>
              <TabsTrigger value="flow">Agency Flow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools">
              <DynamicToolsAndAutomations />
            </TabsContent>
            
            <TabsContent value="definitions">
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">Agent Definitions</h3>
                <p className="text-muted-foreground mb-6">
                  Code definitions for AI agents that can be integrated into your applications
                </p>
                
                <div className="grid gap-6">
                  <DynamicAgentDefinitionDisplay 
                    title="Content Scheduler Agent"
                    description="Agent definition for scheduling and automating content distribution"
                    code={contentSchedulerCode}
                  />
                  
                  <DynamicAgentDefinitionDisplay 
                    title="Engagement Manager Agent"
                    description="Agent definition for monitoring and responding to brand mentions"
                    code={engagementManagerCode}
                  />
                  
                  <DynamicAgentDefinitionDisplay 
                    title="Content Editor Agent"
                    description="Agent definition for AI-driven video and image editing"
                    code={contentEditorCode}
                  />
                  
                  <DynamicAgentDefinitionDisplay 
                    title="Agency Flow Definition"
                    description="Definition of how agents interact with each other in the workflow"
                    code={agencyFlowCode}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="flow">
              <div className="py-6">
                <h3 className="text-xl font-semibold mb-2">Agency Flow</h3>
                <p className="text-muted-foreground mb-6">
                  Visual representation of how agents interact with each other in the workflow
                </p>
                
                {mounted && <DynamicAgencyFlowDiagram />}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
} 