export function slugify(str) {
  return (
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'mot-cle'
  )
}

export function uniqueKeywordId(base, keywords) {
  const ids = new Set(keywords.map((k) => k.id))
  let id = base
  let n = 2
  while (ids.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}
