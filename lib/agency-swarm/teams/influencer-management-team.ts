import { Team } from '../mock-agency-swarm';
import { InfluencerResearchAgent } from '../agents/influencer-research-agent';
import { CampaignManagerAgent } from '../agents/campaign-manager-agent';
import { OutreachAgent } from '../agents/outreach-agent';

// Influencer Management Team - responsible for researching influencers, managing campaigns, and outreach
export const InfluencerManagementTeam = new Team({
  name: "Influencer Management Team",
  description: "This team is responsible for researching influencers, managing campaigns, and handling outreach.",
  agents: [
    InfluencerResearchAgent,
    CampaignManagerAgent,
    OutreachAgent
  ]
}); 