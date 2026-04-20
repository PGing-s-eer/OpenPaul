import { useEffect, useState } from 'react'
import { useAdminSlice } from '../../hooks/useSiteData'
import { saveAdminSlice } from '../../lib/adminSiteData'
import { normalizeDatacampForStorage } from '../../lib/datacampNormalize'
import { DataCampForm } from './DataCampForm'

function copyDatacampForDraft(dc) {
  const o = JSON.parse(JSON.stringify(dc))
  o.domains = (o.domains || []).map((d) => ({
    name: d.name ?? '',
    progress: typeof d.progress === 'number' ? d.progress : 0,
    _key:
      typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID
        ? globalThis.crypto.randomUUID()
        : `dc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }))
  return o
}

export function AdminDataCampTab() {
  const datacamp = useAdminSlice('datacamp')
  const [draft, setDraft] = useState(() => copyDatacampForDraft(datacamp))
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync après import ZIP / reset
    setDraft(copyDatacampForDraft(datacamp))
  }, [datacamp])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const normalized = normalizeDatacampForStorage(draft)
      saveAdminSlice('datacamp', normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-surface/30 p-4 text-sm leading-relaxed text-muted sm:p-5">
        <p>
          Données utilisées par la section <strong className="text-text">DataCamp</strong> du portfolio
          (tuiles chiffrées, radar et barres). Les KPIs du bandeau qui pointent vers{' '}
          <code className="font-display text-xs text-accent-cyan/90">datacamp.totalXp</code> ou{' '}
          <code className="font-display text-xs text-accent-cyan/90">datacamp.coursesCompleted</code>{' '}
          lisent aussi ce fichier.
        </p>
        <p className="mt-2 text-xs">
          Après modification : enregistre ici, puis exporte le ZIP ou{' '}
          <code className="font-display text-accent-cyan/80">datacamp.json</code> et pousse sur Git.
        </p>
      </div>
      <DataCampForm draft={draft} setDraft={setDraft} onSubmit={handleSubmit} error={error} />
    </div>
  )
}
