"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Store } from "lucide-react"
import { AccountCard } from "./components/account-card"
import { NavigationTabs } from "./components/navigation-tabs"
import { BalanceCard } from "./components/balance-card"
import { PurchaseHistory } from "./components/purchase-history"
import { useAuth } from "./contexts/auth-context"
import { useAccounts } from "./hooks/use-accounts"

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const { accounts } = useAccounts()
  const [activeTab, setActiveTab] = useState("available")
  const [quantities, setQuantities] = useState({
    spotify: 1,
    youtube: 1,
    disney: 1,
  })
  const [userBalance, setUserBalance] = useState(0)

  // Update balance from localStorage
  useEffect(() => {
    const updateBalance = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserBalance(parsedUser.balance || 0)
      }
    }

    updateBalance()
    // Listen for storage changes
    window.addEventListener("storage", updateBalance)
    return () => window.removeEventListener("storage", updateBalance)
  }, [])

  const handleQuantityChange = (accountId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [accountId]: quantity,
    }))
  }

  const handlePurchaseSuccess = () => {
    // Update balance after purchase
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserBalance(parsedUser.balance || 0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm mb-4">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-semibold">Account Store</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user?.username}!</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Role indicator for user */}
        <Card className="bg-blue-50 mb-4">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">User Dashboard</span>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <BalanceCard balance={userBalance} />

        {/* Navigation Tabs */}
        <Card className="bg-white/90 backdrop-blur-sm mb-4">
          <CardContent className="p-4">
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} isAdmin={false} />
          </CardContent>
        </Card>

        {/* Account Cards */}
        {activeTab === "available" && (
          <div className="space-y-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                accountId={account.id}
                title={account.title}
                price={account.price}
                quantity={quantities[account.id as keyof typeof quantities]}
                onQuantityChange={(quantity) => handleQuantityChange(account.id, quantity)}
                userBalance={userBalance}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            ))}
          </div>
        )}

        {activeTab === "purchase" && <PurchaseHistory />}

        {activeTab === "wallet" && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No wallet transactions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
