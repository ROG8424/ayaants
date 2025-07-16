"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, Eye, EyeOff, Mail } from "lucide-react"
import type { Account } from "../types/account"

interface AccountDeliveryModalProps {
  isOpen: boolean
  onClose: () => void
  deliveredAccounts: Account[]
  accountTitle: string
}

export function AccountDeliveryModal({ isOpen, onClose, deliveredAccounts, accountTitle }: AccountDeliveryModalProps) {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [copiedFields, setCopiedFields] = useState<{ [key: string]: boolean }>({})

  if (!isOpen || deliveredAccounts.length === 0) return null

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFields((prev) => ({ ...prev, [fieldId]: true }))
      setTimeout(() => {
        setCopiedFields((prev) => ({ ...prev, [fieldId]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-xl text-green-600">Accounts Delivered!</CardTitle>
          <p className="text-gray-600">Your {accountTitle} accounts are ready</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">Account details also sent to your email</p>
          </div>

          {deliveredAccounts.map((account, index) => (
            <Card key={account.id} className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-gray-800">Account #{index + 1}</h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email/Username</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={account.email}
                        readOnly
                        className="flex-1 p-2 bg-white border rounded text-sm font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(account.email, `email-${account.id}`)}
                        className="px-2"
                      >
                        {copiedFields[`email-${account.id}`] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Password</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type={showPasswords[account.id] ? "text" : "password"}
                        value={account.password}
                        readOnly
                        className="flex-1 p-2 bg-white border rounded text-sm font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePasswordVisibility(account.id)}
                        className="px-2"
                      >
                        {showPasswords[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(account.password, `password-${account.id}`)}
                        className="px-2"
                      >
                        {copiedFields[`password-${account.id}`] ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">⚠️ Important Notes:</p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Save these credentials securely</li>
              <li>• Don't share accounts with others</li>
              <li>• Contact support if accounts don't work</li>
            </ul>
          </div>

          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Got it, Thanks!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
