import { Metadata } from "next"
import { MonetizationDashboard } from "@/components/monetization/monetization-dashboard"

export const metadata: Metadata = {
  title: "Monetization | Influencer's Hub",
  description: "Monetize your social media content with AI-powered strategies",
}

export default function MonetizationPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Monetization Hub</h1>
        <p className="text-muted-foreground">
          Analyze your content and discover personalized monetization strategies
        </p>
      </div>
      
      <MonetizationDashboard />
    </div>
  )
} 