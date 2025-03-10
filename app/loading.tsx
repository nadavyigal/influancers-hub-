import { Loader2 } from "lucide-react"

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Loading application...</p>
      </div>
    </div>
  )
} 