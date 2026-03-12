"use client"

import type React from "react"

import type { ReactNode } from "react"
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
import { Bell, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function DashboardLayout({
  children,
  sidebar,
  userName = "John Doe",
  userEmail = "john.doe@company.com",
  userAvatar,
}: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("roles")
    // Expire cookies
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "roles=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    try {
      router.push("/")
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] Notification clicked")
    try {
      router.push("/dashboard/employee/notifications")
    } catch (error) {
      console.error("[v0] Navigation error:", error)
    }
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] Profile clicked")
    alert("Profile clicked - functionality can be added here")
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("[v0] Settings clicked")
    alert("Settings clicked - functionality can be added here")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">AttendanceHub</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
              onClick={handleNotificationClick}
              type="button"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-accent"
                  type="button"
                  onClick={(e) => {
                    console.log("[v0] Dropdown trigger clicked")
                    e.stopPropagation()
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 z-[100]"
                align="end"
                side="bottom"
                sideOffset={5}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSettingsClick}
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/20 min-h-[calc(100vh-4rem)]">{sidebar}</aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
