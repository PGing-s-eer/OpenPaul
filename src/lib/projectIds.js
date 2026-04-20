import { slugify } from './keywordIds'

export function uniqueProjectId(base, projects) {
  const b = base && base.trim() ? base : 'projet'
  const ids = new Set(projects.map((p) => p.id))
  let id = b
  let n = 2
  while (ids.has(id)) {
    id = `${b}-${n}`
    n += 1
  }
  return id
}

export function suggestProjectId(title, projects) {
  return uniqueProjectId(slugify(title), projects)
}
