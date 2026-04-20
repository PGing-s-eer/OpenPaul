import { useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion as Motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import {
  useRepoCertifications,
  useRepoDatacamp,
  useRepoKeywords,
  useRepoKpis,
  useRepoProjects,
} from '../../hooks/useKeywords'
import { KpiIcon } from './KpiIcons'

function resolveNumericValue(entry, ctx) {
  if (typeof entry.value === 'number') return entry.value
  switch (entry.source) {
    case 'projects':
      return ctx.projectsLen
    case 'certifications':
      return ctx.certsLen
    case 'keywords':
      return ctx.keywordsLen
    case 'datacamp.totalXp':
      return ctx.datacamp.totalXp ?? 0
    case 'datacamp.coursesCompleted':
      return ctx.datacamp.coursesCompleted ?? 0
    default:
      return 0
  }
}

function KpiAnimatedNumber({ value, start, delayMs, suffix }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useMotionValueEvent(count, 'change', (v) => {
    setDisplay(Math.round(v))
  })

  useEffect(() => {
    if (!start) return undefined

    let controls
    const timeoutId = window.setTimeout(() => {
      count.set(0)
      controls = animate(count, value, {
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1],
      })
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
      controls?.stop()
    }
  }, [start, value, delayMs, count])

  const formatted =
    value >= 1000 ? display.toLocaleString('fr-FR') : String(display)

  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 md:justify-start">
      <span className="font-display text-3xl font-semibold tracking-tight text-accent-amber tabular-nums sm:text-4xl">
        {formatted}
      </span>
      {suffix ? (
        <span className="font-display text-sm font-medium whitespace-nowrap text-muted sm:text-base">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

export function KpiStrip() {
  const keywords = useRepoKeywords()
  const projects = useRepoProjects()
  const certifications = useRepoCertifications()
  const datacamp = useRepoDatacamp()
  const kpisConfig = useRepoKpis()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 })

  const items = useMemo(
    () =>
      kpisConfig.map((entry) => ({
        ...entry,
        numericValue: resolveNumericValue(entry, {
          projectsLen: projects.length,
          certsLen: certifications.length,
          keywordsLen: keywords.length,
          datacamp,
        }),
        suffix: entry.suffix ?? '',
      })),
    [keywords, projects, certifications, datacamp, kpisConfig],
  )

  return (
    <section
      ref={sectionRef}
      id="kpis"
      className="scroll-mt-20 border-t border-white/5 bg-surface px-4 py-14 sm:px-6 md:px-10 md:py-16"
      aria-labelledby="kpis-heading"
    >
      <h2 id="kpis-heading" className="sr-only">
        Indicateurs clés
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-5 md:gap-6 lg:gap-8">
        {items.map((item, index) => (
          <Motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{
              duration: 0.5,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="mb-3 flex justify-center md:justify-start">
              <KpiIcon name={item.icon} />
            </div>
            <KpiAnimatedNumber
              value={item.numericValue}
              start={isInView}
              delayMs={index * 70}
              suffix={item.suffix}
            />
            <p className="mt-2 max-w-[12rem] text-xs leading-snug text-muted sm:text-sm">
              {item.label}
            </p>
          </Motion.div>
        ))}
      </div>
    </section>
  )
}
