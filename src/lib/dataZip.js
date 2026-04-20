import JSZip from 'jszip'
import {
  DATA_FILE_NAMES,
  DATA_SLICES,
  loadAdminSlice,
  saveAdminSlice,
} from './adminSiteData'
import { validateAdminSlice } from './dataValidators'

export async function buildOpenPaulDataZipBlob() {
  const zip = new JSZip()
  for (const slice of DATA_SLICES) {
    const name = DATA_FILE_NAMES[slice]
    const data = loadAdminSlice(slice)
    zip.file(name, JSON.stringify(data, null, 2))
  }
  return zip.generateAsync({ type: 'blob' })
}

/**
 * Importe un ZIP contenant les six JSON (racine ou sous-dossier data/).
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function importOpenPaulDataZipBlob(blob) {
  const zip = await JSZip.loadAsync(blob)
  const staged = []

  for (const slice of DATA_SLICES) {
    const name = DATA_FILE_NAMES[slice]
    const file = zip.file(name) ?? zip.file(`data/${name}`)
    if (!file) {
      return { ok: false, error: `ZIP incomplet : « ${name} » est absent (racine ou dossier data/).` }
    }
    const text = await file.async('string')
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      return { ok: false, error: `« ${name} » : JSON invalide.` }
    }
    const v = validateAdminSlice(slice, parsed)
    if (!v.ok) {
      return { ok: false, error: `« ${name} » : ${v.error}` }
    }
    staged.push({ slice, data: v.data })
  }

  for (const { slice, data } of staged) {
    try {
      saveAdminSlice(slice, data)
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Erreur d’enregistrement.' }
    }
  }

  return { ok: true }
}
