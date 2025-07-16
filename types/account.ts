export interface Account {
  id: string
  type: string
  email: string
  password: string
  isDelivered: boolean
  purchaseId?: string
  deliveredAt?: string
}

export interface AccountType {
  id: string
  title: string
  price: number
  stock: number
  accounts: Account[]
}
