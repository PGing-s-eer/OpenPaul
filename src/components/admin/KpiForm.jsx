import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

const ICON_OPTIONS = [
  { value: 'layers', label: 'Couches (layers)' },
  { value: 'bolt', label: 'Éclair (bolt)' },
  { value: 'award', label: 'Récompense (award)' },
  { value: 'calendar', label: 'Calendrier (calendar)' },
  { value: 'book', label: 'Livre (book)' },
]

const SOURCE_PRESETS = [
  { value: 'projects', label: 'Nombre de projets' },
  { value: 'certifications', label: 'Nombre de certifications' },
  { value: 'keywords', label: 'Nombre de concepts (keywords)' },
  { value: 'datacamp.totalXp', label: 'XP DataCamp' },
  { value: 'datacamp.coursesCompleted', label: 'Cours DataCamp complétés' },
]

function draftFromInitial(initial) {
  if (initial) {
    const hasValue = typeof initial.value === 'number' && !Number.isNaN(initial.value)
    return {
      label: initial.label ?? '',
      icon: initial.icon ?? 'layers',
      suffix: initial.suffix == null ? '' : String(initial.suffix),
      mode: hasValue ? 'fixed' : 'dynamic',
      source: hasValue ? '' : String(initial.source ?? ''),
      valueText: hasValue ? String(initial.value) : '',
    }
  }
  return {
    label: '',
    icon: 'layers',
    suffix: '',
    mode: 'dynamic',
    source: 'projects',
    valueText: '',
  }
}

export function KpiForm({ initial, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(() => draftFromInitial(initial))
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const label = draft.label.trim()
    if (!label) {
      setError('Le libellé est obligatoire.')
      return
    }
    const suffix = draft.suffix.trim()
    const base = {
      label,
      icon: draft.icon,
      suffix,
    }
    if (draft.mode === 'fixed') {
      const n = Number(draft.valueText)
      if (!Number.isFinite(n)) {
        setError('La valeur fixe doit être un nombre valide.')
        return
      }
      onSubmit({ ...base, value: n })
      return
    }
    const source = draft.source.trim()
    if (!source) {
      setError('Indique une clé « source » (liste ou saisie libre).')
      return
    }
    onSubmit({ ...base, source })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Libellé affiché
        </label>
        <input
          value={draft.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Icône</label>
        <select
          value={draft.icon}
          onChange={(e) => handleChange('icon', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        >
          {ICON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Suffixe</label>
        <input
          value={draft.suffix}
          onChange={(e) => handleChange('suffix', e.target.value)}
          placeholder="ex. « XP », « mois », vide"
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>

      <fieldset className="space-y-2 rounded-lg border border-white/10 p-3">
        <legend className="font-display px-1 text-xs tracking-wide text-muted uppercase">
          Valeur
        </legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <input
            type="radio"
            name="kpi-mode"
            checked={draft.mode === 'dynamic'}
            onChange={() => handleChange('mode', 'dynamic')}
            className="size-4 border-white/20 bg-bg text-accent-cyan"
          />
          Calculée depuis les données du site (source)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <input
            type="radio"
            name="kpi-mode"
            checked={draft.mode === 'fixed'}
            onChange={() => handleChange('mode', 'fixed')}
            className="size-4 border-white/20 bg-bg text-accent-cyan"
          />
          Valeur fixe (nombre)
        </label>
      </fieldset>

      {draft.mode === 'dynamic' ? (
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Source</label>
          <select
            value={SOURCE_PRESETS.some((p) => p.value === draft.source) ? draft.source : '__custom__'}
            onChange={(e) => {
              const v = e.target.value
              if (v === '__custom__') {
                handleChange('source', '')
              } else {
                handleChange('source', v)
              }
            }}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          >
            {SOURCE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            <option value="__custom__">Autre (saisie libre)</option>
          </select>
          {!SOURCE_PRESETS.some((p) => p.value === draft.source) ? (
            <input
              value={draft.source}
              onChange={(e) => handleChange('source', e.target.value)}
              placeholder="ex. datacamp.totalXp"
              className="font-body mt-2 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          ) : null}
        </div>
      ) : (
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Valeur</label>
          <input
            type="number"
            step="any"
            value={draft.valueText}
            onChange={(e) => handleChange('valueText', e.target.value)}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
      )}

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
