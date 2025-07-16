"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from "lucide-react"
import { PurchaseModal } from "./purchase-modal"
import { AccountDeliveryModal } from "./account-delivery-modal"
import { usePurchase } from "../hooks/use-purchase"
import { useAccounts } from "../hooks/use-accounts"
import { useAuth } from "../contexts/auth-context"
import type { Account } from "../types/account"

interface AccountCardProps {
  title: string
  price: number
  quantity: number
  onQuantityChange: (quantity: number) => void
  userBalance: number
  isAdmin?: boolean
  accountId: string
  onPurchaseSuccess?: () => void
}

export function AccountCard({
  title,
  price,
  quantity,
  onQuantityChange,
  userBalance,
  isAdmin = false,
  accountId,
  onPurchaseSuccess,
}: AccountCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [deliveredAccounts, setDeliveredAccounts] = useState<Account[]>([])
  const { purchaseAccount } = usePurchase()
  const { getAvailableStock } = useAccounts()
  const { user } = useAuth()

  const stock = getAvailableStock(accountId)
  const total = price * quantity
  const canPurchase = userBalance >= total && stock > 0 && quantity > 0

  const handlePurchase = async () => {
    if (!user) return

    try {
      const result = await purchaseAccount({
        accountId,
        accountTitle: title,
        quantity,
        price,
        totalPrice: total,
      })

      if (result.success) {
        setDeliveredAccounts(result.deliveredAccounts)
        setShowPurchaseModal(false)
        setShowDeliveryModal(true)

        // Reset quantity after successful purchase
        onQuantityChange(1)

        // Refresh user data
        if (onPurchaseSuccess) {
          onPurchaseSuccess()
        }
      }
    } catch (error) {
      console.error("Purchase failed:", error)
    }
  }

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-1">{title}</h3>
          <p className="text-green-600 font-semibold text-lg mb-1">${price.toFixed(2)} per account</p>
          <p className="text-gray-500 mb-4">Stock: {stock} available</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                onClick={() => onQuantityChange(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <p className="text-red-600 font-semibold text-center">Total: ${total.toFixed(2)}</p>
          </div>

          <Button
            className={`w-full ${
              canPurchase && !isAdmin ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!canPurchase || isAdmin}
            onClick={() => setShowPurchaseModal(true)}
          >
            {isAdmin
              ? "Admin View"
              : canPurchase
                ? "Purchase Now"
                : stock === 0
                  ? "Out of Stock"
                  : "Insufficient Balance"}
          </Button>
        </CardContent>
      </Card>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        accountTitle={title}
        quantity={quantity}
        totalPrice={total}
        onConfirm={handlePurchase}
      />

      <AccountDeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        deliveredAccounts={deliveredAccounts}
        accountTitle={title}
      />
    </>
  )
}
