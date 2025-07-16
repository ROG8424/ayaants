"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, Plus, Users, Upload, BarChart3 } from "lucide-react"
import { AccountCard } from "./components/account-card"
import { NavigationTabs } from "./components/navigation-tabs"
import { BalanceCard } from "./components/balance-card"
import { useAuth } from "./contexts/auth-context"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("available")
  const [quantities, setQuantities] = useState({
    spotify: 1,
    youtube: 1,
    disney: 1,
  })

  const adminBalance = user?.balance || 0.0

  const accounts = [
    { id: "spotify", title: "Spotify Premium", price: 3.99, stock: 2 },
    { id: "youtube", title: "YouTube Premium", price: 4.99, stock: 1 },
    { id: "disney", title: "Disney Plus", price: 6.99, stock: 1 },
  ]

  const handleQuantityChange = (accountId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [accountId]: quantity,
    }))
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

        {/* Role indicator for admin */}
        <Card className="bg-green-50 mb-4">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Admin Dashboard</span>
            </div>
            <Link href="/user">
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Switch to User View
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <BalanceCard balance={adminBalance} isAdmin={true} />

        {/* Navigation Tabs */}
        <Card className="bg-white/90 backdrop-blur-sm mb-4">
          <CardContent className="p-4">
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} />
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === "available" && (
          <div className="space-y-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                title={account.title}
                price={account.price}
                stock={account.stock}
                quantity={quantities[account.id as keyof typeof quantities]}
                onQuantityChange={(quantity) => handleQuantityChange(account.id, quantity)}
                userBalance={adminBalance}
                isAdmin={true}
              />
            ))}
          </div>
        )}

        {activeTab === "upload" && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Accounts
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="service">Service Type</Label>
                <Input id="service" placeholder="e.g., Netflix Premium" />
              </div>
              <div>
                <Label htmlFor="price">Price per Account</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="accounts">Account Details</Label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={4}
                  placeholder="Enter account credentials (one per line)"
                />
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload Accounts
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "manage" && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manage Users
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">john_doe</p>
                    <p className="text-sm text-gray-500">Balance: $15.50</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">jane_smith</p>
                    <p className="text-sm text-gray-500">Balance: $0.00</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "sales" && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales History
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">$127.50</p>
                  <p className="text-sm text-gray-600">Today's Sales</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">45</p>
                  <p className="text-sm text-gray-600">Accounts Sold</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Spotify Premium</p>
                    <p className="text-sm text-gray-500">Sold to: john_doe</p>
                  </div>
                  <p className="font-semibold text-green-600">$3.99</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">YouTube Premium</p>
                    <p className="text-sm text-gray-500">Sold to: jane_smith</p>
                  </div>
                  <p className="font-semibold text-green-600">$4.99</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(activeTab === "purchase" || activeTab === "wallet") && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {activeTab === "purchase" ? "No purchase history found" : "No wallet transactions found"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
