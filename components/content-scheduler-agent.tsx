"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, InfoIcon } from "lucide-react"

export function ContentSchedulerAgent() {
  const [content, setContent] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)

  const handleSchedule = async () => {
    setIsScheduling(true)
    // Mock scheduling delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsScheduling(false)
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
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Schedule
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
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSchedule}
                disabled={!content || isScheduling}
              >
                {isScheduling ? "Analyzing Best Times..." : "Schedule Content"}
              </Button>
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