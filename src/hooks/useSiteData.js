import { useEffect, useMemo, useState } from 'react'
import {
  ADMIN_DATA_CHANGED_EVENT,
  loadAdminSlice,
  REPO_DEFAULTS,
} from '../lib/adminSiteData'

/** @typedef {import('../lib/dataValidators').DataSlice} DataSlice */

/** @param {DataSlice} slice */
export function useRepoSlice(slice) {
  return useMemo(() => REPO_DEFAULTS[slice], [slice])
}

/** @param {DataSlice} slice */
export function useAdminSlice(slice) {
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return REPO_DEFAULTS[slice]
    return loadAdminSlice(slice)
  })

  useEffect(() => {
    const sync = (e) => {
      const s = e?.detail?.slice
      if (s === 'all' || s === slice) {
        setData(loadAdminSlice(slice))
      }
    }
    const onStorage = () => setData(loadAdminSlice(slice))
    window.addEventListener(ADMIN_DATA_CHANGED_EVENT, sync)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(ADMIN_DATA_CHANGED_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [slice])

  return data
}

export function useRepoKeywords() {
  return useRepoSlice('keywords')
}

export function useRepoProjects() {
  return useRepoSlice('projects')
}

export function useRepoCertifications() {
  return useRepoSlice('certifications')
}

export function useRepoDatacamp() {
  return useRepoSlice('datacamp')
}

export function useRepoKpis() {
  return useRepoSlice('kpis')
}

export function useRepoSite() {
  return useRepoSlice('site')
}

export function useAdminKeywords() {
  return useAdminSlice('keywords')
}
