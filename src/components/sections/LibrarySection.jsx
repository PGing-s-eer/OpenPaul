import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { useKeywordFilter } from '../../hooks/useKeywordFilter'
import { useRepoKeywords } from '../../hooks/useKeywords'
import { KeywordCard } from '../cards/KeywordCard'
import { WordCloudBackground } from './WordCloudBackground'

const CHIP_ORDER = [
  'Toutes',
  'Language',
  'Library',
  'Framework',
  'Tool',
  'Methodology',
  'Concept',
  'Algorithm',
]

const CHIP_LABEL = {
  Toutes: 'Toutes',
  Language: 'Langage',
  Library: 'Bibliothèque',
  Framework: 'Framework',
  Tool: 'Outil',
  Methodology: 'Méthodologie',
  Concept: 'Concept',
  Algorithm: 'Algorithm',
}

export function LibrarySection() {
  const keywords = useRepoKeywords()
  const cloudTerms = useMemo(() => keywords.map((k) => k.name), [keywords])
  const { query, setQuery, category, setCategory, filtered } = useKeywordFilter(keywords)

  return (
    <section
      id="library"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-surface px-4 py-20 sm:px-6 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <WordCloudBackground terms={cloudTerms} />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl lg:max-w-4xl">
        <h2 className="font-display text-xl font-semibold text-text md:text-2xl">
          Bibliothèque de connaissances
        </h2>
        <p className="mt-3 text-muted">
          Mots-clés appris, avec notes personnelles et analogies. Les entrées les plus récentes
          apparaissent en premier.
        </p>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="sr-only">Rechercher dans la bibliothèque</span>
            <Motion.input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Recherchez si Paul en a connaissance…"
              whileFocus={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
              className="font-body w-full rounded-md border border-white/12 bg-bg/90 px-4 py-3 text-sm text-text shadow-inner outline-none backdrop-blur-sm placeholder:text-muted/70 focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30"
            />
          </label>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrer par catégorie"
          >
            {CHIP_ORDER.map((chip) => {
              const active =
                chip === 'Toutes' ? category === null : category === chip
              return (
                <Motion.button
                  key={chip}
                  type="button"
                  whileHover={
                    active
                      ? { scale: 1.03 }
                      : {
                          scale: 1.03,
                          borderColor: 'rgba(0, 245, 212, 0.25)',
                          color: '#e8e8f0',
                        }
                  }
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCategory(chip === 'Toutes' ? null : chip)}
                  className={`font-display cursor-pointer rounded-full border px-3 py-1.5 text-xs tracking-wide uppercase ${
                    active
                      ? 'border-accent-cyan/50 bg-accent-cyan/15 text-accent-cyan'
                      : 'border-white/10 bg-bg/60 text-muted'
                  }`}
                >
                  {CHIP_LABEL[chip] || chip}
                </Motion.button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 space-y-5">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-bg/70 px-4 py-8 text-center text-sm text-muted backdrop-blur-sm">
              Aucun résultat pour cette recherche ou ce filtre.
            </p>
          ) : (
            filtered.map((kw, index) => <KeywordCard key={kw.id} keyword={kw} index={index} />)
          )}
        </div>
      </div>
    </section>
  )
}
