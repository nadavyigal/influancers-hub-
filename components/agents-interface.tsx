"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AgentsGrid } from './agents-grid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ContentCreationTeam } from '@/lib/agency-swarm/teams/content-creation-team';
import { InfluencerManagementTeam } from '@/lib/agency-swarm/teams/influencer-management-team';
import { AnalyticsTeam } from '@/lib/agency-swarm/teams/analytics-team';
import { Agency } from '@/lib/agency-swarm/mock-agency-swarm';
import { ContentSchedulerAgent } from './content-scheduler-agent';

export interface AgentsInterfaceProps {
  initialApiKey?: string;
}

export default function AgentsInterface({ initialApiKey = '' }: AgentsInterfaceProps) {
  const [apiKey, setApiKey] = useState<string>(initialApiKey);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agency, setAgency] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('content');
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [componentError, setComponentError] = useState<string | null>(null);
  const [initAttempted, setInitAttempted] = useState<boolean>(false);

  console.log("AgentsInterface rendering with initialApiKey:", initialApiKey ? "provided" : "not provided");

  // Initialize the agency with the API key - memoized to prevent unnecessary re-renders
  const initializeAgencyWithKey = useCallback(async (key: string) => {
    console.log("Initializing agency with key:", key ? "provided" : "not provided");
    if (!key) {
      console.log("No API key provided, skipping initialization");
      setError("Please enter your OpenAI API key");
      return;
    }

    setLoading(true);
    try {
      // Create a new agency with the OpenAI API key
      console.log("Creating new agency instance");
      const newAgency = new Agency({
        apiKey: key,
        // Add any other configuration options here
      });

      // Add teams to the agency
      console.log("Adding teams to agency");
      newAgency.addTeam(ContentCreationTeam);
      newAgency.addTeam(InfluencerManagementTeam);
      newAgency.addTeam(AnalyticsTeam);

      setAgency(newAgency);
      setInitialized(true);
      setError("");
      console.log("Agency initialized successfully");
    } catch (error) {
      console.error("Error initializing agency:", error);
      setError("Failed to initialize the agency. Please check your API key.");
      setComponentError(error instanceof Error ? error.message : "Unknown error occurred during agency initialization");
    } finally {
      setLoading(false);
      setInitAttempted(true);
    }
  }, []);

  // Load API key from environment variables or props on component mount
  useEffect(() => {
    try {
      console.log("AgentsInterface mounting with initialApiKey:", initialApiKey ? "provided" : "not provided");
      
      // If we've already attempted initialization, don't try again
      if (initAttempted) {
        console.log("Initialization already attempted, skipping");
        return;
      }
      
      // If initialApiKey was provided via props, use it
      if (initialApiKey) {
        console.log("Setting API key from props");
        setApiKey(initialApiKey);
        // Auto-initialize if API key is available
        console.log("Auto-initializing with provided API key");
        initializeAgencyWithKey(initialApiKey);
      } 
      // Otherwise try to load from environment variables
      else {
        const envApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (envApiKey) {
          console.log("Setting API key from environment variables");
          setApiKey(envApiKey);
          // Auto-initialize if API key is available
          console.log("Auto-initializing with environment API key");
          initializeAgencyWithKey(envApiKey);
        } else {
          console.log("No API key available from props or environment");
          // For development purposes, provide a mock key
          if (process.env.NODE_ENV === 'development') {
            console.log("Using mock API key for development");
            const mockKey = 'sk-mock-key-for-development';
            setApiKey(mockKey);
            console.log("Auto-initializing with mock API key");
            initializeAgencyWithKey(mockKey);
          } else {
            // Set initAttempted to true to prevent further attempts
            setInitAttempted(true);
          }
        }
      }
    } catch (err) {
      console.error("Error in AgentsInterface useEffect:", err);
      setComponentError(err instanceof Error ? err.message : "Unknown error occurred");
      setInitAttempted(true);
    }
  }, [initialApiKey, initializeAgencyWithKey, initAttempted]);

  // Initialize the agency with the API key
  const initializeAgency = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }

    initializeAgencyWithKey(apiKey);
  };

  // Function to run a prompt with a specific team
  const runTeamPrompt = async (team: any, promptText: string) => {
    try {
      // In a real implementation, this would use the actual Agency Swarm API
      // For now, we'll return a mock response
      return `Mock response from ${team.name}: ${promptText}`;
    } catch (error) {
      console.error('Error running team prompt:', error);
      return 'An error occurred while processing your request.';
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      let teamToUse;
      switch (selectedTeam) {
        case 'content':
          teamToUse = ContentCreationTeam;
          break;
        case 'influencer':
          teamToUse = InfluencerManagementTeam;
          break;
        case 'analytics':
          teamToUse = AnalyticsTeam;
          break;
        default:
          teamToUse = ContentCreationTeam;
      }

      const result = await runTeamPrompt(teamToUse, prompt);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  if (componentError) {
    return (
      <div className="w-full space-y-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Component Error</AlertTitle>
          <AlertDescription>
            {componentError}
            <div className="mt-2">
              <Button onClick={() => {
                setComponentError(null);
                setInitAttempted(false);
                initializeAgency();
              }} variant="outline" size="sm">
                Retry Initialization
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    // Map the tab values to the team values
    switch (value) {
      case "content-creation":
        setSelectedTeam("content");
        break;
      case "influencer-management":
        setSelectedTeam("influencer");
        break;
      case "analytics":
        setSelectedTeam("analytics");
        break;
      default:
        setSelectedTeam("content");
    }
    // Reset selected agent when changing teams
    setSelectedAgent(null);
  };

  const handleSelectAgent = (agent: any) => {
    setSelectedAgent(agent);
    
    // Special handling for Content Scheduler agent
    if (agent.id === 'content-scheduler') {
      // No need to pre-fill prompt for Content Scheduler as it has its own UI
      setPrompt('');
    } else {
      // Pre-fill the prompt with a template based on the selected agent
      setPrompt(`I need help with ${agent.subject.toLowerCase()} using the ${agent.name}. Please assist me with:`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {!initialized ? (
        <Card>
          <CardHeader>
            <CardTitle>Initialize AI Agents</CardTitle>
            <CardDescription>
              {apiKey ? 
                "API key loaded from environment. Click initialize to start." : 
                "Enter your OpenAI API key to access the AI agents."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium">
                  OpenAI API Key
                </label>
                <input
                  id="api-key"
                  type="password"
                  placeholder={apiKey ? "••••••••••••••••••••••••••••••••" : "sk-..."}
                  className="w-full p-2 border rounded-md"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  {apiKey ? 
                    "API key loaded from environment variables. You can use this key or enter a different one." : 
                    "Your API key is used locally and never stored on our servers."}
                </p>
              </div>
              <Button onClick={initializeAgency} disabled={loading}>
                {loading ? "Initializing..." : "Initialize Agents"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>AI Agents</CardTitle>
              <CardDescription>
                Select an agent to help with your influencer marketing tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content-creation" onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="content-creation">Content Creation</TabsTrigger>
                  <TabsTrigger value="influencer-management">Influencer Management</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="content-creation">
                  <AgentsGrid 
                    selectedTeam="content" 
                    onSelectAgent={handleSelectAgent} 
                  />
                </TabsContent>
                <TabsContent value="influencer-management">
                  <AgentsGrid 
                    selectedTeam="influencer" 
                    onSelectAgent={handleSelectAgent} 
                  />
                </TabsContent>
                <TabsContent value="analytics">
                  <AgentsGrid 
                    selectedTeam="analytics" 
                    onSelectAgent={handleSelectAgent} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {selectedAgent && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    {selectedAgent.icon}
                  </div>
                  <div>
                    <CardTitle>{selectedAgent.name}</CardTitle>
                    <CardDescription>{selectedAgent.subject}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedAgent.id === 'content-scheduler' ? (
                  <ContentSchedulerAgent />
                ) : (
                  <div className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <label htmlFor="prompt" className="text-sm font-medium">
                        Your Request
                      </label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe what you need help with..."
                        className="min-h-[100px]"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                      {loading ? "Processing..." : "Submit Request"}
                    </Button>

                    {response && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h3 className="font-medium mb-2">Response:</h3>
                        <div className="whitespace-pre-wrap text-sm">{response}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {selectedAgent.id !== 'content-scheduler' && (
                <CardFooter className="flex justify-between">
                  <p className="text-xs text-gray-500">
                    Powered by Agency Swarm and OpenAI
                  </p>
                </CardFooter>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
} 