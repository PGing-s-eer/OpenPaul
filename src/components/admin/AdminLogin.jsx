import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { MotionLink } from '../ui/MotionLink'
import { isAdminConfigured, setAdminSession, verifyAdminPassword } from '../../lib/adminAuth'

export function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const configured = isAdminConfigured()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!configured) {
      setError('Administration non configurée : définissez VITE_ADMIN_PASSWORD ou VITE_ADMIN_PASSWORD_SHA256.')
      return
    }
    setPending(true)
    try {
      const ok = await verifyAdminPassword(password)
      if (!ok) {
        setError('Mot de passe incorrect.')
        return
      }
      setAdminSession()
      onSuccess()
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-bg px-4 py-16">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-lg border border-white/10 bg-surface p-8 shadow-[0_0_0_1px_rgba(0,245,212,0.06)]"
      >
        <h1 className="font-display text-lg font-semibold text-text">Administration</h1>
        <p className="mt-2 text-sm text-muted">Accès réservé — mots-clés de la bibliothèque.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="font-display text-xs tracking-wide text-muted uppercase">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="font-body mt-2 w-full rounded-md border border-white/12 bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30"
            />
          </label>
          {error ? <p className="text-sm text-red-400/90">{error}</p> : null}
          <Motion.button
            type="submit"
            disabled={pending}
            whileHover={{ scale: pending ? 1 : 1.02 }}
            whileTap={{ scale: pending ? 1 : 0.98 }}
            className="font-display w-full cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 py-2.5 text-xs font-medium tracking-wide text-accent-cyan uppercase disabled:opacity-50"
          >
            {pending ? 'Vérification…' : 'Connexion'}
          </Motion.button>
        </form>

        <p className="mt-8 text-center text-xs text-muted">
          <MotionLink
            to="/"
            whileHover={{ color: '#00f5d4', textDecoration: 'underline' }}
            whileTap={{ scale: 0.99 }}
            className="inline-block text-accent-cyan underline-offset-4"
          >
            Retour au site
          </MotionLink>
        </p>
      </Motion.div>
    </div>
  )
}
