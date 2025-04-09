import type React from "react"
import { BarChart3, Home, Settings, Users, Wrench, Send, LogOut, HelpCircle, DollarSign, PlusCircle, FileVideo, Layers, Bot, Hammer } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur-sm border-r border-border/40 h-screen transition-all duration-300 flex flex-col shadow-lg",
        open ? "w-64" : "w-20",
      )}
    >
      <div className="p-4 flex items-center justify-center h-20 border-b border-border/40 bg-gradient-to-r from-primary/10 to-background">
        {open ? (
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Influencer&apos;s Hub</h1>
        ) : (
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">IH</span>
        )}
      </div>

      <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
        <div className="px-4 mb-6">
          {open && <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 px-2">Main Menu</h2>}
          <nav className="space-y-1.5">
            <NavItem icon={Home} label="Dashboard" href="/dashboard" open={open} active={pathname === '/dashboard'} />
            <NavItem icon={Hammer} label="Content Tools" href="/content-tools" open={open} active={pathname === '/content-tools'} />
            <NavItem icon={Layers} label="My Content" href="/dashboard/content" open={open} active={pathname === '/dashboard/content'} />
            <NavItem icon={DollarSign} label="Monetization" href="/monetization" open={open} active={pathname === '/monetization'} />
            <NavItem icon={Bot} label="AI Assistant" href="/ai-assistant" open={open} active={pathname === '/ai-assistant'} />
          </nav>
        </div>
        
        <div className="px-4 mb-6">
          {open && <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 px-2">Analytics</h2>}
          <nav className="space-y-1.5">
            <NavItem icon={BarChart3} label="Reporting" href="/reporting" open={open} active={pathname === '/reporting'} />
            <NavItem icon={Send} label="Sendbox" href="/sendbox" open={open} active={pathname === '/sendbox'} />
            <NavItem icon={Users} label="Audience" href="/audience" open={open} active={pathname === '/audience'} />
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border/40 bg-gradient-to-r from-background to-primary/5">
        <nav className="space-y-1.5">
          <NavItem icon={HelpCircle} label="Help & Support" href="/help" open={open} active={pathname === '/help'} />
          <NavItem icon={Settings} label="Settings" href="/settings" open={open} active={pathname === '/settings'} />
          <NavItem icon={LogOut} label="Logout" href="/logout" open={open} />
        </nav>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  open: boolean
  active?: boolean
}

function NavItem({ icon: Icon, label, href, open, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
        active 
          ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-l-2 border-primary" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-l-2 hover:border-primary/50",
        !open && "justify-center"
      )}
    >
      <Icon className={cn("flex-shrink-0", open ? "h-5 w-5" : "h-6 w-6")} />
      {open && <span className="ml-3 font-medium">{label}</span>}
    </Link>
  )
}

