import { motion as Motion } from 'framer-motion'

const CATEGORY_LABEL = {
  Language: 'Langage',
  Library: 'Bibliothèque',
  Framework: 'Framework',
  Tool: 'Outil',
  Methodology: 'Méthodologie',
  Concept: 'Concept',
}

export function KeywordCard({ keyword, index = 0 }) {
  const catLabel = CATEGORY_LABEL[keyword.category] || keyword.category

  return (
    <Motion.article
      initial={{ opacity: 0, y: -14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="rounded-lg border border-white/10 bg-bg/85 p-5 shadow-[0_0_0_1px_rgba(0,245,212,0.04)] backdrop-blur-sm sm:p-6"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-3 gap-y-1">
        <h3 className="font-display text-lg font-semibold text-text sm:text-xl">{keyword.name}</h3>
        <time
          dateTime={keyword.dateAdded}
          className="font-display shrink-0 text-xs text-accent-amber tabular-nums"
        >
          {keyword.dateAdded}
        </time>
      </header>

      <p className="mt-2 text-xs text-muted">
        <span className="font-display text-accent-cyan">{catLabel}</span>
        {keyword.subcategory ? (
          <>
            {' · '}
            <span>{keyword.subcategory}</span>
          </>
        ) : null}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-text/90">{keyword.note}</p>

      {keyword.analogy ? (
        <blockquote className="mt-4 border-l-2 border-accent-cyan/35 pl-4 text-sm italic leading-relaxed text-muted">
          {keyword.analogy}
        </blockquote>
      ) : null}
    </Motion.article>
  )
}
