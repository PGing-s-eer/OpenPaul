import { motion as Motion } from 'framer-motion'
import { clampProgress } from '../../lib/datacampNormalize'

function newDomainRow() {
  return {
    name: '',
    progress: 50,
    _key:
      typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID
        ? globalThis.crypto.randomUUID()
        : `dc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }
}

function updateDomain(draft, index, patch) {
  return {
    ...draft,
    domains: draft.domains.map((row, i) => (i === index ? { ...row, ...patch } : row)),
  }
}

function addDomain(draft) {
  return { ...draft, domains: [...draft.domains, newDomainRow()] }
}

function removeDomain(draft, index) {
  return { ...draft, domains: draft.domains.filter((_, i) => i !== index) }
}

function moveDomain(draft, from, to) {
  if (to < 0 || to >= draft.domains.length) return draft
  const next = [...draft.domains]
  const [row] = next.splice(from, 1)
  next.splice(to, 0, row)
  return { ...draft, domains: next }
}

const STATS = [
  {
    key: 'totalXp',
    label: 'XP cumulée',
    hint: 'Total affiché sur la section DataCamp et utilisé par le KPI « XP DataCamp ».',
  },
  {
    key: 'coursesCompleted',
    label: 'Cours complétés',
    hint: 'Nombre de cours terminés sur la plateforme.',
  },
  {
    key: 'skillAssessmentsPassed',
    label: 'Évaluations réussies',
    hint: 'Skill assessments / certifications internes DataCamp.',
  },
  {
    key: 'careerTracksCompleted',
    label: 'Parcours carrière',
    hint: 'Career tracks complétés (tracks guidés).',
  },
]

export function DataCampForm({ draft, setDraft, onSubmit, error }) {
  function setStat(key, raw) {
    const n = Number(raw)
    setDraft((d) => ({
      ...d,
      [key]: Number.isFinite(n) && n >= 0 ? Math.round(n) : 0,
    }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">
            Synthèse chiffrée
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
            Ces quatre valeurs alimentent les tuiles en haut de la section publique DataCamp. Ce sont
            des entiers positifs (arrondis automatiquement).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {STATS.map(({ key, label, hint }) => (
            <div key={key} className="rounded-md border border-white/8 bg-bg/40 p-3 sm:p-4">
              <label className="font-display text-xs tracking-wide text-muted uppercase">{label}</label>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={draft[key]}
                onChange={(e) => setStat(key, e.target.value)}
                className="font-body mt-2 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-lg font-medium tabular-nums text-accent-amber outline-none focus:border-accent-cyan/50 sm:text-xl"
              />
              <p className="mt-2 text-[11px] leading-snug text-muted">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">
              Domaines (radar &amp; barres)
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
              Chaque ligne = un axe du radar et une barre de progression. L’<strong>ordre</strong> dans
              cette liste est l’ordre des points sur le cercle (sens horaire depuis le haut). La
              progression est un pourcentage <strong>0 à 100</strong> (niveau affiché sur le site).
              Les noms en double (sans tenir compte de la casse) sont fusionnés à l’enregistrement.
            </p>
          </div>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDraft((d) => addDomain(d))}
            className="font-display shrink-0 self-start rounded border border-accent-cyan/35 bg-accent-cyan/10 px-3 py-2 text-xs font-medium tracking-wide text-accent-cyan uppercase"
          >
            Ajouter un domaine
          </Motion.button>
        </div>

        <div className="hidden space-y-3 md:block">
          {draft.domains.length === 0 ? (
            <p className="rounded-md border border-dashed border-white/15 bg-bg/30 px-4 py-6 text-center text-sm text-muted">
              Aucun domaine : ajoute au moins une ligne pour alimenter le radar et les barres.
            </p>
          ) : (
            draft.domains.map((row, i) => (
              <div
                key={row._key}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-white/10 bg-bg/50 p-4"
              >
                <div className="min-w-[10rem] flex-1">
                  <label className="font-display text-[10px] tracking-wide text-muted uppercase">
                    Nom du domaine
                  </label>
                  <input
                    value={row.name}
                    onChange={(e) =>
                      setDraft((d) => updateDomain(d, i, { name: e.target.value }))
                    }
                    placeholder="Python, SQL…"
                    className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
                  />
                </div>
                <div className="w-full min-w-[12rem] flex-[2] sm:w-auto">
                  <div className="flex items-center justify-between gap-2">
                    <label className="font-display text-[10px] tracking-wide text-muted uppercase">
                      Progression
                    </label>
                    <span className="font-display text-xs tabular-nums text-accent-cyan">
                      {clampProgress(row.progress)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={clampProgress(row.progress)}
                    onChange={(e) =>
                      setDraft((d) =>
                        updateDomain(d, i, { progress: Number(e.target.value) }),
                      )
                    }
                    className="mt-2 w-full accent-accent-cyan"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={clampProgress(row.progress)}
                    onChange={(e) =>
                      setDraft((d) =>
                        updateDomain(d, i, { progress: clampProgress(e.target.value) }),
                      )
                    }
                    className="font-body mt-2 w-full max-w-[6rem] rounded-md border border-white/12 bg-bg px-2 py-1 text-sm tabular-nums text-text outline-none focus:border-accent-cyan/50"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pb-0.5">
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={i === 0}
                    onClick={() => setDraft((d) => moveDomain(d, i, i - 1))}
                    className="font-display rounded border border-white/12 px-2 py-1 text-xs text-muted uppercase disabled:opacity-25"
                  >
                    Monter
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={i >= draft.domains.length - 1}
                    onClick={() => setDraft((d) => moveDomain(d, i, i + 1))}
                    className="font-display rounded border border-white/12 px-2 py-1 text-xs text-muted uppercase disabled:opacity-25"
                  >
                    Descendre
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ color: '#f87171' }}
                    onClick={() => setDraft((d) => removeDomain(d, i))}
                    className="font-display rounded border border-white/12 px-2 py-1 text-xs text-red-400/90 uppercase"
                  >
                    Retirer
                  </Motion.button>
                </div>
              </div>
            ))
          )}
        </div>

        <ul className="space-y-4 md:hidden">
          {draft.domains.map((row, i) => (
            <li key={row._key} className="rounded-lg border border-white/10 bg-bg/50 p-4">
              <label className="font-display text-[10px] tracking-wide text-muted uppercase">
                Nom
              </label>
              <input
                value={row.name}
                onChange={(e) => setDraft((d) => updateDomain(d, i, { name: e.target.value }))}
                className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none"
              />
              <label className="mt-3 block font-display text-[10px] tracking-wide text-muted uppercase">
                Progression {clampProgress(row.progress)}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={clampProgress(row.progress)}
                onChange={(e) =>
                  setDraft((d) => updateDomain(d, i, { progress: Number(e.target.value) }))
                }
                className="mt-2 w-full accent-accent-cyan"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={clampProgress(row.progress)}
                onChange={(e) =>
                  setDraft((d) =>
                    updateDomain(d, i, { progress: clampProgress(e.target.value) }),
                  )
                }
                className="font-body mt-2 w-24 rounded-md border border-white/12 bg-bg px-2 py-1 text-sm outline-none"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  disabled={i === 0}
                  onClick={() => setDraft((d) => moveDomain(d, i, i - 1))}
                  className="font-display rounded border border-white/12 px-2 py-1 text-[11px] uppercase disabled:opacity-25"
                >
                  Monter
                </Motion.button>
                <Motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  disabled={i >= draft.domains.length - 1}
                  onClick={() => setDraft((d) => moveDomain(d, i, i + 1))}
                  className="font-display rounded border border-white/12 px-2 py-1 text-[11px] uppercase disabled:opacity-25"
                >
                  Descendre
                </Motion.button>
                <Motion.button
                  type="button"
                  onClick={() => setDraft((d) => removeDomain(d, i))}
                  className="font-display text-[11px] text-red-400/90 uppercase"
                >
                  Retirer
                </Motion.button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {error ? <p className="text-sm text-red-400/90">{error}</p> : null}

      <Motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="font-display cursor-pointer rounded-lg border border-accent-cyan/45 bg-accent-cyan/12 px-6 py-2.5 text-xs font-semibold tracking-wide text-accent-cyan uppercase"
      >
        Enregistrer dans le navigateur
      </Motion.button>
    </form>
  )
}
