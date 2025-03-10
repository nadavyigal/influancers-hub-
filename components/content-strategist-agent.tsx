"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Hash, Sparkles, Upload, Image as ImageIcon, Video, Check, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

// Mock API functions for the Content Strategist agent
const mockGenerateCaption = async (niche: string, tone: string, topic: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1800)) // Simulate API delay
  
  const captions = [
    `✨ Elevate your ${niche} game with these insider tips! What's your favorite ${topic} hack? Share below! #${niche.replace(/\s+/g, "")} #${topic.replace(/\s+/g, "")}`,
    `The secret to mastering ${topic} isn't what you think... 👀 Swipe to see how I transformed my approach to ${niche}! #GameChanger #${niche.replace(/\s+/g, "")}`,
    `${tone === 'professional' ? 'Professional insight:' : tone === 'casual' ? 'Real talk:' : 'Hot take:'} ${topic} is changing the ${niche} landscape. Here's how to stay ahead of the curve... 📈 #Trending #${topic.replace(/\s+/g, "")}`
  ]
  
  return captions
}

const mockGenerateHashtags = async (niche: string, topic: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
  
  // Generate hashtags based on niche and topic
  const baseHashtags = [`#${niche.replace(/\s+/g, "")}`, `#${topic.replace(/\s+/g, "")}`]
  const trendingHashtags = [
    "#ContentCreator", 
    "#DigitalMarketing", 
    "#SocialMediaTips", 
    "#InfluencerMarketing", 
    "#GrowthHacking",
    "#TrendAlert",
    "#ViralContent",
    "#CreatorEconomy"
  ]
  
  // Mix specific and trending hashtags
  return [...baseHashtags, ...trendingHashtags.slice(0, 8)]
}

// Mock function to generate reel designs
const mockGenerateReels = async (imageUrl: string, caption: string, hashtags: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 2500)) // Simulate API delay
  
  // Generate mock reel designs
  const reelDesigns = [
    {
      id: 1,
      name: "Modern Gradient",
      previewUrl: "/placeholder.svg?height=400&width=225&text=Modern+Gradient+Reel",
      description: "Clean design with gradient background and centered text"
    },
    {
      id: 2,
      name: "Bold Typography",
      previewUrl: "/placeholder.svg?height=400&width=225&text=Bold+Typography+Reel",
      description: "Emphasizes text with dynamic font sizes and minimal background"
    },
    {
      id: 3,
      name: "Framed Content",
      previewUrl: "/placeholder.svg?height=400&width=225&text=Framed+Content+Reel",
      description: "Your image with elegant frame and caption overlay"
    }
  ]
  
  return reelDesigns
}

