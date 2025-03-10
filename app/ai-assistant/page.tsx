import { Metadata } from "next";
import AgencySwarmInterface from "@/components/agency-swarm-interface";

export const metadata: Metadata = {
  title: "AI Assistant | Influencers Hub",
  description: "AI-powered assistant for influencer marketing tasks",
};

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-gray-500">
            Leverage AI agents to help with content creation, influencer management, and analytics.
          </p>
        </div>
        
        <AgencySwarmInterface />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Use the AI Assistant</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Initialize the Agency</h3>
              <p className="text-sm text-gray-600">
                Enter your OpenAI API key to initialize the AI agency. Your API key is used locally and never stored on our servers.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">2. Select a Team</h3>
              <p className="text-sm text-gray-600">
                Choose the team that best matches your needs:
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