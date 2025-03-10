"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function AgentBox({ title, color, description }: { title: string; color: string; description: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-48 h-24 rounded-lg shadow-lg ${color} flex items-center justify-center p-4 text-white font-medium`}>
        {title}
      </div>
      <p className="mt-2 text-sm text-center text-muted-foreground max-w-[12rem]">{description}</p>
    </div>
  );
}

function FlowArrow({ from, to, description }: { from: string; to: string; description: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-right w-32">{from}</div>
      <div className="flex items-center gap-1">
        <div className="w-6 h-0.5 bg-gray-400"></div>
        <ArrowRight className="w-4 h-4 text-gray-500" />
        <div className="w-6 h-0.5 bg-gray-400"></div>
      </div>
      <div className="text-sm font-medium w-32">{to}</div>
      <div className="text-xs text-muted-foreground ml-2 max-w-[12rem]">{description}</div>
    </div>
  );
}

// Main component implementation
export function AgencyFlowDiagram() {
  const [mounted, setMounted] = useState(false);

  // Only render the component after it has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side rendering
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agency Flow Visualization</h3>
        
        <div className="relative w-full py-8">
          {/* Agents */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <AgentBox 
              title="Content Strategist" 
              color="bg-gradient-to-br from-blue-500 to-purple-500"
              description="Creates content strategy and generates captions"
            />
            
            <AgentBox 
              title="Content Editor" 
              color="bg-gradient-to-br from-purple-600 to-pink-500"
              description="Enhances videos and images for better engagement"
            />
            
            <AgentBox 
              title="Content Scheduler" 
              color="bg-gradient-to-br from-blue-600 to-cyan-500"
              description="Schedules content for optimal posting times"
            />
            
            <AgentBox 
              title="Engagement Manager" 
              color="bg-gradient-to-br from-indigo-600 to-blue-500"
              description="Monitors and responds to audience interactions"
            />
          </div>
          
          {/* Flow arrows */}
          <div className="w-full flex flex-col items-center gap-4">
            <FlowArrow 
              from="Content Strategist" 
              to="Content Scheduler" 
              description="Captions & content pass to scheduler"
            />
            
            <FlowArrow 
              from="Content Editor" 
              to="Content Scheduler" 
              description="Enhanced media passes to scheduler"
            />
            
            <FlowArrow 
              from="Content Scheduler" 
              to="Engagement Manager" 
              description="Scheduled content passes to engagement monitoring"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Default export for dynamic import
export default AgencyFlowDiagram; 