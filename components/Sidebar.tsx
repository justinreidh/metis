// components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LogoutButton from './LogoutButton'

const navItems = [
  { 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    label: 'Candidates', 
    href: '/dashboard/candidates', 
    icon: Users 
  },
  { 
    label: 'Add Candidate', 
    href: '/dashboard/add', 
    icon: UserPlus 
  },
  { 
    label: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart3 
  },
  { 
    label: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings 
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-primary tracking-tight">Metis Talent</h2>
        <p className="text-xs text-muted-foreground mt-1">Hiring Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border mt-auto">
        <LogoutButton />
      </div>
    </div>
  )
}