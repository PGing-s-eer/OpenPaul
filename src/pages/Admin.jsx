import { useEffect, useReducer } from 'react'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { AdminLogin } from '../components/admin/AdminLogin'
import { PrivateRoute } from '../components/layout/PrivateRoute'
import { isAdminSession } from '../lib/adminAuth'

export default function Admin() {
  const [, refresh] = useReducer((x) => x + 1, 0)
  const authed = isAdminSession()

  useEffect(() => {
    const prev = document.title
    document.title = authed ? 'Admin — Bibliothèque' : 'Admin — Connexion'
    return () => {
      document.title = prev
    }
  }, [authed])

  return (
    <PrivateRoute fallback={<AdminLogin onSuccess={refresh} />}>
      <AdminDashboard onLogout={refresh} />
    </PrivateRoute>
  )
}
