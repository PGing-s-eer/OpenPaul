import { motion as Motion } from 'framer-motion'
import { useRepoDatacamp } from '../../hooks/useKeywords'
import { DataCampRadar } from './DataCampRadar'

function formatInt(n) {
  return typeof n === 'number' ? n.toLocaleString('fr-FR') : '0'
}

function StatTile({ label, value, delay = 0 }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white/8 bg-bg/50 px-4 py-5 sm:px-5 sm:py-6"
    >
      <p className="font-display text-[11px] tracking-wide text-muted uppercase">{label}</p>
      <p className="font-display mt-2 text-2xl font-semibold tabular-nums text-accent-amber sm:text-3xl">
        {value}
      </p>
    </Motion.div>
  )
}

function DomainBars({ domains }) {
  return (
    <div className="flex flex-col">
      <h3 className="font-display mb-5 text-xs font-medium tracking-wide text-muted uppercase">
        Barres de progression
      </h3>
      <ul className="space-y-5">
        {domains.map((d, i) => (
          <li key={d.name}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate text-text">{d.name}</span>
              <span className="font-display shrink-0 text-xs text-accent-cyan tabular-nums">
                {d.progress}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <Motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-cyan/50 to-accent-cyan"
                initial={{ width: 0 }}
                whileInView={{ width: `${d.progress}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.95, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DataCampSection() {
  const { totalXp, coursesCompleted, skillAssessmentsPassed, careerTracksCompleted, domains } =
    useRepoDatacamp()

  return (
    <section
      id="datacamp"
      className="scroll-mt-20 border-t border-white/5 bg-bg px-4 py-20 sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-xl font-semibold text-text md:text-2xl">DataCamp</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Synthèse de l’activité sur la plateforme : XP cumulée, volumes de parcours complétés et
          répartition estimée par domaine (à ajuster selon ton profil réel).
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <StatTile label="XP total" value={formatInt(totalXp)} delay={0} />
          <StatTile label="Cours complétés" value={formatInt(coursesCompleted)} delay={0.05} />
          <StatTile
            label="Évaluations réussies"
            value={formatInt(skillAssessmentsPassed)}
            delay={0.1}
          />
          <StatTile
            label="Parcours carrière"
            value={formatInt(careerTracksCompleted)}
            delay={0.15}
          />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-14">
          <DataCampRadar domains={domains} />
          <DomainBars domains={domains} />
        </div>
      </div>
    </section>
  )
}
