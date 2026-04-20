import {
  ADMIN_DATA_CHANGED_EVENT,
  clearAdminSlice,
  loadAdminSlice,
  saveAdminSlice,
} from './adminSiteData'
import { parseImportedKeywordsJson } from './dataValidators'

export const KEYWORDS_STORAGE_KEY = 'openpaul_keywords_v1'
export const KEYWORDS_CHANGED_EVENT = ADMIN_DATA_CHANGED_EVENT

export function loadKeywords() {
  return loadAdminSlice('keywords')
}

export function saveKeywords(list) {
  saveAdminSlice('keywords', list)
}

export function clearKeywordsOverride() {
  clearAdminSlice('keywords')
}

export { parseImportedKeywordsJson }
