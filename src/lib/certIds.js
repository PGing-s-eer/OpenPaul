import { slugify } from './keywordIds'

export function uniqueCertId(base, certifications) {
  const b = base && base.trim() ? base : 'certification'
  const ids = new Set(certifications.map((c) => c.id))
  let id = b
  let n = 2
  while (ids.has(id)) {
    id = `${b}-${n}`
    n += 1
  }
  return id
}

export function suggestCertId(name, certifications) {
  return uniqueCertId(slugify(name), certifications)
}
