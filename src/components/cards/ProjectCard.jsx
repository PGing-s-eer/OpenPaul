import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

function initials(title) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ProjectCard({ project, onOpen, index = 0 }) {
  const hasThumb = Boolean(project.thumbnail)
  const [mediaHover, setMediaHover] = useState(false)

  return (
    <Motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        transition: { type: 'spring', stiffness: 380, damping: 26 },
      }}
      className="flex flex-col overflow-hidden rounded-lg border border-white/8 bg-bg/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      <Motion.button
        type="button"
        onClick={() => onOpen(project)}
        onHoverStart={() => setMediaHover(true)}
        onHoverEnd={() => setMediaHover(false)}
        whileHover={{
          boxShadow: '0 0 32px rgba(0, 245, 212, 0.12)',
          transition: { type: 'spring', stiffness: 320, damping: 26 },
        }}
        className="flex cursor-pointer flex-col text-left"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/[0.06] to-transparent">
          {hasThumb ? (
            <Motion.img
              src={project.thumbnail}
              alt=""
              animate={{ scale: mediaHover ? 1.03 : 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-amber/5">
              <span className="font-display text-2xl font-semibold tracking-widest text-accent-cyan/50">
                {initials(project.title)}
              </span>
            </div>
          )}
          {project.featured ? (
            <span className="font-display absolute top-3 left-3 rounded border border-accent-cyan/35 bg-bg/80 px-2 py-0.5 text-[10px] tracking-wider text-accent-cyan uppercase backdrop-blur-sm">
              À la une
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div>
            <h3 className="font-display text-base font-semibold text-text sm:text-lg">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.shortDescription}
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <li
                key={tag}
                className="rounded border border-accent-cyan/25 bg-accent-cyan/5 px-2 py-0.5 font-display text-[11px] text-accent-cyan"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Motion.button>
    </Motion.article>
  )
}
