"use client"

import { useState, useEffect } from "react"
import { ContentStrategistAgent } from "./content-strategist-agent"
import { ContentSchedulerAgent } from "./content-scheduler-agent"
import { EngagementManagerAgent } from "./engagement-manager-agent"
import dynamic from 'next/dynamic'

// Dynamically import the ContentEditorAgent component with SSR disabled
const ContentEditorAgent = dynamic(
  () => import('./content-editor-agent'),
  { ssr: false }
)

export function ToolsAndAutomations() {
  const [mounted, setMounted] = useState(false);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="container mx-auto py-10">Loading tools...</div>;
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

