function nonNegInt(v) {
  const n = Number(v)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n)
}

export function clampProgress(p) {
  const n = Number(p)
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, Math.round(n)))
}

/**
 * Prépare l’objet datacamp pour localStorage / validateAdminSlice (sans champs UI comme _key).
 * @param {object} raw — peut contenir domains[].name, .progress, ._key
 */
export function normalizeDatacampForStorage(raw) {
  const rows = (raw.domains || [])
    .map((d) => ({
      name: String(d.name ?? '').trim(),
      progress: clampProgress(d.progress),
    }))
    .filter((d) => d.name.length > 0)

  const seen = new Set()
  const domains = []
  for (const row of rows) {
    const k = row.name.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    domains.push(row)
  }

  return {
    totalXp: nonNegInt(raw.totalXp),
    coursesCompleted: nonNegInt(raw.coursesCompleted),
    skillAssessmentsPassed: nonNegInt(raw.skillAssessmentsPassed),
    careerTracksCompleted: nonNegInt(raw.careerTracksCompleted),
    domains,
  }
}
