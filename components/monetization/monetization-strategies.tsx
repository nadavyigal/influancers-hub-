"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DollarSign, ShoppingBag, Users, TrendingUp, ChevronDown, ChevronUp, Star, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface MonetizationStrategy {
  id: string
  title: string
  description: string
  category: string
  potentialRevenue: string
  difficulty: string
  timeToImplement: string
  steps: string[]
  tools?: string[]
}

interface MonetizationStrategiesProps {
  strategies: MonetizationStrategy[]
}

export function MonetizationStrategies({ strategies = [] }: MonetizationStrategiesProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("all")
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null)

  // If no strategies are provided, use mock data
  const mockStrategies: MonetizationStrategy[] = [
    {
      id: "brand-partnerships",
      title: "Brand Partnerships",
      description: "Partner with lifestyle and fashion brands that align with your content themes.",
      category: "sponsorships",
      potentialRevenue: "$1,000 - $5,000 per post",
      difficulty: "Medium",
      timeToImplement: "1-3 months",
      steps: [
        "Identify 10-15 brands that align with your lifestyle and fashion content",
        "Create a media kit highlighting your engagement metrics",
        "Reach out to brand marketing departments with personalized pitches",
        "Negotiate rates based on deliverables (posts, stories, videos)",
        "Create a content calendar for sponsored posts"
      ],
      tools: ["Media Kit Template", "Brand Outreach Email Templates", "Rate Calculator"]
    },
    {
      id: "affiliate-marketing",
      title: "Affiliate Marketing Program",
      description: "Promote products you already use and earn commission on sales.",
      category: "affiliate",
      potentialRevenue: "$500 - $2,000 per month",
      difficulty: "Low",
      timeToImplement: "1-2 weeks",
      steps: [
        "Join affiliate programs for fashion and lifestyle brands (Amazon, RewardStyle, etc.)",
        "Create authentic product recommendations in your content",
        "Add affiliate links to your bio and content descriptions",
        "Track performance and focus on high-converting products",
        "Create dedicated shopping guides for your audience"
      ]
    },
    {
      id: "digital-products",
      title: "Digital Products & Courses",
      description: "Create and sell digital products based on your expertise.",
      category: "products",
      potentialRevenue: "$2,000 - $10,000 per launch",
      difficulty: "High",
      timeToImplement: "3-6 months",
      steps: [
        "Identify your unique expertise that provides value to your audience",
        "Create a digital product outline (course, ebook, templates)",
        "Develop the product with professional design and content",
        "Set up payment processing and delivery system",
        "Create a launch strategy with email marketing and social promotion"
      ],
      tools: ["Course Platform Recommendations", "Pricing Strategy Guide", "Launch Timeline Template"]
    },
    {
      id: "membership-community",
      title: "Premium Membership Community",
      description: "Create a subscription-based community with exclusive content.",
      category: "subscription",
      potentialRevenue: "$1,000 - $3,000 per month",
      difficulty: "Medium",
      timeToImplement: "2-3 months",
      steps: [
        "Define the exclusive value you'll provide to members",
        "Choose a platform for your community (Patreon, Circle, etc.)",
        "Create tiered membership levels with different benefits",
        "Develop a content calendar for exclusive content",
        "Launch with a founding member discount to build initial membership"
      ]
    }
  ]

  const displayStrategies = strategies.length > 0 ? strategies : mockStrategies

  const filteredStrategies = activeTab === "all" 
    ? displayStrategies 
    : displayStrategies.filter(strategy => strategy.category === activeTab)

  const handleDownload = (strategyId: string) => {
    toast({
      title: "Strategy downloaded",
      description: "The monetization strategy has been downloaded as a PDF.",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Low":
        return "bg-green-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "High":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sponsorships":
        return <DollarSign className="h-4 w-4" />
      case "affiliate":
        return <ShoppingBag className="h-4 w-4" />
      case "products":
        return <Star className="h-4 w-4" />
      case "subscription":
        return <Users className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredStrategies.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No strategies found for this category.</p>
              </CardContent>
            </Card>
          ) : (
            filteredStrategies.map((strategy) => (
              <Collapsible 
                key={strategy.id}
                open={expandedStrategy === strategy.id}
                onOpenChange={() => {
                  setExpandedStrategy(expandedStrategy === strategy.id ? null : strategy.id)
                }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {getCategoryIcon(strategy.category)}
                          <span className="ml-1 capitalize">{strategy.category}</span>
                        </Badge>
                        <Badge className={getDifficultyColor(strategy.difficulty)}>
                          {strategy.difficulty}
                        </Badge>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {expandedStrategy === strategy.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CardTitle className="text-xl">{strategy.title}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Potential Revenue</p>
                          <p className="text-sm text-muted-foreground">{strategy.potentialRevenue}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Time to Implement</p>
                          <p className="text-sm text-muted-foreground">{strategy.timeToImplement}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Implementation Steps</p>
                        <ol className="list-decimal list-inside space-y-1">
                          {strategy.steps.map((step, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      {strategy.tools && (
                        <div>
                          <p className="text-sm font-medium mb-2">Recommended Tools</p>
                          <ul className="list-disc list-inside space-y-1">
                            {strategy.tools.map((tool, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{tool}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDownload(strategy.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Strategy
                      </Button>
                    </CardFooter>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 