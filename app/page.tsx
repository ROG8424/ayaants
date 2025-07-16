"use client"

import { useAuth } from "../contexts/auth-context"
import { AuthPage } from "../components/auth/auth-page"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Store, User } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  // Auto-redirect if user is logged in
  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/user")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />
  }

  // This will rarely be shown as user gets auto-redirected, but keeping as fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Store className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Account Store</h1>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{user.role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/user" className="block">
              <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white">
                <User className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">User Dashboard</div>
                  <div className="text-sm opacity-90">Browse and purchase accounts</div>
                </div>
              </Button>
            </Link>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Account Info</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Balance: ${user.balance.toFixed(2)}</div>
                <div>Member since: {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
