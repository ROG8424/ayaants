"use client"

import { Button } from "@/components/ui/button"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isAdmin?: boolean
}

export function NavigationTabs({ activeTab, onTabChange, isAdmin = false }: NavigationTabsProps) {
  const tabs = [
    { id: "available", label: "Available Accounts" },
    { id: "purchase", label: "Purchase History" },
    { id: "wallet", label: "Wallet History" },
    ...(isAdmin
      ? [
          { id: "upload", label: "Upload Accounts" },
          { id: "manage", label: "Manage Users" },
          { id: "sales", label: "Sales History" },
        ]
      : []),
  ]

  return (
    <div className="flex overflow-x-auto gap-1 pb-2 mb-4">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          className={`whitespace-nowrap text-xs ${
            activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
