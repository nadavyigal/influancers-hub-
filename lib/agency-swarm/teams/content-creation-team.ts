import { Team } from '../mock-agency-swarm';
import { ContentIdeaAgent } from '../agents/content-idea-agent';
import { ContentWriterAgent } from '../agents/content-writer-agent';
import { ContentReviewerAgent } from '../agents/content-reviewer-agent';

// Content Creation Team - responsible for generating content ideas, writing content, and reviewing it
export const ContentCreationTeam = new Team({
  name: "Content Creation Team",
  description: "This team is responsible for generating content ideas, writing content, and reviewing it for influencers.",
  agents: [
    ContentIdeaAgent,
    ContentWriterAgent,
    ContentReviewerAgent
  ]
}); 