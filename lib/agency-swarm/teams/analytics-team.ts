import { Team } from '../mock-agency-swarm';
import { DataAnalystAgent } from '../agents/data-analyst-agent';
import { ReportingAgent } from '../agents/reporting-agent';
import { InsightsAgent } from '../agents/insights-agent';

// Analytics Team - responsible for analyzing data, generating reports, and providing insights
export const AnalyticsTeam = new Team({
  name: "Analytics Team",
  description: "A team that analyzes data, generates reports, and provides insights for influencer marketing campaigns.",
  agents: [DataAnalystAgent, ReportingAgent, InsightsAgent]
}); 