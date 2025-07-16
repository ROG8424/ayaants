"use client"

import { useState, useEffect } from "react"
import type { Account, AccountType } from "../types/account"

// Mock account database
const mockAccounts: AccountType[] = [
  {
    id: "spotify",
    title: "Spotify Premium",
    price: 3.99,
    stock: 5,
    accounts: [
      { id: "sp1", type: "spotify", email: "spotify1@premium.com", password: "SpotifyPass123", isDelivered: false },
      { id: "sp2", type: "spotify", email: "spotify2@premium.com", password: "SpotifyPass456", isDelivered: false },
      { id: "sp3", type: "spotify", email: "spotify3@premium.com", password: "SpotifyPass789", isDelivered: false },
      { id: "sp4", type: "spotify", email: "spotify4@premium.com", password: "SpotifyPass101", isDelivered: false },
      { id: "sp5", type: "spotify", email: "spotify5@premium.com", password: "SpotifyPass202", isDelivered: false },
    ],
  },
  {
    id: "youtube",
    title: "YouTube Premium",
    price: 4.99,
    stock: 3,
    accounts: [
      { id: "yt1", type: "youtube", email: "youtube1@premium.com", password: "YouTubePass123", isDelivered: false },
      { id: "yt2", type: "youtube", email: "youtube2@premium.com", password: "YouTubePass456", isDelivered: false },
      { id: "yt3", type: "youtube", email: "youtube3@premium.com", password: "YouTubePass789", isDelivered: false },
    ],
  },
  {
    id: "disney",
    title: "Disney Plus",
    price: 6.99,
    stock: 4,
    accounts: [
      { id: "dp1", type: "disney", email: "disney1@plus.com", password: "DisneyPass123", isDelivered: false },
      { id: "dp2", type: "disney", email: "disney2@plus.com", password: "DisneyPass456", isDelivered: false },
      { id: "dp3", type: "disney", email: "disney3@plus.com", password: "DisneyPass789", isDelivered: false },
      { id: "dp4", type: "disney", email: "disney4@plus.com", password: "DisneyPass101", isDelivered: false },
    ],
  },
]

export function useAccounts() {
  const [accounts, setAccounts] = useState<AccountType[]>([])

  useEffect(() => {
    // Load accounts from localStorage or use mock data
    const storedAccounts = localStorage.getItem("accounts")
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts))
    } else {
      setAccounts(mockAccounts)
      localStorage.setItem("accounts", JSON.stringify(mockAccounts))
    }
  }, [])

  const getAvailableStock = (accountTypeId: string) => {
    const accountType = accounts.find((a) => a.id === accountTypeId)
    if (!accountType) return 0
    return accountType.accounts.filter((acc) => !acc.isDelivered).length
  }

  const deliverAccounts = (accountTypeId: string, quantity: number, purchaseId: string) => {
    const updatedAccounts = accounts.map((accountType) => {
      if (accountType.id === accountTypeId) {
        const availableAccounts = accountType.accounts.filter((acc) => !acc.isDelivered)
        const accountsToDeliver = availableAccounts.slice(0, quantity)

        const updatedAccountList = accountType.accounts.map((acc) => {
          if (accountsToDeliver.find((deliverAcc) => deliverAcc.id === acc.id)) {
            return {
              ...acc,
              isDelivered: true,
              purchaseId,
              deliveredAt: new Date().toISOString(),
            }
          }
          return acc
        })

        return {
          ...accountType,
          accounts: updatedAccountList,
          stock: updatedAccountList.filter((acc) => !acc.isDelivered).length,
        }
      }
      return accountType
    })

    setAccounts(updatedAccounts)
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts))

    // Return delivered accounts
    const accountType = updatedAccounts.find((a) => a.id === accountTypeId)
    return accountType?.accounts.filter((acc) => acc.purchaseId === purchaseId) || []
  }

  const addAccounts = (accountTypeId: string, newAccounts: Omit<Account, "id" | "isDelivered">[]) => {
    const updatedAccounts = accounts.map((accountType) => {
      if (accountType.id === accountTypeId) {
        const accountsWithIds = newAccounts.map((acc) => ({
          ...acc,
          id: `${accountTypeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          isDelivered: false,
        }))

        const updatedAccountList = [...accountType.accounts, ...accountsWithIds]

        return {
          ...accountType,
          accounts: updatedAccountList,
          stock: updatedAccountList.filter((acc) => !acc.isDelivered).length,
        }
      }
      return accountType
    })

    setAccounts(updatedAccounts)
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts))
  }

  return {
    accounts,
    getAvailableStock,
    deliverAccounts,
    addAccounts,
  }
}
