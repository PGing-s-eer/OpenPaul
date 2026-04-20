import defaultCertifications from '../data/certifications.json'
import defaultDatacamp from '../data/datacamp.json'
import defaultKeywords from '../data/keywords.json'
import defaultKpis from '../data/kpis.json'
import defaultProjects from '../data/projects.json'
import defaultSite from '../data/site.json'
import { validateAdminSlice } from './dataValidators'

/** @typedef {import('./dataValidators').DataSlice} DataSlice */

export const ADMIN_DATA_CHANGED_EVENT = 'openpaul-admin-site-data-changed'

export const DATA_SLICES = /** @type {const} */ ([
  'keywords',
  'projects',
  'certifications',
  'datacamp',
  'kpis',
  'site',
])

export const DATA_FILE_NAMES = {
  keywords: 'keywords.json',
  projects: 'projects.json',
  certifications: 'certifications.json',
  datacamp: 'datacamp.json',
  kpis: 'kpis.json',
  site: 'site.json',
}

export const REPO_DEFAULTS = {
  keywords: defaultKeywords,
  projects: defaultProjects,
  certifications: defaultCertifications,
  datacamp: defaultDatacamp,
  kpis: defaultKpis,
  site: defaultSite,
}

const STORAGE_KEYS = {
  keywords: 'openpaul_keywords_v1',
  projects: 'openpaul_admin_projects_v1',
  certifications: 'openpaul_admin_certifications_v1',
  datacamp: 'openpaul_admin_datacamp_v1',
  kpis: 'openpaul_admin_kpis_v1',
  site: 'openpaul_admin_site_v1',
}

function dispatch(slice) {
  window.dispatchEvent(new CustomEvent(ADMIN_DATA_CHANGED_EVENT, { detail: { slice } }))
}

/** @param {DataSlice} slice */
export function loadAdminSlice(slice) {
  if (typeof window === 'undefined') return REPO_DEFAULTS[slice]
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[slice])
    if (!raw) return REPO_DEFAULTS[slice]
    const parsed = JSON.parse(raw)
    const v = validateAdminSlice(slice, parsed)
    return v.ok ? v.data : REPO_DEFAULTS[slice]
  } catch {
    return REPO_DEFAULTS[slice]
  }
}

/** @param {DataSlice} slice */
export function saveAdminSlice(slice, data) {
  const v = validateAdminSlice(slice, data)
  if (!v.ok) {
    throw new Error(v.error)
  }
  localStorage.setItem(STORAGE_KEYS[slice], JSON.stringify(v.data))
  dispatch(slice)
}

/** @param {DataSlice} slice */
export function clearAdminSlice(slice) {
  localStorage.removeItem(STORAGE_KEYS[slice])
  dispatch(slice)
}

export function clearAllAdminDataOverrides() {
  for (const slice of DATA_SLICES) {
    localStorage.removeItem(STORAGE_KEYS[slice])
  }
  dispatch('all')
}

/** @param {DataSlice} slice */
export function getFilenameForSlice(slice) {
  return DATA_FILE_NAMES[slice]
}
