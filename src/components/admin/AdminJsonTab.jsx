import { useEffect, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useAdminSlice } from '../../hooks/useSiteData'
import {
  clearAdminSlice,
  getFilenameForSlice,
  loadAdminSlice,
  saveAdminSlice,
} from '../../lib/adminSiteData'
import { validateAdminSlice } from '../../lib/dataValidators'

/** @typedef {import('../../lib/dataValidators').DataSlice} DataSlice */

/**
 * @param {{ slice: DataSlice, title: string, onNotice: (n: { type: 'success'|'error', text: string }) => void }} props
 */
export function AdminJsonTab({ slice, title, onNotice }) {
  const data = useAdminSlice(slice)
  const [draft, setDraft] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync éditeur avec données (ZIP, autre onglet)
    setDraft(JSON.stringify(data, null, 2))
  }, [data])

  function apply() {
    let parsed
    try {
      parsed = JSON.parse(draft)
    } catch {
      onNotice({ type: 'error', text: 'JSON invalide (syntaxe).' })
      return
    }
    const v = validateAdminSlice(slice, parsed)
    if (!v.ok) {
      onNotice({ type: 'error', text: v.error })
      return
    }
    try {
      saveAdminSlice(slice, v.data)
    } catch (e) {
      onNotice({
        type: 'error',
        text: e instanceof Error ? e.message : 'Enregistrement impossible.',
      })
      return
    }
    onNotice({
      type: 'success',
      text: `${getFilenameForSlice(slice)} enregistré dans le navigateur.`,
    })
  }

  function reloadDraftFromStorage() {
    setDraft(JSON.stringify(loadAdminSlice(slice), null, 2))
    onNotice({ type: 'success', text: 'Brouillon rechargé depuis la copie locale.' })
  }

  function exportOne() {
    const blob = new Blob([JSON.stringify(loadAdminSlice(slice), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = getFilenameForSlice(slice)
    a.click()
    URL.revokeObjectURL(url)
    onNotice({ type: 'success', text: `Téléchargement de ${getFilenameForSlice(slice)}.` })
  }

  function openFilePicker() {
    fileRef.current?.click()
  }

  function onFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setDraft(String(reader.result ?? ''))
      onNotice({
        type: 'success',
        text: 'Fichier chargé dans l’éditeur — vérifie puis clique sur « Appliquer » pour enregistrer.',
      })
    }
    reader.onerror = () => {
      onNotice({ type: 'error', text: 'Lecture du fichier impossible.' })
    }
    reader.readAsText(file)
  }

  function clearOverride() {
    if (
      !window.confirm(
        `Effacer la copie locale de « ${getFilenameForSlice(slice)} » et revenir au fichier du dépôt ?`,
      )
    ) {
      return
    }
    clearAdminSlice(slice)
    onNotice({ type: 'success', text: 'Copie locale effacée pour ce fichier.' })
  }

  const filename = getFilenameForSlice(slice)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="font-display text-base font-semibold text-text">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-label={`Importer ${filename}`}
            onChange={onFileChange}
          />
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openFilePicker}
            className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
          >
            Importer fichier
          </Motion.button>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02, borderColor: 'rgba(0, 245, 212, 0.35)', color: '#00f5d4' }}
            whileTap={{ scale: 0.98 }}
            onClick={exportOne}
            className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
          >
            Télécharger
          </Motion.button>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reloadDraftFromStorage}
            className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
          >
            Recharger brouillon
          </Motion.button>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 190, 11, 0.45)', color: '#ffbe0b' }}
            whileTap={{ scale: 0.98 }}
            onClick={clearOverride}
            className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
          >
            Réinitialiser ce fichier
          </Motion.button>
        </div>
      </div>

      <p className="text-xs text-muted sm:text-sm">
        Édite le JSON puis « Appliquer » pour valider et enregistrer dans{' '}
        <code className="font-display text-accent-cyan/90">localStorage</code>. Les visiteurs voient
        les fichiers du dépôt après export + commit (ou ZIP complet).
      </p>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        className="font-mono min-h-[min(60vh,520px)] w-full resize-y rounded-lg border border-white/12 bg-bg p-4 text-xs leading-relaxed text-text outline-none focus:border-accent-cyan/40 sm:text-sm"
        aria-label={`Éditeur JSON ${filename}`}
      />

      <Motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={apply}
        className="font-display cursor-pointer rounded-lg border border-accent-cyan/45 bg-accent-cyan/12 px-6 py-2.5 text-xs font-semibold tracking-wide text-accent-cyan uppercase"
      >
        Appliquer les changements
      </Motion.button>
    </div>
  )
}
