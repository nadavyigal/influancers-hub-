"use client";

import { useState, useEffect } from 'react';

// Create the missing hook that the AI assistant page needs
export function useOpenAIKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // For test mode, return a mock API key
        // In production, this would load from a secure source
        const mockKey = 'sk-mock-key-for-development';
        setApiKey(mockKey);
        setLoading(false);
      } catch (err) {
        console.error('Error loading OpenAI API key:', err);
        setError('Failed to load API key. Using test mode.');
        setLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
  };

  return { apiKey, loading, error, updateApiKey };
}

// Custom hook to manage auth token for API requests
export function useApiAuth() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, get the auth token from your auth system
    // For now, we'll use a placeholder
    try {
      // This would typically come from your authentication system
      // For example, from a session cookie or localStorage
      const token = localStorage.getItem('authToken') || 'temp-auth-token';
      setAuthToken(token);
      setError(null);
    } catch (err) {
      console.error('Error loading auth token:', err);
      setError('Error loading authentication');
    } finally {
      setLoading(false);
    }
  }, []);

  return { authToken, loading, error, setAuthToken };
}

// Secure API client for OpenAI operations
async function callOpenAiApi(action: string, payload: any, authToken: string) {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        action,
        payload
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${action}:`, error);
    throw error;
  }
}

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

export async function optimizeContent(request: ContentOptimizationRequest, authToken: string): Promise<string> {
  try {
    // Use the secure server API endpoint
    const response = await callOpenAiApi('optimizeContent', request, authToken);
    return response.result;
  } catch (error) {
    console.error("Error optimizing content:", error);
    
    // For development purposes, provide a fallback response
    if (process.env.NODE_ENV === 'development') {
      return `[DEVELOPMENT MODE] This is a mock optimized version of your ${request.contentType} content.`;
    }
    
    return "Error: Failed to optimize content. Please try again later.";
  }
}

export async function analyzeContent(request: ContentAnalysisRequest, authToken: string): Promise<string> {
  try {
    // Use the secure server API endpoint
    const response = await callOpenAiApi('analyzeContent', request, authToken);
    return response.result;
  } catch (error) {
    console.error("Error analyzing content:", error);
    
    // For development purposes, provide a fallback response
    if (process.env.NODE_ENV === 'development') {
      return `[DEVELOPMENT MODE] This is a mock analysis of your ${request.contentType} content.`;
    }
    
    return "Error: Failed to analyze content. Please try again later.";
  }
}

export async function generateHashtags(topic: string, count: number, authToken: string): Promise<string[]> {
  try {
    // Use the secure server API endpoint
    const response = await callOpenAiApi('generateHashtags', { topic, count }, authToken);
    return response.result;
  } catch (error) {
    console.error("Error generating hashtags:", error);
    
    // For development purposes, provide a fallback response
    if (process.env.NODE_ENV === 'development') {
      return Array.from({ length: count }, (_, i) => `#MockHashtag${i + 1}`);
    }
    
    return ["#Error", "#TryAgain", "#Later"];
  }
} 