import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { useRepoKeywords, useRepoSite } from '../../hooks/useKeywords'
import { WordCloudBackground } from './WordCloudBackground'

function scrollToId(id) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Hero() {
  const siteData = useRepoSite()
  const keywords = useRepoKeywords()
  const terms = useMemo(() => keywords.map((k) => k.name), [keywords])

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-bg px-4 pt-24 pb-16 sm:px-6 md:px-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(232,232,240,0.04) 2px, rgba(232,232,240,0.04) 4px)',
        }}
      />
      <WordCloudBackground terms={terms} />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <Motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-sm font-medium tracking-[0.2em] text-accent-cyan uppercase"
        >
          {siteData.brand}
        </Motion.p>
        <Motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-display mt-4 text-3xl leading-tight font-semibold text-text sm:text-4xl md:text-5xl"
        >
          {siteData.title}
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 max-w-2xl text-lg text-muted md:text-xl"
        >
          {siteData.subtitle}
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToId(siteData.ctaTargetId)}
            className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-6 py-3 text-sm font-medium tracking-wide text-accent-cyan uppercase"
          >
            {siteData.heroCta}
          </Motion.button>
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-16 flex justify-center"
      >
        <Motion.button
          type="button"
          aria-label="Faire défiler vers le bas"
          whileHover={{ y: 4 }}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          onClick={() => scrollToId(siteData.ctaTargetId)}
          className="font-display cursor-pointer text-xs tracking-widest text-muted uppercase"
        >
          <span className="block pb-2">Scroll</span>
          <span className="mx-auto block h-8 w-px bg-gradient-to-b from-accent-cyan/60 to-transparent" />
        </Motion.button>
      </Motion.div>
    </section>
  )
}
