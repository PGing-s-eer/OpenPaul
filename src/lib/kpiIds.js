import { slugify } from './keywordIds'

export function uniqueKpiId(base, kpis) {
  const b = base && base.trim() ? base : 'kpi'
  const ids = new Set(kpis.map((k) => k.id))
  let id = b
  let n = 2
  while (ids.has(id)) {
    id = `${b}-${n}`
    n += 1
  }
  return id
}

export function suggestKpiId(label, kpis) {
  return uniqueKpiId(slugify(label), kpis)
}
