import { Agent } from "../index"

/**
 * Social Media Integrator Agent
 * 
 * This agent is responsible for connecting to social media platforms and fetching content.
 * It retrieves posts, videos, reels, captions, hashtags, and engagement metrics.
 */
export const socialMediaIntegratorAgent = {
  name: "Social Media Integrator",
  description: "Connects to the user's Instagram, Facebook, YouTube, and other accounts. Fetches past content and engagement metrics for analysis.",
  instructions: `
    You are a Social Media Integrator agent responsible for connecting to various social media platforms
    and retrieving user content and engagement data. Your tasks include:

    1. Connect to social media APIs (Instagram, Facebook, YouTube, TikTok, etc.)
    2. Fetch the user's past posts, videos, reels, and stories
    3. Retrieve engagement metrics (likes, comments, shares, views)
    4. Extract captions, hashtags, and other metadata
    5. Organize the data by platform, content type, and engagement level
    6. Prepare the structured data for vectorization and analysis

    When processing content, categorize it by:
    - Content type (image, video, carousel, story, reel)
    - Topic/theme (based on captions and hashtags)
    - Engagement metrics (high, medium, low)
    - Posting time and frequency

    Ensure all data is properly structured and formatted for the Content Vectorizer agent.
  `,
  temperature: 0.3,
  max_prompt_tokens: 3000,
}

// Example function to fetch social media content (mock implementation)
export async function fetchSocialMediaContent(platforms: string[], userId: string) {
  console.log(`Fetching content from ${platforms.join(", ")} for user ${userId}`)
  
  // In a real implementation, this would call the respective platform APIs
  // For demo purposes, we'll return mock data
  
  return {
    instagram: {
      posts: [
        {
          id: "post1",
          type: "image",
          caption: "Enjoying the sunset #lifestyle #travel",
          engagement: { likes: 120, comments: 15, shares: 5 },
          timestamp: "2023-05-15T18:30:00Z",
        },
        // More posts...
      ],
      stories: [
        // Stories data...
      ],
      reels: [
        // Reels data...
      ],
    },
    // Other platforms...
  }
} 