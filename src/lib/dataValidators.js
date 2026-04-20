/** @typedef {'keywords'|'projects'|'certifications'|'datacamp'|'kpis'|'site'} DataSlice */

export function parseImportedKeywordsJson(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSON invalide.' }
  }
  return validateKeywordsData(parsed)
}

export function validateKeywordsData(parsed) {
  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'Le fichier doit contenir un tableau JSON.' }
  }
  if (parsed.length === 0) {
    return { ok: false, error: 'Le tableau ne peut pas être vide.' }
  }
  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i]
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return { ok: false, error: `Entrée ${i + 1} : objet attendu.` }
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      return { ok: false, error: `Entrée ${i + 1} : champ « id » manquant ou invalide.` }
    }
    if (typeof row.name !== 'string' || !row.name.trim()) {
      return { ok: false, error: `Entrée ${i + 1} : champ « name » manquant ou invalide.` }
    }
    if (typeof row.category !== 'string' || !row.category.trim()) {
      return { ok: false, error: `Entrée ${i + 1} : champ « category » manquant ou invalide.` }
    }
  }
  return { ok: true, data: parsed }
}

function validateProjectsData(parsed) {
  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'projects.json doit être un tableau.' }
  }
  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i]
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return { ok: false, error: `Projet ${i + 1} : objet attendu.` }
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      return { ok: false, error: `Projet ${i + 1} : « id » invalide.` }
    }
    if (typeof row.title !== 'string' || !row.title.trim()) {
      return { ok: false, error: `Projet ${i + 1} : « title » invalide.` }
    }
    if (typeof row.shortDescription !== 'string') {
      return { ok: false, error: `Projet ${i + 1} : « shortDescription » manquant.` }
    }
    if (typeof row.fullDescription !== 'string') {
      return { ok: false, error: `Projet ${i + 1} : « fullDescription » manquant.` }
    }
    if (!Array.isArray(row.tags)) {
      return { ok: false, error: `Projet ${i + 1} : « tags » doit être un tableau.` }
    }
    if (row.methodology != null && !Array.isArray(row.methodology)) {
      return { ok: false, error: `Projet ${i + 1} : « methodology » doit être un tableau ou absent.` }
    }
    if (typeof row.featured !== 'boolean') {
      return { ok: false, error: `Projet ${i + 1} : « featured » doit être un booléen.` }
    }
    for (const u of ['githubUrl', 'demoUrl', 'videoUrl', 'thumbnail']) {
      if (row[u] != null && typeof row[u] !== 'string') {
        return { ok: false, error: `Projet ${i + 1} : « ${u} » doit être une chaîne ou null.` }
      }
    }
  }
  return { ok: true, data: parsed }
}

function validateCertificationsData(parsed) {
  if (!Array.isArray(parsed)) {
    return { ok: false, error: 'certifications.json doit être un tableau.' }
  }
  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i]
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return { ok: false, error: `Certification ${i + 1} : objet attendu.` }
    }
    const need = ['id', 'name', 'issuer', 'dateObtained', 'credentialUrl']
    for (const k of need) {
      if (typeof row[k] !== 'string' || !String(row[k]).trim()) {
        return { ok: false, error: `Certification ${i + 1} : « ${k} » invalide.` }
      }
    }
    if (row.badgeUrl != null && typeof row.badgeUrl !== 'string') {
      return { ok: false, error: `Certification ${i + 1} : « badgeUrl » invalide.` }
    }
  }
  return { ok: true, data: parsed }
}

