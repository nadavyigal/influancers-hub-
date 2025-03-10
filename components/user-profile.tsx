import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Twitter } from "lucide-react"

export function UserProfile() {
  return (
    <Card className="w-full md:w-80">
      <CardHeader className="pb-2">
        <CardTitle>Profile Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Jane Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <h3 className="text-lg font-bold">Jane Doe</h3>
          <p className="text-sm text-muted-foreground mb-2">Lifestyle & Fashion Influencer</p>

          <div className="flex space-x-2 mb-4">
            <Badge variant="outline" className="flex items-center">
              <Instagram className="h-3 w-3 mr-1" />
              650K
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Youtube className="h-3 w-3 mr-1" />
              320K
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Twitter className="h-3 w-3 mr-1" />
              180K
            </Badge>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Followers</span>
              <span className="font-medium">1.2M</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Engagement</span>
              <span className="font-medium">4.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Content Created</span>
              <span className="font-medium">342 posts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Campaigns</span>
              <span className="font-medium">24 completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

