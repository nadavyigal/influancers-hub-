import { Agency } from './mock-agency-swarm';
import { ContentCreationTeam } from './teams/content-creation-team';
import { InfluencerManagementTeam } from './teams/influencer-management-team';
import { AnalyticsTeam } from './teams/analytics-team';

// Initialize the Influencers Hub Agency
export const initAgencySwarm = async (apiKey: string) => {
  // Create a new agency with the OpenAI API key
  const agency = new Agency({
    apiKey,
    // Add any other configuration options here
  });

  // Add teams to the agency
  agency.addTeam(ContentCreationTeam);
  agency.addTeam(InfluencerManagementTeam);
  agency.addTeam(AnalyticsTeam);

  return agency;
};

// Function to run a prompt with a specific team
export const runTeamPrompt = async (team: any, prompt: string) => {
  try {
    // In a real implementation, this would use the actual Agency Swarm API
    // For now, we'll return a mock response
    return `Mock response from ${team.name}: ${prompt}`;
  } catch (error) {
    console.error('Error running team prompt:', error);
    return 'An error occurred while processing your request.';
  }
};

// Export teams for direct access
export { ContentCreationTeam } from './teams/content-creation-team';
export { InfluencerManagementTeam } from './teams/influencer-management-team';
export { AnalyticsTeam } from './teams/analytics-team'; 