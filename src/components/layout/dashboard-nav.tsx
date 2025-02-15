"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardNav() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center gap-4">
          <Input
            type="search"
            placeholder="Search transactions..."
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </div>
  )
} 