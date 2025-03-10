import { Metadata } from "next";
import AgentsInterface from "@/components/agents-interface";

export const metadata: Metadata = {
  title: "AI Assistant | Influencers Hub",
  description: "AI-powered assistant for influencer marketing tasks",
};

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-gray-500">
            Leverage AI agents to help with content creation, influencer management, and analytics.
          </p>
        </div>
        
        <AgentsInterface />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Use the AI Assistant</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Initialize the Agents</h3>
              <p className="text-sm text-gray-600">
                Enter your OpenAI API key to initialize the AI agents. Your API key is used locally and never stored on our servers.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Select an Agent</h3>
              <p className="text-sm text-gray-600">
                Choose the agent that best matches your needs from one of our specialized teams:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mt-2">
                <li><strong>Content Creation Team:</strong> For content ideas, writing, and review</li>
                <li><strong>Influencer Management Team:</strong> For influencer research, campaign planning, and outreach</li>
                <li><strong>Analytics Team:</strong> For data analysis, reporting, and strategic insights</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">3. Describe Your Request</h3>
              <p className="text-sm text-gray-600">
                Clearly describe what you need help with. Be specific about your goals, requirements, and any relevant context.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">4. Review and Implement</h3>
              <p className="text-sm text-gray-600">
                Review the AI's response and implement the suggestions that align with your strategy and brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 