import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { projectImages } from '../../lib/projectImages'

function initials(title) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function ProjectCard({ project, onOpen, index = 0 }) {
  const images = projectImages(project)
  const hasMultiple = images.length > 1
  const [mediaHover, setMediaHover] = useState(false)
  const [active, setActive] = useState(0)

  const safeActive = Math.min(active, Math.max(images.length - 1, 0))

  const step = (delta) => {
    setActive((i) => (i + delta + images.length) % images.length)
  }

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
      <div
        className="group relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/[0.06] to-transparent"
        onMouseEnter={() => setMediaHover(true)}
        onMouseLeave={() => setMediaHover(false)}
      >
        {images.length > 0 ? (
          <Motion.img
            key={images[safeActive]}
            src={images[safeActive]}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: mediaHover ? 1.03 : 1 }}
            transition={{ opacity: { duration: 0.25 }, scale: { type: 'spring', stiffness: 280, damping: 24 } }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-amber/5">
            <span className="font-display text-2xl font-semibold tracking-widest text-accent-cyan/50">
              {initials(project.title)}
            </span>
          </div>
        )}

        {/* Zone cliquable qui ouvre le détail (sous les flèches). */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Ouvrir le projet ${project.title}`}
          className="absolute inset-0 z-10 cursor-pointer"
        />

        {hasMultiple ? (
          <>
            <Motion.button
              type="button"
              onClick={() => step(-1)}
              aria-label="Image précédente"
              whileTap={{ scale: 0.9 }}
              className="absolute top-1/2 left-2 z-20 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-bg/70 text-text opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span aria-hidden className="text-sm leading-none">‹</span>
            </Motion.button>
            <Motion.button
              type="button"
              onClick={() => step(1)}
              aria-label="Image suivante"
              whileTap={{ scale: 0.9 }}
              className="absolute top-1/2 right-2 z-20 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-bg/70 text-text opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <span aria-hidden className="text-sm leading-none">›</span>
            </Motion.button>

            <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Voir l'image ${i + 1}`}
                  aria-current={i === safeActive}
                  className={`size-1.5 cursor-pointer rounded-full transition-colors ${
                    i === safeActive ? 'bg-accent-cyan' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}

        {project.featured ? (
          <span className="font-display absolute top-3 left-3 z-20 rounded border border-accent-cyan/35 bg-bg/80 px-2 py-0.5 text-[10px] tracking-wider text-accent-cyan uppercase backdrop-blur-sm">
            À la une
          </span>
        ) : null}
      </div>

      <Motion.button
        type="button"
        onClick={() => onOpen(project)}
        whileHover={{
          boxShadow: '0 0 32px rgba(0, 245, 212, 0.12)',
          transition: { type: 'spring', stiffness: 320, damping: 26 },
        }}
        className="flex flex-1 cursor-pointer flex-col gap-3 p-4 text-left sm:p-5"
      >
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
      </Motion.button>
    </Motion.article>
  )
}
