import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import dynamic from 'next/dynamic'
import { Loader2 } from "lucide-react"

// Simple loading component to show while the layout content is loading
function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
}

// Dynamically import the LayoutContent component with SSR disabled
const LayoutContent = dynamic(
  () => import('@/components/layout-content').catch(err => {
    console.error("Error loading LayoutContent:", err);
    return () => <LoadingFallback />;
  }),
  { 
    loading: () => <LoadingFallback />,
    ssr: false // Disable SSR to prevent hydration issues
  }
)

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "Influencer's Hub",
  description: "AI-powered tools for social media influencers",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}