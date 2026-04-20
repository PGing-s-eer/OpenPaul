import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'

const CX = 100
const CY = 100
const R = 72

function vertex(angle, radius) {
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)]
}

function polygonAtLevel(n, level) {
  if (!n) return ''
  return [...Array(n)]
    .map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
      const r = R * level
      const [x, y] = vertex(angle, r)
      return `${x},${y}`
    })
    .join(' ')
}

function dataPolygon(domains) {
  const n = domains.length
  if (!n) return ''
  return domains
    .map((d, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
      const rad = (d.progress / 100) * R
      const [x, y] = vertex(angle, rad)
      return `${x},${y}`
    })
    .join(' ')
}

export function DataCampRadar({ domains }) {
  const n = domains.length
  const outline = useMemo(() => polygonAtLevel(n, 1), [n])
  const dataPoints = useMemo(() => dataPolygon(domains), [domains])

  return (
    <div className="flex flex-col">
      <h3 className="font-display mb-4 text-xs font-medium tracking-wide text-muted uppercase">
        Radar des domaines
      </h3>
      <Motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[280px] mx-auto lg:mx-0"
      >
        <svg viewBox="0 0 200 200" className="w-full overflow-visible" aria-hidden>
          {[0.33, 0.66, 1].map((level) => (
            <polygon
              key={level}
              points={polygonAtLevel(n, level)}
              fill="none"
              stroke="rgba(232,232,240,0.08)"
              strokeWidth="1"
            />
          ))}
          {n > 0
            ? [...Array(n)].map((_, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
                const [x2, y2] = vertex(angle, R)
                return (
                  <line
                    key={i}
                    x1={CX}
                    y1={CY}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(232,232,240,0.06)"
                    strokeWidth="1"
                  />
                )
              })
            : null}
          {n > 0 ? (
            <Motion.polygon
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              points={dataPoints}
              fill="rgba(0, 245, 212, 0.14)"
              stroke="#00f5d4"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ) : null}
          <polygon points={outline} fill="none" stroke="rgba(0,245,212,0.22)" strokeWidth="1" />
        </svg>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-center text-[11px] text-muted sm:text-xs">
          {domains.map((d) => (
            <li key={d.name} className="truncate" title={d.name}>
              {d.name}{' '}
              <span className="font-display text-accent-cyan">{d.progress}%</span>
            </li>
          ))}
        </ul>
      </Motion.div>
    </div>
  )
}
