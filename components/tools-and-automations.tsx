"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Hash, MessageSquare, BarChart } from "lucide-react"

// Mock API functions
const mockGenerateCaption = async (prompt: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
  return `Experience the magic of ${prompt}! 🌟 Discover a world of wonder and excitement. #Adventure #Explore #LiveYourBestLife`
}

const mockGenerateImage = async (prompt: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay
  return `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(prompt)}`
}

const mockSocialListening = async (keyword: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1800)) // Simulate API delay
  return [
    { sentiment: "positive", count: 65 },
    { sentiment: "neutral", count: 25 },
    { sentiment: "negative", count: 10 },
  ]
}

const mockContentWriting = async (topic: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1700)) // Simulate API delay
  return `Discover the latest trends in ${topic}! From cutting-edge innovations to timeless classics, we've got you covered. Stay ahead of the curve and elevate your style game. #${topic.replace(/\s+/g, "")} #TrendAlert #StyleInspiration`
}

const mockHashtagOptimization = async (content: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1600)) // Simulate API delay
  const words = content.toLowerCase().split(/\s+/)
  const hashtags = words
    .filter((word) => word.length > 3)
    .map((word) => `#${word}`)
    .slice(0, 5)
  return [...hashtags, "#influencer", "#socialmedia", "#trending"]
}

export function ToolsAndAutomations() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tools & Automations</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <OpenAITool />
        <SprinklrTool />
        <JasperAITool />
        <FlickAITool />
      </div>
    </div>
  )
}

function OpenAITool() {
  const [activeTab, setActiveTab] = useState("caption")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      if (activeTab === "caption") {
        const caption = await mockGenerateCaption(input)
        setOutput(caption)
      } else {
        const imageUrl = await mockGenerateImage(input)
        setOutput(imageUrl)
      }
    } catch (error) {
      console.error("Error:", error)
      setOutput("An error occurred. Please try again.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI</CardTitle>
        <CardDescription>Generate AI-powered captions and images for your posts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="caption">Caption</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="caption">
            <div className="space-y-2">
              <Label htmlFor="caption-prompt">Caption Prompt</Label>
              <Input
                id="caption-prompt"
                placeholder="Enter a prompt for your caption"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="image">
            <div className="space-y-2">
              <Label htmlFor="image-prompt">Image Prompt</Label>
              <Input
                id="image-prompt"
                placeholder="Describe the image you want to generate"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <Button onClick={handleActivate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate {activeTab === "caption" ? "Caption" : "Image"}
              </>
            )}
          </Button>
        </div>
        {output && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Generated {activeTab === "caption" ? "Caption" : "Image"}:</h4>
            {activeTab === "caption" ? (
              <p className="text-sm bg-muted p-2 rounded">{output}</p>
            ) : (
              <img src={output || "/placeholder.svg"} alt="Generated image" className="w-full h-auto rounded" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SprinklrTool() {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<{ sentiment: string; count: number }[]>([])
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      const data = await mockSocialListening(keyword)
      setResults(data)
    } catch (error) {
      console.error("Error:", error)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprinklr</CardTitle>
        <CardDescription>Social listening tool to analyze sentiment around keywords</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword or Hashtag</Label>
          <Input
            id="keyword"
            placeholder="Enter a keyword or hashtag to analyze"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleActivate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Analyze Sentiment
              </>
            )}
          </Button>
        </div>
        {results.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Sentiment Analysis:</h4>
            <div className="grid grid-cols-3 gap-2">
              {results.map((result, index) => (
                <div key={index} className="text-center">
                  <Badge
                    variant={
                      result.sentiment === "positive"
                        ? "success"
                        : result.sentiment === "negative"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {result.sentiment}
                  </Badge>
                  <p className="text-2xl font-bold mt-1">{result.count}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function JasperAITool() {
  const [topic, setTopic] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      const generatedContent = await mockContentWriting(topic)
      setContent(generatedContent)
    } catch (error) {
      console.error("Error:", error)
      setContent("An error occurred. Please try again.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jasper AI</CardTitle>
        <CardDescription>AI-powered content writing assistant</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="topic">Content Topic</Label>
          <Input
            id="topic"
            placeholder="Enter a topic for your content"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleActivate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>
        {content && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Generated Content:</h4>
            <Textarea value={content} readOnly className="w-full h-32" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FlickAITool() {
  const [content, setContent] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleActivate = async () => {
    setLoading(true)
    try {
      const optimizedHashtags = await mockHashtagOptimization(content)
      setHashtags(optimizedHashtags)
    } catch (error) {
      console.error("Error:", error)
      setHashtags([])
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flick AI</CardTitle>
        <CardDescription>Hashtag and SEO optimization for your content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32"
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleActivate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Hash className="mr-2 h-4 w-4" />
                Optimize Hashtags
              </>
            )}
          </Button>
        </div>
        {hashtags.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Optimized Hashtags:</h4>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <Badge key={index} variant="secondary">
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