export function ContentStrategistAgent() {
  const [niche, setNiche] = useState("")
  const [tone, setTone] = useState("casual")
  const [topic, setTopic] = useState("")
  const [captions, setCaptions] = useState<string[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  
  // New state for image upload and reel generation
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null)
  const [reelDesigns, setReelDesigns] = useState<any[]>([])
  const [isGeneratingReels, setIsGeneratingReels] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleActivate = async () => {
    setLoading(true)
    try {
      // Generate both captions and hashtags
      const [generatedCaptions, generatedHashtags] = await Promise.all([
        mockGenerateCaption(niche, tone, topic),
        mockGenerateHashtags(niche, topic)
      ])
      
      setCaptions(generatedCaptions)
      setHashtags(generatedHashtags)
    } catch (error) {
      console.error("Error:", error)
      setCaptions(["An error occurred. Please try again."])
      setHashtags([])
    }
    setLoading(false)
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    
    // Create a URL for the uploaded image
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }
  
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  const handleCaptionSelect = (caption: string) => {
    setSelectedCaption(caption === selectedCaption ? null : caption)
  }
  
  const handleGenerateReels = async () => {
    if (!uploadedImage || !selectedCaption) return
    
    setIsGeneratingReels(true)
    try {
      const designs = await mockGenerateReels(uploadedImage, selectedCaption, hashtags)
      setReelDesigns(designs)
    } catch (error) {
      console.error("Error generating reels:", error)
    }
    setIsGeneratingReels(false)
  }
  
  const canGenerateReels = uploadedImage !== null && selectedCaption !== null && hashtags.length > 0

  return (
    <Card className="col-span-2">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <CardTitle>Content Strategist Agent</CardTitle>
        </div>
        <CardDescription>
          AI-powered digital marketing expert specializing in audience growth and engagement
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="reels">Create Reels</TabsTrigger>
            <TabsTrigger value="about">About This Agent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niche">Your Niche</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Fashion, Fitness, Tech, Travel"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tone">Content Tone</Label>
                <select
                  id="tone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="casual">Casual & Friendly</option>
                  <option value="professional">Professional & Informative</option>
                  <option value="motivational">Motivational & Inspiring</option>
                  <option value="humorous">Humorous & Entertaining</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Content Topic</Label>
              <Input
                id="topic"
                placeholder="What specific topic are you posting about?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleActivate} 
              disabled={loading || !niche || !topic} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Strategic Content...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Captions & Hashtags
                </>
              )}
            </Button>
            
            {captions.length > 0 && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center mb-3">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                    Suggested Captions
                  </h3>
                  <div className="space-y-3">
                    {captions.map((caption, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{caption}</p>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(caption)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold flex items-center mb-3">
                    <Hash className="h-5 w-5 mr-2 text-green-500" />
                    Trending Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(hashtags.join(' '))}
                    >
                      Copy All Hashtags
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Ready to create visual content with these captions and hashtags?
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => setActiveTab("reels")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Continue to Reel Creation
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reels" className="space-y-6 pt-4">
            <div className="bg-muted/30 p-4 rounded-md border border-border">
              <h3 className="text-lg font-semibold mb-3">Create Engaging Reels</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload an image, select a caption, and generate professionally designed reels for your content.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Upload Your Image
                  </h4>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  
                  <div 
                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                      uploadedImage ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/10' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={triggerFileInput}
                  >
                    {isUploading ? (
                      <div className="py-8 flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </div>
                    ) : uploadedImage ? (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded" 
                          className="max-h-[200px] mx-auto rounded-md"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Click to change image</p>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Caption Selection Section */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                    Select a Caption
                  </h4>
                  
                  {captions.length > 0 ? (
                    <div className="space-y-2">
                      {captions.map((caption, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-md border cursor-pointer transition-all ${
                            selectedCaption === caption 
                              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                              : 'border-border bg-background hover:border-primary/30'
                          }`}
                          onClick={() => handleCaptionSelect(caption)}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{caption}</p>
                            {selectedCaption === caption && (
                              <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-md text-center">
                      <p className="text-sm text-muted-foreground">
                        No captions generated yet. Go to the "Generate Content" tab first.
                      </p>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0 h-auto"
                        onClick={() => setActiveTab("generate")}
                      >
                        Generate captions
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                disabled={!canGenerateReels || isGeneratingReels}
                onClick={handleGenerateReels}
              >
                {isGeneratingReels ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Designing Reels...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Reel Designs
                  </>
                )}
              </Button>
            </div>
            
            {/* Reel Designs Results */}
            {reelDesigns.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Video className="h-5 w-5 mr-2 text-purple-500" />
                  Your Custom Reel Designs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reelDesigns.map((design) => (
                    <div key={design.id} className="border rounded-md overflow-hidden bg-background">
                      <div className="aspect-[9/16] relative bg-muted">
                        <img 
                          src={design.previewUrl} 
                          alt={design.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">{design.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{design.description}</p>
                        <div className="flex justify-between mt-3">
                          <Button variant="outline" size="sm">Preview</Button>
                          <Button size="sm">Download</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4 pt-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">About Content Strategist Agent</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A professional digital marketing expert specializing in audience growth and engagement. 
                This agent focuses on creating engaging captions, selecting high-performing hashtags,
                and generating visually appealing reel designs tailored to your specific niche and content style.
              </p>
              
              <h4 className="font-medium mb-1">Capabilities:</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Analyzes your niche and preferred tone</li>
                <li>Generates multiple caption options aligned with your branding</li>
                <li>Recommends trending hashtags optimized for audience engagement</li>
                <li>Creates professionally designed reels from your images</li>
                <li>Helps maintain consistent voice across your content</li>
                <li>Suggests content strategies based on current trends</li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Technical details:</strong> This agent is powered by a combination of ChatGPT, 
                  Jasper AI, and Flick AI tools with a temperature setting of 0.7 for creative yet 
                  consistent outputs.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 