import { ProtectedRoute } from "../../components/protected-route"
import UserDashboard from "../../user-dashboard"

export default function UserPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  )
}
