import { useMemo, useState } from 'react'

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** Correspondance floue légère : sous-séquence + bonus si sous-chaîne directe. */
function scoreMatch(keyword, rawQuery) {
  const q = normalize(rawQuery).trim()
  if (!q) return 1

  const hay = normalize(
    [keyword.name, keyword.note, keyword.analogy, keyword.subcategory, keyword.category]
      .filter(Boolean)
      .join(' '),
  )

  if (hay.includes(q)) return 100

  let qi = 0
  for (let hi = 0; hi < hay.length && qi < q.length; hi += 1) {
    if (hay[hi] === q[qi]) qi += 1
  }
  return qi === q.length ? 50 : 0
}

export function useKeywordFilter(keywords) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)

  const filtered = useMemo(() => {
    const scored = keywords.map((kw) => ({
      kw,
      score: scoreMatch(kw, query),
    }))

    const passed = scored
      .filter(({ score }) => score > 0)
      .map(({ kw }) => kw)
      .filter((kw) => (category ? kw.category === category : true))

    return [...passed].sort((a, b) => {
      const da = a.dateAdded || ''
      const db = b.dateAdded || ''
      if (da !== db) return db.localeCompare(da)
      return a.name.localeCompare(b.name)
    })
  }, [keywords, query, category])

  return { query, setQuery, category, setCategory, filtered }
}
