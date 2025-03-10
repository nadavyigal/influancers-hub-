"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { initAgencySwarm, runTeamPrompt, ContentCreationTeam, InfluencerManagementTeam, AnalyticsTeam } from '@/lib/agency-swarm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AgencySwarmInterface() {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agency, setAgency] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('content');
  const { toast } = useToast();
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);

  const initializeAgency = async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }

    setLoading(true);
    try {
      // Initialize the agency with the API key
      const agency = await initAgencySwarm(apiKey);
      setAgency(agency);
      setInitialized(true);
      setError("");
    } catch (error) {
      console.error("Error initializing agency:", error);
      setError("Failed to initialize the agency. Please check your API key.");
    } finally {
      setLoading(false);
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
      const response = await runTeamPrompt(team, prompt);
      setResponse(response);
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
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Agency Assistant</CardTitle>
        <CardDescription>
          Leverage AI agents to help with content creation, influencer management, and analytics.
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
          
          {!initialized ? (
            <div className="space-y-4">
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
                {loading ? "Initializing..." : "Initialize Agency"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="content-creation" onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="content-creation">Content Creation</TabsTrigger>
                  <TabsTrigger value="influencer-management">Influencer Management</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="content-creation">
                  <p className="text-sm text-gray-500 mb-4">
                    The Content Creation team can help generate content ideas, write captions, scripts, and review content for your influencer campaigns.
                  </p>
                </TabsContent>
                <TabsContent value="influencer-management">
                  <p className="text-sm text-gray-500 mb-4">
                    The Influencer Management team can help research influencers, plan campaigns, and draft outreach messages.
                  </p>
                </TabsContent>
                <TabsContent value="analytics">
                  <p className="text-sm text-gray-500 mb-4">
                    The Analytics team can help analyze campaign data, create reports, and provide strategic insights.
                  </p>
                </TabsContent>
              </Tabs>

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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Powered by Agency Swarm and OpenAI
        </p>
      </CardFooter>
    </Card>
  );
} 