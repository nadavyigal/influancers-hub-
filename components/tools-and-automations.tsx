"use client"

import { useState, useEffect } from "react"
import { ContentStrategistAgent } from "./content-strategist-agent"
import { ContentSchedulerAgent } from "./content-scheduler-agent"
import { EngagementManagerAgent } from "./engagement-manager-agent"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

// Dynamically import the ContentEditorAgent component with SSR disabled
const ContentEditorAgent = dynamic(
  () => import('./content-editor-agent'),
  { 
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Content Editor...</span>
      </div>
    ),
    ssr: false 
  }
)

export function ToolsAndAutomations() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    try {
      console.log("ToolsAndAutomations mounting...");
      setMounted(true);
      console.log("ToolsAndAutomations mounted successfully");
    } catch (err) {
      console.error("Error in ToolsAndAutomations mount:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("ToolsAndAutomations state:", {
      mounted,
      error,
      retryCount
    });
  }, [mounted, error, retryCount]);

  const handleRetry = () => {
    console.log("Retrying ToolsAndAutomations load...");
    setRetryCount(prev => prev + 1);
    setError(null);
    // Force remount of the component
    setMounted(false);
    setTimeout(() => setMounted(true), 100);
  };

  if (!mounted) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading tools...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Component Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry} className="mt-4">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">Tools & Automations</h1>
      <p className="text-muted-foreground mb-6">
        AI-powered tools to help you create, optimize, and analyze your content
      </p>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="inline-block w-2 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded mr-2"></span>
          AI Agents
        </h2>
        <div className="grid gap-6">
          <ContentStrategistAgent />
          <ContentSchedulerAgent />
          <EngagementManagerAgent />
          <ContentEditorAgent />
        </div>
      </div>
    </div>
  )
}

