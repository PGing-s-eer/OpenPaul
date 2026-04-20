import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

function draftFromInitial(initial) {
  if (initial) {
    return {
      name: initial.name ?? '',
      issuer: initial.issuer ?? '',
      dateObtained: initial.dateObtained ?? '',
      credentialUrl: initial.credentialUrl ?? '',
      badgeUrl: initial.badgeUrl == null ? '' : String(initial.badgeUrl),
    }
  }
  return {
    name: '',
    issuer: '',
    dateObtained: '',
    credentialUrl: '',
    badgeUrl: '',
  }
}

function urlOrNull(s) {
  const t = String(s || '').trim()
  return t === '' ? null : t
}

export function CertificationForm({ initial, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(() => draftFromInitial(initial))
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const name = draft.name.trim()
    const issuer = draft.issuer.trim()
    const dateObtained = draft.dateObtained.trim()
    const credentialUrl = draft.credentialUrl.trim()
    if (!name) {
      setError('Le nom de la certification est obligatoire.')
      return
    }
    if (!issuer) {
      setError('L’organisme (issuer) est obligatoire.')
      return
    }
    if (!dateObtained) {
      setError('La date d’obtention est obligatoire (ex. 2024-11).')
      return
    }
    if (!credentialUrl) {
      setError('L’URL du credential est obligatoire.')
      return
    }
    onSubmit({
      name,
      issuer,
      dateObtained,
      credentialUrl,
      badgeUrl: urlOrNull(draft.badgeUrl),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Nom de la certification
        </label>
        <input
          value={draft.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Organisme</label>
        <input
          value={draft.issuer}
          onChange={(e) => handleChange('issuer', e.target.value)}
          placeholder="DataCamp, AWS…"
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Date d’obtention
        </label>
        <input
          type="month"
          value={(draft.dateObtained || '').slice(0, 7)}
          onChange={(e) => handleChange('dateObtained', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
        <p className="mt-1 text-[11px] text-muted">Format stocké : AAAA-MM (ex. 2024-11).</p>
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          URL du credential
        </label>
        <input
          value={draft.credentialUrl}
          onChange={(e) => handleChange('credentialUrl', e.target.value)}
          placeholder="https://…"
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          URL du badge (image)
        </label>
        <input
          value={draft.badgeUrl}
          onChange={(e) => handleChange('badgeUrl', e.target.value)}
          placeholder="Optionnel"
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      {error ? <p className="text-sm text-red-400/90">{error}</p> : null}
      <div className="flex flex-wrap gap-3 pt-2">
        <Motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-xs font-medium tracking-wide text-accent-cyan uppercase"
        >
          {initial ? 'Enregistrer' : 'Créer'}
        </Motion.button>
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02, color: '#e8e8f0' }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="font-display cursor-pointer rounded border border-white/15 px-4 py-2 text-xs text-muted uppercase tracking-wide"
        >
          Annuler
        </Motion.button>
      </div>
    </form>
  )
}
