"use client";

import { useState, useEffect } from 'react';
import { OpenAI } from 'openai';

// Custom hook to get the OpenAI API key from environment variables
export function useOpenAIKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log("useOpenAIKey hook initializing...");
      // First try to get the key from environment variables
      const envApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (envApiKey) {
        console.log("Found API key in environment variables");
        setApiKey(envApiKey);
        setError(null);
      } else {
        console.log("No API key found in environment variables");
        // For development purposes, provide a mock key
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock API key for development");
          setApiKey('sk-mock-key-for-development');
          setError(null);
        } else {
          setError('OpenAI API key not found in environment variables');
        }
      }
    } catch (err) {
      console.error('Error loading OpenAI API key:', err);
      setError('Error loading OpenAI API key');
      
      // For development purposes, provide a mock key even on error
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock API key for development after error");
        setApiKey('sk-mock-key-for-development');
      }
    } finally {
      setLoading(false);
      console.log("useOpenAIKey hook initialized");
    }
  }, []);

  return { apiKey, loading, error, setApiKey };
}

// Function to get the OpenAI API key synchronously (for non-hook contexts)
export function getOpenAIKey(): string | null {
  if (typeof window !== 'undefined') {
    const envKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (envKey) return envKey;
    
    // For development purposes, provide a mock key
    if (process.env.NODE_ENV === 'development') {
      return 'sk-mock-key-for-development';
    }
  }
  return null;
}

// OpenAI API configuration
export const openaiConfig = {
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to create headers with the API key
export function createOpenAIHeaders(apiKey: string) {
  return {
    ...openaiConfig.headers,
    'Authorization': `Bearer ${apiKey}`,
  };
}

// Initialize OpenAI client - safely handle missing API key
// Use a mock key for development to prevent server-side errors
const getApiKey = () => {
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log("Using mock OpenAI API key for development");
    return 'sk-mock-key-for-development';
  }
  
  console.warn("OpenAI API key is missing, some features will be disabled");
  return 'sk-dummy-key-openai-features-disabled';
};

const openai = new OpenAI({
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true,
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
    // Check if we're using a dummy key (disabled features)
    if (openai.apiKey === 'sk-dummy-key-openai-features-disabled') {
      return "OpenAI features are currently disabled due to missing API key. Please add your API key to the environment variables.";
    }
    
    const { contentType, text, targetAudience, tone, maxLength } = request;
    
    // For development with mock key, return canned response
    if (process.env.NODE_ENV === 'development' && openai.apiKey === 'sk-mock-key-for-development') {
      return `[DEVELOPMENT MODE] This is a mock optimized version of your ${contentType} content.`;
    }
    
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
    return "Error: Failed to optimize content. Please try again later.";
  }
}

export async function analyzeContent(request: ContentAnalysisRequest): Promise<string> {
  try {
    // Check if we're using a dummy key (disabled features)
    if (openai.apiKey === 'sk-dummy-key-openai-features-disabled') {
      return "OpenAI features are currently disabled due to missing API key. Please add your API key to the environment variables.";
    }
    
    const { contentType, text, metrics } = request;
    
    // For development with mock key, return canned response
    if (process.env.NODE_ENV === 'development' && openai.apiKey === 'sk-mock-key-for-development') {
      return `[DEVELOPMENT MODE] This is a mock analysis of your ${contentType} content.`;
    }
    
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
    return "Error: Failed to analyze content. Please try again later.";
  }
}

export async function generateHashtags(topic: string, count: number): Promise<string[]> {
  try {
    // Check if we're using a dummy key (disabled features)
    if (openai.apiKey === 'sk-dummy-key-openai-features-disabled') {
      return ["#OpenAI", "#API", "#KeyMissing", "#PleaseAddAPIKey"];
    }
    
    // For development with mock key, return canned response
    if (process.env.NODE_ENV === 'development' && openai.apiKey === 'sk-mock-key-for-development') {
      return Array.from({ length: count }, (_, i) => `#MockHashtag${i + 1}`);
    }
    
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
    return ["#Error", "#TryAgain", "#Later"];
  }
} 