import { Agent } from "@/lib/agency-swarm";
import { ManyChatTool, ChatGPTBotTool, Brand24Tool } from "@/components/tools/engagement-tools";

// Engagement Manager Agent definition
export const engagement_manager = new Agent({
  name: "Engagement Manager",
  description: "A professional digital marketing strategist specializing in boosting engagement and fostering audience interaction. Ensures a high level of responsiveness and engagement across all social media platforms.",
  instructions: `
    1. Monitor brand mentions, comments, and DMs across all social platforms.
    2. Generate personalized and engaging responses to user interactions.
    3. Maintain a fast response time to improve follower interaction and retention.
    4. Analyze engagement patterns to optimize response strategies.
    5. Identify and prioritize high-value interactions from key audience segments.
  `,
  tools: [ManyChatTool, ChatGPTBotTool, Brand24Tool],
  temperature: 0.5,
  max_prompt_tokens: 2000
}); 