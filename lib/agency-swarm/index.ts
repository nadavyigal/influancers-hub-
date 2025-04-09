import { Agency } from './mock-agency-swarm';
import { ContentCreationTeam } from './teams/content-creation-team';
import { InfluencerManagementTeam } from './teams/influencer-management-team';
import { AnalyticsTeam } from './teams/analytics-team';

// Initialize the agency with the OpenAI API key
export function initAgencySwarm(apiKey: string) {
  console.log("Initializing Agency Swarm with API key:", apiKey ? "provided" : "not provided");
  
  try {
    // Create a new agency
    const agency = new Agency({
      apiKey: apiKey,
    });

    // Add teams to the agency
    console.log("Adding teams to agency...");
    agency.addTeam(ContentCreationTeam);
    agency.addTeam(InfluencerManagementTeam);
    agency.addTeam(AnalyticsTeam);
    console.log("Teams added successfully");

    return agency;
  } catch (error) {
    console.error("Error initializing Agency Swarm:", error);
    throw new Error(`Failed to initialize Agency Swarm: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Run a prompt with a specific team
export async function runTeamPrompt(team: any, prompt: string) {
  console.log(`Running prompt with team "${team.name}": "${prompt.substring(0, 50)}..."`);
  
  try {
    // In a real implementation, this would use the actual Agency Swarm API
    // For now, we'll return a mock response
    return await team.run(prompt);
  } catch (error) {
    console.error(`Error running prompt with team "${team.name}":`, error);
    throw new Error(`Failed to run prompt: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Export teams for direct access
export { ContentCreationTeam, InfluencerManagementTeam, AnalyticsTeam }; 