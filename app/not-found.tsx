import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tools">
              Tools
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Looking for something specific? Try one of these popular pages:
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Link href="/ai-assistant" className="text-sm text-primary hover:underline">AI Assistant</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/tools" className="text-sm text-primary hover:underline">Tools</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">Dashboard</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/create" className="text-sm text-primary hover:underline">Create Content</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 