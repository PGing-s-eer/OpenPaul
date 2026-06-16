import { useMemo, useState } from 'react'

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** La requête `q` arrive déjà normalisée et trimée. */
function isSubsequence(q, hay) {
  let qi = 0
  for (let hi = 0; hi < hay.length && qi < q.length; hi += 1) {
    if (hay[hi] === q[qi]) qi += 1
  }
  return qi === q.length
}

/**
 * Score de pertinence par champ : un mot recherché qui touche le NOM compte
 * bien plus qu'une occurrence noyée dans la note ou l'analogie. Plus le score
 * est élevé, plus le résultat remonte. 0 = exclu.
 */
function scoreMatch(keyword, q) {
  if (!q) return 1

  const name = normalize(keyword.name)
  const sub = normalize(keyword.subcategory)
  const cat = normalize(keyword.category)
  const text = normalize([keyword.note, keyword.analogy].filter(Boolean).join(' '))

  // Correspondances sur le nom — priorité absolue.
  if (name === q) return 1000
  if (name.startsWith(q)) return 900 + (q.length / name.length) * 10

  const nameIdx = name.indexOf(q)
  if (nameIdx >= 0) {
    // Début de mot (après espace ou séparateur) > milieu de mot.
    const onBoundary = /[\s\-_./]/.test(name[nameIdx - 1])
    return (onBoundary ? 800 : 700) + (q.length / name.length) * 10 - nameIdx * 0.5
  }

  // Champs secondaires : catégorie/sous-catégorie, puis texte libre.
  if (sub.includes(q) || cat.includes(q)) return 500
  if (text.includes(q)) return 300

  // Dernier recours : sous-séquence sur le nom uniquement (abréviations).
  if (isSubsequence(q, name)) return 100

  return 0
}

export function useKeywordFilter(keywords) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)

  const filtered = useMemo(() => {
    const q = normalize(query).trim()

    const scored = keywords
      .map((kw) => ({ kw, score: scoreMatch(kw, q) }))
      .filter(({ kw, score }) => score > 0 && (category ? kw.category === category : true))

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      // À pertinence égale (ex. recherche vide) : plus récent d'abord, puis nom.
      const da = a.kw.dateAdded || ''
      const db = b.kw.dateAdded || ''
      if (da !== db) return db.localeCompare(da)
      return a.kw.name.localeCompare(b.kw.name)
    })

    return scored.map(({ kw }) => kw)
  }, [keywords, query, category])

  return { query, setQuery, category, setCategory, filtered }
}
