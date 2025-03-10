import { Agency } from 'agency-swarm';
import { ContentCreationTeam } from './teams/content-creation-team';
import { InfluencerManagementTeam } from './teams/influencer-management-team';
import { AnalyticsTeam } from './teams/analytics-team';

// Initialize the Influencers Hub Agency
export const initAgencySwarm = async (apiKey: string) => {
  // Create the agency with the provided OpenAI API key
  const agency = new Agency({
    name: "Influencers Hub Agency",
    description: "An agency that helps manage influencer marketing campaigns, content creation, and analytics.",
    openAIApiKey: apiKey,
  });

  // Add teams to the agency
  agency.addTeam(ContentCreationTeam);
  agency.addTeam(InfluencerManagementTeam);
  agency.addTeam(AnalyticsTeam);

  // Initialize the agency
  await agency.init();

  return agency;
};

// Export teams for direct access
export { ContentCreationTeam } from './teams/content-creation-team';
export { InfluencerManagementTeam } from './teams/influencer-management-team';
export { AnalyticsTeam } from './teams/analytics-team'; 