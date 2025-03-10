import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface ContentOptimizationRequest {
  contentType: string;
  text: string;
  targetAudience?: string;
  tone?: string;
  maxLength?: number;
}

export interface ContentAnalysisRequest {
  contentType: string;
  text: string;
  metrics?: string[];
}

export async function optimizeContent(request: ContentOptimizationRequest): Promise<string> {
  try {
    const { contentType, text, targetAudience, tone, maxLength } = request;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media content optimization assistant. Optimize the following ${contentType} content${targetAudience ? ` for ${targetAudience}` : ''}${tone ? ` with a ${tone} tone` : ''}.${maxLength ? ` Keep it under ${maxLength} characters.` : ''}`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No optimization available";
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error("Failed to optimize content");
  }
}

export async function analyzeContent(request: ContentAnalysisRequest): Promise<string> {
  try {
    const { contentType, text, metrics } = request;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media content analysis assistant. Analyze the following ${contentType} content${metrics ? ` focusing on ${metrics.join(', ')}` : ''}.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No analysis available";
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw new Error("Failed to analyze content");
  }
}

export async function generateHashtags(topic: string, count: number): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media hashtag generator. Generate ${count} relevant hashtags for the topic.`
        },
        {
          role: "user",
          content: topic
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";
    // Extract hashtags from the response
    const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
    return hashtags.slice(0, count);
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw new Error("Failed to generate hashtags");
  }
} 