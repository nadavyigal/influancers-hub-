"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, InfoIcon, FilmIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock reels data from other agents
const mockReels = [
  { id: 1, title: "Summer Fashion Tips", agent: "Content Writer", duration: "0:45" },
  { id: 2, title: "Product Review: New Skincare Line", agent: "Content Reviewer", duration: "1:20" },
  { id: 3, title: "Behind the Scenes: Photo Shoot", agent: "Content Writer", duration: "0:55" },
  { id: 4, title: "5 Minute Makeup Tutorial", agent: "Idea Generator", duration: "5:00" },
  { id: 5, title: "Brand Partnership Announcement", agent: "Campaign Manager", duration: "0:30" },
];

interface ContentSchedulerAgentProps {
  apiKey?: string;
}

function ContentSchedulerAgentBase({ apiKey }: ContentSchedulerAgentProps) {
  const [content, setContent] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedReels, setSelectedReels] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("schedule")

  const handleSchedule = async () => {
    setIsScheduling(true)
    // Here you would use the apiKey for OpenAI API calls
    console.log("Using API key:", apiKey)
    // Mock scheduling delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsScheduling(false)
  }

  const toggleReelSelection = (reelId: number) => {
    setSelectedReels(prev => 
      prev.includes(reelId) 
        ? prev.filter(id => id !== reelId) 
        : [...prev, reelId]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-600">Content Scheduler</CardTitle>
        <CardDescription>
          Schedule your content for optimal posting times across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="schedule" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex items-center gap-2">
              <FilmIcon className="w-4 h-4" />
              Reels
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Best Times
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="content">Content to Schedule</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your content here or receive it from the Content Strategist"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-32"
                />
              </div>
              
              {selectedReels.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-700 mb-2">
                    {selectedReels.length} reel{selectedReels.length > 1 ? 's' : ''} selected for scheduling
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("reels")}
                  >
                    View Selected Reels
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Posting Time</Label>
                  <Select>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimal">Optimal Time (AI Recommended)</SelectItem>
                      <SelectItem value="morning">Morning (8AM - 11AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                      <SelectItem value="night">Night (9PM - 12AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSchedule}
                disabled={(!content && selectedReels.length === 0) || isScheduling}
              >
                {isScheduling ? "Analyzing Best Times..." : "Schedule Content"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reels">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Reels from Other Agents</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select reels to include in your content schedule
              </p>
              
              <div className="space-y-3">
                {mockReels.map(reel => (
                  <div key={reel.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50">
                    <Checkbox 
                      id={`reel-${reel.id}`} 
                      checked={selectedReels.includes(reel.id)}
                      onCheckedChange={() => toggleReelSelection(reel.id)}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`reel-${reel.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {reel.title}
                      </Label>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="mr-3">By: {reel.agent}</span>
                        <span>Duration: {reel.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedReels.length > 0 && (
                <Button 
                  className="w-full mt-4"
                  onClick={() => setActiveTab("schedule")}
                >
                  Continue to Scheduling ({selectedReels.length} selected)
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Optimal Posting Times</h3>
              <p className="text-muted-foreground">
                Based on your audience engagement patterns, here are the best times to post:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Instagram</span>
                  <span className="font-medium">Tuesdays & Thursdays, 11 AM - 2 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Twitter</span>
                  <span className="font-medium">Weekdays, 8 AM - 10 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Facebook</span>
                  <span className="font-medium">Wednesdays, 1 PM - 3 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>LinkedIn</span>
                  <span className="font-medium">Tuesdays - Thursdays, 9 AM - 12 PM</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About Content Scheduler</h3>
              <p className="text-muted-foreground">
                The Content Scheduler is a professional digital marketing specialist optimizing content scheduling 
                to maximize audience growth and engagement. It uses AI to determine the best posting times and 
                automate content distribution, but requires your approval before posting.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Analyzes past engagement data to determine the best time to post</li>
                <li>Accepts content input either manually or from the Content Strategist Agent</li>
                <li>Allows selection of reels created by other agents for scheduling</li>
                <li>Generates a proposed posting schedule for your approval</li>
                <li>Waits for explicit user approval before proceeding with auto-posting</li>
                <li>Once approved, posts the content at the scheduled time across multiple platforms</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export const ContentSchedulerAgent = memo(ContentSchedulerAgentBase); 