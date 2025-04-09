"use client"

import { useEffect, useState, useCallback } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import dynamic from 'next/dynamic'

// Content Scheduler agent definition code
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

// Engagement Manager agent definition code
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

// Content Editor agent definition code
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

// Agency Flow Definition code
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

// Dynamically import components with error handling
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

export default function ToolsPage() {
  const { bypassAuth, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("tools")
  const [mounted, setMounted] = useState(false)
  const [authBypassed, setAuthBypassed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // Use useCallback to prevent the function from being recreated on each render
  const handleBypassAuth = useCallback(() => {
    if (!authBypassed) {
      try {
        console.log("Bypassing auth for tools page...");
        bypassAuth()
        setAuthBypassed(true)
        console.log("Auth bypassed successfully");
      } catch (err) {
        console.error("Error bypassing auth:", err);
        setError(err instanceof Error ? err.message : "Failed to bypass authentication");
      }
    }
  }, [bypassAuth, authBypassed])
  
  // Automatically bypass authentication when the page loads, but only once
  useEffect(() => {
    try {
      console.log("Tools page mounting...");
      setMounted(true)
      handleBypassAuth()
      console.log("Tools page mounted successfully");
    } catch (err) {
      console.error("Error in Tools page mount:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, [handleBypassAuth])

  // Debug logging
  useEffect(() => {
    console.log("Tools page state:", {
      loading,
      mounted,
      authBypassed,
      error,
      retryCount,
      activeTab
    });
  }, [loading, mounted, authBypassed, error, retryCount, activeTab]);

  const handleRetry = () => {
    console.log("Retrying Tools page load...");
    setRetryCount(prev => prev + 1);
    setError(null);
    // Force remount of the component
    setMounted(false);
    setAuthBypassed(false);
    setTimeout(() => setMounted(true), 100);
  };
  
  // Show loading indicator while authentication is being bypassed or component is not mounted
  if (loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading tools...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry} className="mt-4">
          Retry Loading
        </Button>
      </div>
    );
  }
  
  // Render the tools once authentication is bypassed and component is mounted
  return (
    <div className="container mx-auto py-6">
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
            <h1 className="text-3xl font-bold mb-2">Agent Definitions</h1>
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
            <h1 className="text-3xl font-bold mb-2">Agency Flow</h1>
            <p className="text-muted-foreground mb-6">
              Visual representation of how agents interact with each other in the workflow
            </p>
            
            {mounted && <DynamicAgencyFlowDiagram />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