function validateDatacampData(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'datacamp.json doit être un objet.' }
  }
  const nums = ['totalXp', 'coursesCompleted', 'skillAssessmentsPassed', 'careerTracksCompleted']
  for (const k of nums) {
    if (typeof parsed[k] !== 'number' || Number.isNaN(parsed[k])) {
      return { ok: false, error: `datacamp : « ${k} » doit être un nombre.` }
    }
  }
  if (!Array.isArray(parsed.domains)) {
    return { ok: false, error: 'datacamp : « domains » doit être un tableau.' }
  }
  for (let i = 0; i < parsed.domains.length; i++) {
    const d = parsed.domains[i]
    if (!d || typeof d !== 'object') {
      return { ok: false, error: `datacamp.domains[${i}] invalide.` }
    }
    if (typeof d.name !== 'string' || !d.name.trim()) {
      return { ok: false, error: `datacamp.domains[${i}].name invalide.` }
    }
    if (typeof d.progress !== 'number' || Number.isNaN(d.progress)) {
      return { ok: false, error: `datacamp.domains[${i}].progress invalide.` }
    }
  }
  return { ok: true, data: parsed }
}

function validateKpisData(parsed) {
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, error: 'kpis.json doit être un tableau non vide.' }
  }
  for (let i = 0; i < parsed.length; i++) {
    const row = parsed[i]
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return { ok: false, error: `KPI ${i + 1} : objet attendu.` }
    }
    if (typeof row.id !== 'string' || !row.id.trim()) {
      return { ok: false, error: `KPI ${i + 1} : « id » invalide.` }
    }
    if (typeof row.label !== 'string' || !row.label.trim()) {
      return { ok: false, error: `KPI ${i + 1} : « label » invalide.` }
    }
    if (typeof row.icon !== 'string' || !row.icon.trim()) {
      return { ok: false, error: `KPI ${i + 1} : « icon » invalide.` }
    }
    if (row.value != null && typeof row.value !== 'number') {
      return { ok: false, error: `KPI ${i + 1} : « value » doit être un nombre ou absent.` }
    }
    if (row.source != null && typeof row.source !== 'string') {
      return { ok: false, error: `KPI ${i + 1} : « source » doit être une chaîne ou absent.` }
    }
  }
  return { ok: true, data: parsed }
}

function validateSiteData(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'site.json doit être un objet.' }
  }
  const strings = ['brand', 'title', 'subtitle', 'heroCta', 'ctaTargetId', 'lastUpdated']
  for (const k of strings) {
    if (typeof parsed[k] !== 'string') {
      return { ok: false, error: `site : « ${k} » manquant ou invalide.` }
    }
  }
  if (!Array.isArray(parsed.nav) || parsed.nav.length === 0) {
    return { ok: false, error: 'site.nav doit être un tableau non vide.' }
  }
  for (let i = 0; i < parsed.nav.length; i++) {
    const n = parsed.nav[i]
    if (!n || typeof n.id !== 'string' || typeof n.label !== 'string') {
      return { ok: false, error: `site.nav[${i}] invalide (id, label requis).` }
    }
  }
  if (!parsed.footer || typeof parsed.footer !== 'object') {
    return { ok: false, error: 'site.footer objet requis.' }
  }
  for (const k of ['github', 'linkedin', 'datacamp', 'email']) {
    if (typeof parsed.footer[k] !== 'string') {
      return { ok: false, error: `site.footer.${k} chaîne requise.` }
    }
  }
  if (!parsed.seo || typeof parsed.seo !== 'object') {
    return { ok: false, error: 'site.seo objet requis.' }
  }
  for (const k of ['documentTitle', 'metaDescription', 'siteUrl', 'ogImage', 'twitterSite']) {
    if (typeof parsed.seo[k] !== 'string') {
      return { ok: false, error: `site.seo.${k} chaîne requise.` }
    }
  }
  return { ok: true, data: parsed }
}

/**
 * @param {DataSlice} slice
 * @param {unknown} parsed
 * @returns {{ ok: true, data: unknown } | { ok: false, error: string }}
 */
export function validateAdminSlice(slice, parsed) {
  switch (slice) {
    case 'keywords':
      return validateKeywordsData(parsed)
    case 'projects':
      return validateProjectsData(parsed)
    case 'certifications':
      return validateCertificationsData(parsed)
    case 'datacamp':
      return validateDatacampData(parsed)
    case 'kpis':
      return validateKpisData(parsed)
    case 'site':
      return validateSiteData(parsed)
    default:
      return { ok: false, error: 'Type de données inconnu.' }
  }
}
