/**
 * Sections à remplacer par le contenu réel (phases suivantes).
 */
export function SectionPlaceholder({ id, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-white/5 bg-surface px-4 py-20 sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-xl font-semibold text-text md:text-2xl">{title}</h2>
        <p className="mt-3 text-muted">{children}</p>
      </div>
    </section>
  )
}
