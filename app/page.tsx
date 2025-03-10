import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Influencer's Hub</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        The all-in-one platform for social media influencers to manage their content, analytics, and audience.
      </p>
      
      <div className="mb-8">
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Link href="/tools">
            Access Content Strategist Agent
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Direct access - no login required
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button asChild size="lg">
          <Link href="/login">
            Login
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg">
          <Link href="/test-login">
            Test Login (Bypass Auth)
          </Link>
        </Button>
        
        <Button asChild variant="secondary" size="lg">
          <Link href="/simple-dashboard">
            Simple Dashboard (No Firebase)
          </Link>
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-muted-foreground">Create, schedule, and manage your content across multiple platforms.</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance with detailed analytics and insights.</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">AI Assistant</h2>
          <p className="text-muted-foreground">Get content ideas, captions, and optimization suggestions powered by AI.</p>
        </div>
      </div>
    </div>
  )
}

