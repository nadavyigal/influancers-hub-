"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { ArrowRight, Lightbulb, RefreshCw } from "lucide-react"

// Mock data for charts
const engagementData = [
  { day: 1, strategyA: 4.2, strategyB: 3.8 },
  { day: 2, strategyA: 4.5, strategyB: 4.1 },
  { day: 3, strategyA: 4.8, strategyB: 4.3 },
  { day: 4, strategyA: 5.1, strategyB: 4.6 },
  { day: 5, strategyA: 5.4, strategyB: 4.9 },
  { day: 6, strategyA: 5.7, strategyB: 5.2 },
  { day: 7, strategyA: 6.0, strategyB: 5.5 },
]

const reachData = [
  { day: 1, strategyA: 12500, strategyB: 11800 },
  { day: 2, strategyA: 13200, strategyB: 12300 },
  { day: 3, strategyA: 14000, strategyB: 12900 },
  { day: 4, strategyA: 14900, strategyB: 13600 },
  { day: 5, strategyA: 15900, strategyB: 14400 },
  { day: 6, strategyA: 17000, strategyB: 15300 },
  { day: 7, strategyA: 18200, strategyB: 16300 },
]

const contentTypes = ["Image Post", "Video Post", "Carousel Post", "Reel", "IGTV", "Story"]

const timeSlots = [
  "6:00 AM - 9:00 AM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
  "9:00 PM - 12:00 AM",
]

export function SendboxForecasting() {
  const [activeTab, setActiveTab] = useState("engagement")
  const [contentTypeA, setContentTypeA] = useState(contentTypes[0])
  const [contentTypeB, setContentTypeB] = useState(contentTypes[1])
  const [timeSlotA, setTimeSlotA] = useState(timeSlots[0])
  const [timeSlotB, setTimeSlotB] = useState(timeSlots[1])
  const [hashtagCountA, setHashtagCountA] = useState(5)
  const [hashtagCountB, setHashtagCountB] = useState(10)
  const [useAI, setUseAI] = useState(true)

  const handleOptimize = () => {
    // In a real application, this would trigger an API call to get AI recommendations
    console.log("Optimizing content strategy...")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sendbox Forecasting</h1>
      <Card>
        <CardHeader>
          <CardTitle>Content Strategy A/B Testing</CardTitle>
          <CardDescription>Compare different content strategies and visualize their projected impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Strategy A</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contentTypeA">Content Type</Label>
                  <Select value={contentTypeA} onValueChange={setContentTypeA}>
                    <SelectTrigger id="contentTypeA">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeSlotA">Posting Time</Label>
                  <Select value={timeSlotA} onValueChange={setTimeSlotA}>
                    <SelectTrigger id="timeSlotA">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hashtagCountA">Number of Hashtags: {hashtagCountA}</Label>
                  <Slider
                    id="hashtagCountA"
                    min={0}
                    max={30}
                    step={1}
                    value={[hashtagCountA]}
                    onValueChange={(value) => setHashtagCountA(value[0])}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Strategy B</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contentTypeB">Content Type</Label>
                  <Select value={contentTypeB} onValueChange={setContentTypeB}>
                    <SelectTrigger id="contentTypeB">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeSlotB">Posting Time</Label>
                  <Select value={timeSlotB} onValueChange={setTimeSlotB}>
                    <SelectTrigger id="timeSlotB">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hashtagCountB">Number of Hashtags: {hashtagCountB}</Label>
                  <Slider
                    id="hashtagCountB"
                    min={0}
                    max={30}
                    step={1}
                    value={[hashtagCountB]}
                    onValueChange={(value) => setHashtagCountB(value[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch id="useAI" checked={useAI} onCheckedChange={setUseAI} />
            <Label htmlFor="useAI">Use AI-driven recommendations</Label>
          </div>
          <Button className="mt-4" onClick={handleOptimize}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Optimize Strategy
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Projected Impact</CardTitle>
          <CardDescription>Visualize the forecasted performance of your content strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="engagement">Engagement Rate</TabsTrigger>
              <TabsTrigger value="reach">Reach</TabsTrigger>
            </TabsList>
            <TabsContent value="engagement">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="strategyA" stroke="#8884d8" name="Strategy A" />
                  <Line type="monotone" dataKey="strategyB" stroke="#82ca9d" name="Strategy B" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="reach">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reachData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="strategyA" fill="#8884d8" name="Strategy A" />
                  <Bar dataKey="strategyB" fill="#82ca9d" name="Strategy B" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI-Driven Recommendations</CardTitle>
          <CardDescription>Get personalized suggestions to improve your content strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-500" />
              <p>
                Consider using more video content in Strategy A to increase engagement. Videos tend to perform well
                during the {timeSlotA} time slot.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-500" />
              <p>
                For Strategy B, try reducing the number of hashtags to {Math.floor(hashtagCountB * 0.7)}. Our analysis
                shows that fewer, more targeted hashtags can lead to better reach.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-500" />
              <p>
                Experiment with carousel posts in both strategies. They've shown higher engagement rates across various
                time slots.
              </p>
            </div>
          </div>
          <Button className="mt-4" variant="outline">
            Generate More Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

