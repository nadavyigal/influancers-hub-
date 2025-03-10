"use client"

import { Bell, Menu, User, LogOut, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { signOutUser } from "@/lib/firebase-auth"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { NotificationCenter } from "@/components/notification-center"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { userProfile } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutUser()
    router.push("/login")
  }

  const navigateToProfile = () => {
    router.push("/dashboard/settings")
  }

  return (
    <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4 text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-64 pl-9 h-9 bg-muted/50 border-muted focus-visible:bg-background" 
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <NotificationCenter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 h-9 rounded-full pl-1 pr-3 hover:bg-muted/50">
              <Avatar className="h-7 w-7 border border-primary/20">
                <AvatarImage src={userProfile?.photoURL || "/placeholder.svg?height=32&width=32"} alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                  {userProfile?.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{userProfile?.displayName || "User"}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{userProfile?.displayName || "User"}</span>
                <span className="text-xs text-muted-foreground">{userProfile?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={navigateToProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

