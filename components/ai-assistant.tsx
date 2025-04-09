"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

interface AIAssistantProps {
  metrics: string[]
  data: any[]
  apiKey?: string
}

function AIAssistantBase({ metrics, data, apiKey }: AIAssistantProps) {
  const [insight, setInsight] = useState("")
  const [loading, setLoading] = useState(false)

  const generateInsight = async () => {
    setLoading(true)
    // In a real application, this would be an API call to an AI service using the apiKey
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const generatedInsight = `Based on your ${metrics.join(", ")} data, here are some insights:

1. Your follower growth has been steady, with a 12% increase over the past month.
2. Posts with video content are receiving 30% more engagement than image-only posts.
3. Your highest performing content is related to lifestyle and travel topics.
4. Engagement rates peak between 6-8 PM on weekdays.
5. Consider collaborating with influencers in the travel niche to expand your reach.`
    setInsight(generatedInsight)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <Button onClick={generateInsight} disabled={loading}>
        {loading ? (
          "Generating Insights..."
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Insights
          </>
        )}
      </Button>
      {insight && <Textarea value={insight} readOnly className="h-[200px] resize-none" />}
    </div>
  )
}

export const AIAssistant = memo(AIAssistantBase);

