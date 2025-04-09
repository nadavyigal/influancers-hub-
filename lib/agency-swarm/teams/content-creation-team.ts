import { Team, Agent } from '../mock-agency-swarm';
import { ContentIdeaAgent } from '../agents/content-idea-agent';

// Create a mock ContentCreationTeam
let ContentCreationTeam: Team;

try {
  console.log("Creating ContentCreationTeam...");
  
  // Create mock agents since we don't have the actual agent implementations
  const contentIdeaAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Content Idea Agent",
    description: "Generates creative and engaging content ideas for influencers"
  });
  
  const contentWriterAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Content Writer Agent",
    description: "Creates high-quality, engaging content based on ideas"
  });
  
  const contentReviewerAgent = new Agent({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    name: "Content Reviewer Agent",
    description: "Reviews content for quality and brand alignment"
  });
  
  // Create the team
  ContentCreationTeam = new Team(
    "Content Creation Team",
    [contentIdeaAgent, contentWriterAgent, contentReviewerAgent]
  );
  
  console.log("ContentCreationTeam created successfully");
} catch (error) {
  console.error("Error creating ContentCreationTeam:", error);
  // Create a fallback team to prevent runtime errors
  ContentCreationTeam = new Team(
    "Content Creation Team (Fallback)",
    []
  );
}

export { ContentCreationTeam }; 