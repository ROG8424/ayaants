"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import { useAccounts } from "./use-accounts"
import type { Account } from "../types/account"

interface PurchaseData {
  accountId: string
  accountTitle: string
  quantity: number
  price: number
  totalPrice: number
}

interface PurchaseResult {
  success: boolean
  purchaseRecord: any
  deliveredAccounts: Account[]
}

export function usePurchase() {
  const { user } = useAuth()
  const { deliverAccounts } = useAccounts()
  const [isLoading, setIsLoading] = useState(false)

  const purchaseAccount = async (purchaseData: PurchaseData): Promise<PurchaseResult> => {
    if (!user) throw new Error("User not authenticated")

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Check if user has sufficient balance
      if (user.balance < purchaseData.totalPrice) {
        throw new Error("Insufficient balance")
      }

      // Generate purchase ID
      const purchaseId = `PUR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create purchase record
      const purchaseRecord = {
        id: purchaseId,
        userId: user.id,
        accountId: purchaseData.accountId,
        accountTitle: purchaseData.accountTitle,
        quantity: purchaseData.quantity,
        price: purchaseData.price,
        totalPrice: purchaseData.totalPrice,
        purchaseDate: new Date().toISOString(),
        status: "completed",
      }

      // Update user balance
      const updatedUser = {
        ...user,
        balance: user.balance - purchaseData.totalPrice,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Deliver accounts
      const deliveredAccounts = deliverAccounts(purchaseData.accountId, purchaseData.quantity, purchaseId)

      // Store purchase history
      const existingPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
      const purchaseWithAccounts = {
        ...purchaseRecord,
        deliveredAccounts: deliveredAccounts.map((acc) => ({
          id: acc.id,
          email: acc.email,
          password: acc.password,
          deliveredAt: acc.deliveredAt,
        })),
      }
      existingPurchases.push(purchaseWithAccounts)
      localStorage.setItem("purchases", JSON.stringify(existingPurchases))

      setIsLoading(false)
      return { success: true, purchaseRecord: purchaseWithAccounts, deliveredAccounts }
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const getPurchaseHistory = () => {
    if (!user) return []
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    return purchases.filter((p: any) => p.userId === user.id)
  }

  return {
    purchaseAccount,
    getPurchaseHistory,
    isLoading,
  }
}
