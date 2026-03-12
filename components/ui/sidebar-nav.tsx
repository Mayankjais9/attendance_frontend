"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface SidebarNavItem {
  title: string
  href: string
  icon: LucideIcon
  active?: boolean
}

interface SidebarNavProps {
  items: SidebarNavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="space-y-2 p-4">
      {items.map((item) => (
        <Button
          key={item.href}
          variant={item.active ? "secondary" : "ghost"}
          className={cn("w-full justify-start gap-2", item.active && "bg-secondary text-secondary-foreground")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
