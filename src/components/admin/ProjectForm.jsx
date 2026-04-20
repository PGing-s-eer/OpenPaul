import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

function parseTagLines(text) {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function draftFromInitial(initial) {
  if (initial) {
    return {
      title: initial.title ?? '',
      shortDescription: initial.shortDescription ?? '',
      fullDescription: initial.fullDescription ?? '',
      tagsText: Array.isArray(initial.tags) ? initial.tags.join(', ') : '',
      methodologyText: Array.isArray(initial.methodology) ? initial.methodology.join(', ') : '',
      githubUrl: initial.githubUrl == null ? '' : String(initial.githubUrl),
      demoUrl: initial.demoUrl == null ? '' : String(initial.demoUrl),
      videoUrl: initial.videoUrl == null ? '' : String(initial.videoUrl),
      thumbnail: initial.thumbnail == null ? '' : String(initial.thumbnail),
      featured: Boolean(initial.featured),
    }
  }
  return {
    title: '',
    shortDescription: '',
    fullDescription: '',
    tagsText: '',
    methodologyText: '',
    githubUrl: '',
    demoUrl: '',
    videoUrl: '',
    thumbnail: '',
    featured: false,
  }
}

function urlOrNull(s) {
  const t = String(s || '').trim()
  return t === '' ? null : t
}

export function ProjectForm({ initial, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(() => draftFromInitial(initial))
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const title = draft.title.trim()
    if (!title) {
      setError('Le titre est obligatoire.')
      return
    }
    if (!draft.shortDescription.trim()) {
      setError('La description courte est obligatoire.')
      return
    }
    if (!draft.fullDescription.trim()) {
      setError('La description longue est obligatoire.')
      return
    }
    const tags = parseTagLines(draft.tagsText)
    const methodology = parseTagLines(draft.methodologyText)
    onSubmit({
      title,
      shortDescription: draft.shortDescription.trim(),
      fullDescription: draft.fullDescription.trim(),
      tags,
      methodology,
      githubUrl: urlOrNull(draft.githubUrl),
      demoUrl: urlOrNull(draft.demoUrl),
      videoUrl: urlOrNull(draft.videoUrl),
      thumbnail: urlOrNull(draft.thumbnail),
      featured: draft.featured,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[min(70vh,640px)] space-y-4 overflow-y-auto pr-1">
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">Titre</label>
        <input
          value={draft.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Description courte
        </label>
        <textarea
          value={draft.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          rows={2}
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Description longue
        </label>
        <textarea
          value={draft.fullDescription}
          onChange={(e) => handleChange('fullDescription', e.target.value)}
          rows={5}
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Tags (séparés par des virgules)
        </label>
        <textarea
          value={draft.tagsText}
          onChange={(e) => handleChange('tagsText', e.target.value)}
          rows={2}
          placeholder="Python, SQL, Data Viz"
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div>
        <label className="font-display text-xs tracking-wide text-muted uppercase">
          Méthodologie (séparées par des virgules)
        </label>
        <textarea
          value={draft.methodologyText}
          onChange={(e) => handleChange('methodologyText', e.target.value)}
          rows={2}
          placeholder="EDA, Reporting"
          className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">GitHub URL</label>
          <input
            value={draft.githubUrl}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
            placeholder="https://… ou vide"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Démo URL</label>
          <input
            value={draft.demoUrl}
            onChange={(e) => handleChange('demoUrl', e.target.value)}
            placeholder="https://… ou vide"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Vidéo URL</label>
          <input
            value={draft.videoUrl}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            placeholder="YouTube… ou vide"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Image (URL)</label>
          <input
            value={draft.thumbnail}
            onChange={(e) => handleChange('thumbnail', e.target.value)}
            placeholder="/assets/… ou vide"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={draft.featured}
          onChange={(e) => handleChange('featured', e.target.checked)}
          className="size-4 rounded border-white/20 bg-bg text-accent-cyan focus:ring-accent-cyan/40"
        />
        <span className="font-display text-xs tracking-wide uppercase">Projet mis en avant</span>
      </label>
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
