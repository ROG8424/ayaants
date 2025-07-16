import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BalanceCardProps {
  balance: number
  isAdmin?: boolean
}

export function BalanceCard({ balance, isAdmin = false }: BalanceCardProps) {
  return (
    <Card className="bg-green-500 text-white mb-4">
      <CardContent className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Balance: ${balance.toFixed(2)}</h2>
        {!isAdmin && balance === 0 && <p className="text-green-100">Request balance from admin to purchase accounts</p>}
        {isAdmin && (
          <Button variant="secondary" size="sm" className="mt-2">
            Manage User Balances
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
