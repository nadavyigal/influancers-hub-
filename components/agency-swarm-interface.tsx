"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { initAgencySwarm } from '@/lib/agency-swarm';
import { ContentCreationTeam, InfluencerManagementTeam, AnalyticsTeam } from '@/lib/agency-swarm';

export default function AgencySwarmInterface() {
  const [loading, setLoading] = useState<boolean>(false);
  const [agency, setAgency] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [activeTeam, setActiveTeam] = useState<string>('content-creation');
  const { toast } = useToast();

  const initializeAgency = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to initialize the agency.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const agencyInstance = await initAgencySwarm(apiKey);
      setAgency(agencyInstance);
      toast({
        title: "Agency Initialized",
        description: "The Influencers Hub Agency has been successfully initialized.",
      });
    } catch (error) {
      console.error("Failed to initialize agency:", error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize the agency. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!agency) {
      toast({
        title: "Agency Not Initialized",
        description: "Please initialize the agency first with your OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for the agency team.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponse('');
    
    try {
      let team;
      
      // Select the appropriate team based on the active tab
      switch (activeTeam) {
        case 'content-creation':
          team = ContentCreationTeam;
          break;
        case 'influencer-management':
          team = InfluencerManagementTeam;
          break;
        case 'analytics':
          team = AnalyticsTeam;
          break;
        default:
          team = ContentCreationTeam;
      }
      
      // Run the team with the provided prompt
      const result = await agency.runTeam(team, prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error running team:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        {!agency ? (
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
            <Tabs defaultValue="content-creation" onValueChange={setActiveTeam}>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Powered by Agency Swarm and OpenAI
        </p>
      </CardFooter>
    </Card>
  );
} 