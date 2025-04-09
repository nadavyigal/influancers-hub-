import { Team, Agent } from '../mock-agency-swarm';

// Create a mock AnalyticsTeam
let AnalyticsTeam: Team;

try {
  console.log("Creating AnalyticsTeam...");
  
  // Create mock agents
  const dataAnalystAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Data Analyst Agent",
    description: "Analyzes campaign data to extract meaningful insights"
  });
  
  const reportingAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Reporting Agent",
    description: "Creates comprehensive reports on campaign performance"
  });
  
  const insightsAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Insights Agent",
    description: "Provides strategic insights and recommendations based on data analysis"
  });
  
  // Create the team
  AnalyticsTeam = new Team(
    "Analytics Team",
    [dataAnalystAgent, reportingAgent, insightsAgent]
  );
  
  console.log("AnalyticsTeam created successfully");
} catch (error) {
  console.error("Error creating AnalyticsTeam:", error);
  // Create a fallback team to prevent runtime errors
  AnalyticsTeam = new Team(
    "Analytics Team (Fallback)",
    []
  );
}

export { AnalyticsTeam }; 