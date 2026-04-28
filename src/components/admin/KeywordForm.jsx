import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

const CATEGORIES = [
  'Language',
  'Library',
  'Framework',
  'Tool',
  'Methodology',
  'Concept',
  'Algorithm',
]

const emptyDraft = {
  name: '',
  category: 'Concept',
  subcategory: '',
  dateAdded: '',
  note: '',
  analogy: '',
}

function draftFromInitial(initial) {
  if (initial) {
    return {
      name: initial.name ?? '',
      category: initial.category ?? 'Concept',
      subcategory: initial.subcategory == null ? '' : String(initial.subcategory),
      dateAdded: initial.dateAdded ?? '',
      note: initial.note ?? '',
      analogy: initial.analogy == null ? '' : String(initial.analogy),
    }
  }
  return {
    ...emptyDraft,
    dateAdded: new Date().toISOString().slice(0, 10),
  }
}

export function KeywordForm({ initial, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(() => draftFromInitial(initial))
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const name = draft.name.trim()
    if (!name) {
      setError('Le nom est obligatoire.')
      return
    }
    if (!draft.dateAdded) {
      setError('La date est obligatoire.')
      return
    }
    if (!draft.note.trim()) {
      setError('La note est obligatoire.')
      return
    }
    onSubmit({
      name,
      category: draft.category,
      dateAdded: draft.dateAdded,
      note: draft.note.trim(),
      analogy: draft.analogy.trim() || null,
      subcategory: draft.subcategory.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Nom</label>
        <input
          value={draft.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Catégorie</label>
          <select
            value={draft.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">
            Sous-catégorie
          </label>
          <input
            value={draft.subcategory}
            onChange={(e) => handleChange('subcategory', e.target.value)}
            placeholder="Optionnel"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Date d’ajout</label>
        <input
          type="date"
          value={draft.dateAdded}
          onChange={(e) => handleChange('dateAdded', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Note</label>
        <textarea
          value={draft.note}
          onChange={(e) => handleChange('note', e.target.value)}
          rows={3}
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Analogie</label>
        <textarea
          value={draft.analogy}
          onChange={(e) => handleChange('analogy', e.target.value)}
          rows={2}
          placeholder="Optionnel"
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
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
