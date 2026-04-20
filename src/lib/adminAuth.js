export const ADMIN_SESSION_KEY = 'openpaul_admin_session'

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyAdminPassword(password) {
  const hashEnv = import.meta.env.VITE_ADMIN_PASSWORD_SHA256?.toLowerCase().trim()
  if (hashEnv) {
    const h = await sha256Hex(password)
    return h === hashEnv
  }
  const plain = import.meta.env.VITE_ADMIN_PASSWORD
  if (plain !== undefined && plain !== '') {
    return password === plain
  }
  return false
}

export function isAdminConfigured() {
  const h = import.meta.env.VITE_ADMIN_PASSWORD_SHA256?.trim()
  const p = import.meta.env.VITE_ADMIN_PASSWORD
  return Boolean(h || (p !== undefined && p !== ''))
}

export function isAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function setAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}
