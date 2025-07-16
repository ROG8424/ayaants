"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  accountTitle: string
  quantity: number
  totalPrice: number
  onConfirm: () => Promise<void>
}

export function PurchaseModal({ isOpen, onClose, accountTitle, quantity, totalPrice, onConfirm }: PurchaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setIsProcessing(false)
        onClose()
      }, 2000)
    } catch (error) {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{isSuccess ? "Purchase Successful!" : "Confirm Purchase"}</CardTitle>
          {!isProcessing && !isSuccess && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuccess ? (
            <div className="text-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-600 font-semibold">
                Successfully purchased {quantity} {accountTitle} account{quantity > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-gray-500 mt-2">Account details will be sent to your email.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Account:</span>
                  <span className="font-semibold">{accountTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total:</span>
                  <span className="font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Processing...
                    </div>
                  ) : (
                    "Confirm Purchase"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
