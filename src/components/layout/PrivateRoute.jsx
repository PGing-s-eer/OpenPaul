import { isAdminSession } from '../../lib/adminAuth'

/**
 * Garde d’accès admin (équivalent au `<PrivateRoute>` du README).
 * Affiche `fallback` s’il n’y a pas de session, sinon `children`.
 */
export function PrivateRoute({ children, fallback }) {
  if (!isAdminSession()) {
    return fallback
  }
  return children
}
