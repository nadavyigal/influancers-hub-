import { Team } from 'agency-swarm';
import { DataAnalystAgent } from '../agents/data-analyst-agent';
import { ReportingAgent } from '../agents/reporting-agent';
import { InsightsAgent } from '../agents/insights-agent';

// Analytics Team - responsible for analyzing data, generating reports, and providing insights
export const AnalyticsTeam = new Team({
  name: "Analytics Team",
  description: "This team is responsible for analyzing influencer performance data, generating reports, and providing actionable insights.",
  agents: [
    DataAnalystAgent,
    ReportingAgent,
    InsightsAgent
  ]
}); 