"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePurchase } from "../hooks/use-purchase"
import { CheckCircle, Calendar, DollarSign } from "lucide-react"

export function PurchaseHistory() {
  const { getPurchaseHistory } = usePurchase()
  const purchases = getPurchaseHistory()

  if (purchases.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No purchase history found</p>
          <p className="text-sm text-gray-400 mt-2">Your purchased accounts will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {purchases.map((purchase: any) => (
        <Card key={purchase.id} className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {purchase.accountTitle}
              </CardTitle>
              <span className="text-sm text-gray-500">#{purchase.id.slice(-6)}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Quantity: {purchase.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Total Paid:</span>
              <span className="text-lg font-bold text-green-600">${purchase.totalPrice.toFixed(2)}</span>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 font-medium">✅ Purchase Completed</p>
              <p className="text-xs text-green-600 mt-1">Account details sent to your registered email</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
