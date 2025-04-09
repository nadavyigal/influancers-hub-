import { Team, Agent } from '../mock-agency-swarm';

// Create a mock InfluencerManagementTeam
let InfluencerManagementTeam: Team;

try {
  console.log("Creating InfluencerManagementTeam...");
  
  // Create mock agents
  const influencerResearchAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Influencer Research Agent",
    description: "Researches and identifies suitable influencers based on campaign goals"
  });
  
  const campaignManagerAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Campaign Manager Agent",
    description: "Plans and coordinates influencer marketing campaigns"
  });
  
  const outreachAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Outreach Agent",
    description: "Creates personalized outreach messages and manages communication with influencers"
  });
  
  // Create the team
  InfluencerManagementTeam = new Team(
    "Influencer Management Team",
    [influencerResearchAgent, campaignManagerAgent, outreachAgent]
  );
  
  console.log("InfluencerManagementTeam created successfully");
} catch (error) {
  console.error("Error creating InfluencerManagementTeam:", error);
  // Create a fallback team to prevent runtime errors
  InfluencerManagementTeam = new Team(
    "Influencer Management Team (Fallback)",
    []
  );
}

export { InfluencerManagementTeam }; 