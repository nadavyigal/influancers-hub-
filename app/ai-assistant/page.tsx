"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useOpenAIKey } from "@/lib/openai";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Dynamically import the AgentsInterface component with SSR disabled and error handling
const DynamicAgentsInterface = dynamic(
  () => import('@/components/agents-interface').catch(err => {
    console.error("Error loading AgentsInterface:", err);
    return Promise.resolve(() => (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Component</AlertTitle>
        <AlertDescription>
          There was an error loading the AI Assistant interface. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    ));
  }),
  { 
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading AI Assistant...</span>
      </div>
    ),
    ssr: false
  }
);

export default function AIAssistantPage() {
  const { apiKey, loading, error } = useOpenAIKey();
  const [mounted, setMounted] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    try {
      console.log("AI Assistant page mounting...");
      setMounted(true);
      console.log("AI Assistant page mounted successfully");
    } catch (err) {
      console.error("Error in AI Assistant page mount:", err);
      setComponentError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, []);

  // Debug logging for apiKey state
  useEffect(() => {
    console.log("AI Assistant - API Key state:", {
      loading,
      error,
      hasKey: !!apiKey,
      mounted,
      retryCount
    });
  }, [apiKey, loading, error, mounted, retryCount]);

  const handleRetry = () => {
    console.log("Retrying AI Assistant load...");
    setRetryCount(prev => prev + 1);
    setComponentError(null);
    // Force remount of the component
    setMounted(false);
    setTimeout(() => setMounted(true), 100);
  };

  if (!mounted) {
    console.log("AI Assistant page not mounted yet");
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Initializing AI Assistant...</span>
        </div>
      </div>
    );
  }

  if (componentError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Component Error</AlertTitle>
          <AlertDescription>
            {componentError}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRetry} className="mt-4">
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            {loading
              ? "Loading your OpenAI API key..."
              : error
              ? "Please enter your OpenAI API key to use the AI Assistant."
              : "Your OpenAI API key has been loaded. You can now use the AI Assistant."}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading API key...</span>
          </div>
        ) : error ? (
          <div>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading API key</AlertTitle>
              <AlertDescription>
                {error}. Please enter your API key manually.
              </AlertDescription>
            </Alert>
            <DynamicAgentsInterface initialApiKey="" />
          </div>
        ) : (
          <div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">Debug info: API key available: {apiKey ? "Yes" : "No"}</p>
              </div>
            )}
            <DynamicAgentsInterface initialApiKey={apiKey} />
          </div>
        )}
      </div>
    </div>
  );
} 