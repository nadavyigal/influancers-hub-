"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { AIAssistant } from "@/components/ai-assistant"
import { UserContent } from "@/components/user-content"
import { MediaManager } from "./media-manager"
import { Activity, Eye, Heart, MessageCircle, Share2, TrendingUp, Users } from "lucide-react"

const metricOptions = [
  { value: "followers", label: "Followers", icon: Users },
  { value: "likes", label: "Likes", icon: Heart },
  { value: "comments", label: "Comments", icon: MessageCircle },
  { value: "shares", label: "Shares", icon: Share2 },
  { value: "views", label: "Views", icon: Eye },
  { value: "engagement", label: "Engagement Rate", icon: Activity },
]

const data = [
  { name: "Jan", followers: 4000, likes: 2400, comments: 2400 },
  { name: "Feb", followers: 3000, likes: 1398, comments: 2210 },
  { name: "Mar", followers: 2000, likes: 9800, comments: 2290 },
  { name: "Apr", followers: 2780, likes: 3908, comments: 2000 },
  { name: "May", followers: 1890, likes: 4800, comments: 2181 },
  { name: "Jun", followers: 2390, likes: 3800, comments: 2500 },
  { name: "Jul", followers: 3490, likes: 4300, comments: 2100 },
]

export function MainDashboard() {
  const [selectedMetrics, setSelectedMetrics] = useState(["followers", "likes"])
  const [timeRange, setTimeRange] = useState("7d")
  const [instagramHandle, setInstagramHandle] = useState("@janedoe")
  const [timeFilter, setTimeFilter] = useState("weekly")

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Customize your dashboard by selecting the metrics you want to see.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              {metricOptions.map((metric) => (
                <div key={metric.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.value}
                    checked={selectedMetrics.includes(metric.value)}
                    onCheckedChange={() => handleMetricToggle(metric.value)}
                  />
                  <Label htmlFor={metric.value} className="flex items-center">
                    <metric.icon className="w-4 h-4 mr-2" />
                    {metric.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <Label htmlFor="timeRange">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.map((metric, index) => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {selectedMetrics.map((metric) => (
          <MetricCard
            key={metric}
            title={metricOptions.find((m) => m.value === metric)?.label || ""}
            value={data[data.length - 1][metric]}
            change={(((data[data.length - 1][metric] - data[0][metric]) / data[0][metric]) * 100).toFixed(2)}
            icon={metricOptions.find((m) => m.value === metric)?.icon || TrendingUp}
          />
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>AI Assistant Insights</CardTitle>
          <CardDescription>Get personalized recommendations and insights from our AI assistant.</CardDescription>
        </CardHeader>
        <CardContent>
          <AIAssistant metrics={selectedMetrics} data={data} />
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Your Content</CardTitle>
          <CardDescription>Manage and view your user-generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <UserContent />
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Media Manager</CardTitle>
          <CardDescription>Upload and manage your media files</CardDescription>
        </CardHeader>
        <CardContent>
          <MediaManager />
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, change, icon: Icon }) {
  const isPositive = Number.parseFloat(change) >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {change}%
        </p>
      </CardContent>
    </Card>
  )
}

