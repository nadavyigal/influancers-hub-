"use client";

import React, { useState } from 'react';
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

export default function AgentsInterface() {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agency, setAgency] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('content');
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  // Initialize the agency with the API key
  const initializeAgency = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }

    setLoading(true);
    try {
      // Create a new agency with the OpenAI API key
      const newAgency = new Agency({
        apiKey,
        // Add any other configuration options here
      });

      // Add teams to the agency
      newAgency.addTeam(ContentCreationTeam);
      newAgency.addTeam(InfluencerManagementTeam);
      newAgency.addTeam(AnalyticsTeam);

      setAgency(newAgency);
      setInitialized(true);
      setError("");
    } catch (error) {
      console.error("Error initializing agency:", error);
      setError("Failed to initialize the agency. Please check your API key.");
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }

    if (!selectedTeam) {
      setError("Please select a team");
      return;
    }

    setLoading(true);
    try {
      // Get the selected team
      let team;
      switch (selectedTeam) {
        case "content":
          team = ContentCreationTeam;
          break;
        case "influencer":
          team = InfluencerManagementTeam;
          break;
        case "analytics":
          team = AnalyticsTeam;
          break;
        default:
          throw new Error("Invalid team selected");
      }

      // Run the prompt with the selected team
      const responseText = await runTeamPrompt(team, prompt);
      setResponse(responseText);
      setError("");
    } catch (error) {
      console.error("Error running prompt:", error);
      setError("Failed to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Enter your OpenAI API key to access the AI agents.
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
                  placeholder="sk-..."
                  className="w-full p-2 border rounded-md"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Your API key is used locally and never stored on our servers.
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