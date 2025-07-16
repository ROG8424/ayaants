"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthContextType } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database (in real app, this would be server-side)
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    balance: 1250.0,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    balance: 15.5,
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    username: "jane_smith",
    email: "jane@example.com",
    role: "user",
    balance: 0.0,
    createdAt: "2024-01-03",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Auto-redirect to appropriate dashboard if on home page
        if (window.location.pathname === "/") {
          redirectToDashboard(parsedUser)
        }
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const redirectToDashboard = (user: User) => {
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/user")
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by email (in real app, password would be hashed and verified server-side)
    const foundUser = mockUsers.find((u) => u.email === email)

    if (!foundUser) {
      setIsLoading(false)
      return { success: false, error: "User not found" }
    }

    // In real app, verify password hash here
    if (password !== "password123") {
      setIsLoading(false)
      return { success: false, error: "Invalid password" }
    }

    setUser(foundUser)
    localStorage.setItem("user", JSON.stringify(foundUser))

    // Auto-redirect based on role
    redirectToDashboard(foundUser)

    setIsLoading(false)
    return { success: true }
  }

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      setIsLoading(false)
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: "user",
      balance: 0.0,
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Auto-redirect based on role
    redirectToDashboard(newUser)

    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
