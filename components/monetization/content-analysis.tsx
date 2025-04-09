"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, PieChart, LineChart } from "lucide-react"

export function ContentAnalysis() {
  const [activeTab, setActiveTab] = useState("engagement")

  // Mock data for content analysis
  const engagementData = [
    { category: "Lifestyle", percentage: 85 },
    { category: "Fashion", percentage: 72 },
    { category: "Travel", percentage: 68 },
    { category: "Food", percentage: 45 },
    { category: "Fitness", percentage: 38 },
  ]

  const audienceData = [
    { demographic: "18-24", percentage: 35 },
    { demographic: "25-34", percentage: 45 },
    { demographic: "35-44", percentage: 15 },
    { demographic: "45+", percentage: 5 },
  ]

  const contentTypeData = [
    { type: "Photos", count: 65, engagement: "High" },
    { type: "Videos", count: 25, engagement: "Medium" },
    { type: "Carousels", count: 10, engagement: "Very High" },
  ]

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "Very High":
        return "bg-green-500 text-white"
      case "High":
        return "bg-emerald-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="engagement">
            <BarChart className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="audience">
            <PieChart className="h-4 w-4 mr-2" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="content">
            <LineChart className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Top Performing Categories</h3>
              <div className="space-y-4">
                {engagementData.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
              <div className="space-y-4">
                {audienceData.map((item) => (
                  <div key={item.demographic} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Age {item.demographic}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Content Type Analysis</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium">Type</div>
                  <div className="text-sm font-medium">Count</div>
                  <div className="text-sm font-medium">Engagement</div>
                </div>
                {contentTypeData.map((item) => (
                  <div key={item.type} className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-sm">{item.type}</div>
                    <div className="text-sm">{item.count}</div>
                    <Badge className={getEngagementColor(item.engagement)}>
                      {item.engagement}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 p-4 rounded-lg border border-border">
        <h3 className="text-sm font-medium mb-2">Content Analysis Summary</h3>
        <p className="text-sm text-muted-foreground">
          Your content performs best in the <strong>Lifestyle</strong> and <strong>Fashion</strong> categories. 
          Your audience is primarily in the <strong>25-34</strong> age range, and <strong>Carousel</strong> posts 
          generate the highest engagement. These insights will be used to generate monetization strategies.
        </p>
      </div>
    </div>
  )
} 