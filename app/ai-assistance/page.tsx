"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function AIAssistancePage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const router = useRouter();
  const [openAIError, setOpenAIError] = useState<boolean>(false);

  useEffect(() => {
    try {
      console.log("AI Assistance page mounting...");
      setMounted(true);
      console.log("AI Assistance page mounted successfully");
      
      // Check if there's an OpenAI error in the console
      const originalConsoleError = console.error;
      console.error = function(...args) {
        const errorMessage = args.join(' ');
        if (errorMessage.includes('OpenAIError') || errorMessage.includes('dangerouslyAllowBrowser')) {
          setOpenAIError(true);
        }
        originalConsoleError.apply(console, args);
      };
      
      return () => {
        console.error = originalConsoleError;
      };
    } catch (err) {
      console.error("Error in AI Assistance page mount:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResponse(`This is a mock response to your prompt: "${prompt}"\n\nIn a real implementation, this would connect to the AI service.`);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToAIAssistant = () => {
    router.push("/ai-assistant");
  };

  if (!mounted) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Initializing AI Assistance...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => setError(null)} className="mr-2">
          Retry
        </Button>
        <Button onClick={handleGoToAIAssistant} variant="outline">
          Go to AI Assistant
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Assistance</h1>
          <p className="text-gray-600">
            Welcome to the AI Assistance page. You can use this simplified interface or go to the full AI Assistant.
          </p>
          <Button onClick={handleGoToAIAssistant} className="mt-4">
            Go to Full AI Assistant
          </Button>
        </div>

        {openAIError && (
          <Alert variant="default" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>OpenAI Configuration Issue</AlertTitle>
            <AlertDescription>
              There appears to be an issue with the OpenAI configuration. The AI Assistant may not function properly.
              We've provided a simplified interface below that doesn't require the OpenAI API.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quick AI Help</CardTitle>
            <CardDescription>
              Ask a question or request assistance with your influencer marketing tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-gray-500">
              Powered by AI Assistance
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
