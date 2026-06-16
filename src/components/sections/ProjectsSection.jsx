import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useRepoProjects } from '../../hooks/useKeywords'
import { projectImages } from '../../lib/projectImages'
import { ProjectCard } from '../cards/ProjectCard'
import { Modal } from '../ui/Modal'

function ProjectGallery({ project }) {
  const images = projectImages(project)
  const [active, setActive] = useState(0)

  if (images.length === 0) return null

  const safeActive = Math.min(active, images.length - 1)
  const hasMultiple = images.length > 1
  const step = (delta) => setActive((i) => (i + delta + images.length) % images.length)

  return (
    <div className="group relative overflow-hidden rounded-md border border-white/10">
      <Motion.img
        key={images[safeActive]}
        src={images[safeActive]}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="h-full w-full object-cover"
      />

      {hasMultiple ? (
        <>
          <Motion.button
            type="button"
            onClick={() => step(-1)}
            aria-label="Image précédente"
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-bg/70 text-text backdrop-blur-sm transition-opacity hover:border-accent-cyan/40"
          >
            <span aria-hidden className="text-base leading-none">‹</span>
          </Motion.button>
          <Motion.button
            type="button"
            onClick={() => step(1)}
            aria-label="Image suivante"
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-bg/70 text-text backdrop-blur-sm transition-opacity hover:border-accent-cyan/40"
          >
            <span aria-hidden className="text-base leading-none">›</span>
          </Motion.button>

          <div className="absolute right-2 bottom-2 rounded bg-bg/70 px-2 py-0.5 font-display text-[11px] text-muted backdrop-blur-sm">
            {safeActive + 1} / {images.length}
          </div>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Voir l'image ${i + 1}`}
                aria-current={i === safeActive}
                className={`size-2 cursor-pointer rounded-full transition-colors ${
                  i === safeActive ? 'bg-accent-cyan' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

function youtubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const shorts = u.pathname.match(/\/shorts\/([^/]+)/)
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }
  return null
}

function ProjectModalContent({ project }) {
  const embed = youtubeEmbedUrl(project.videoUrl)

  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted sm:text-base">
      <ProjectGallery project={project} />

      {project.methodology?.length ? (
        <div>
          <h3 className="font-display mb-2 text-xs font-medium tracking-wide text-accent-amber uppercase">
            Méthodologie
          </h3>
          <ul className="flex flex-wrap gap-2">
            {project.methodology.map((m) => (
              <li
                key={m}
                className="rounded border border-accent-amber/25 bg-accent-amber/5 px-2.5 py-1 font-display text-xs text-accent-amber"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h3 className="font-display mb-2 text-xs font-medium tracking-wide text-accent-cyan uppercase">
          Stack &amp; domaine
        </h3>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded border border-accent-cyan/25 bg-accent-cyan/5 px-2.5 py-1 font-display text-xs text-accent-cyan"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <p className="whitespace-pre-line text-text/95">{project.fullDescription}</p>

      {embed ? (
        <div className="overflow-hidden rounded-md border border-white/10">
          <div className="aspect-video w-full">
            <iframe
              title={`Vidéo — ${project.title}`}
              src={embed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : project.videoUrl ? (
        <Motion.a
          href={project.videoUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ color: '#00f5d4', textDecoration: 'underline' }}
          whileTap={{ scale: 0.99 }}
          className="font-display inline-flex text-accent-cyan underline-offset-4"
        >
          Voir la vidéo (lien externe)
        </Motion.a>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        {project.githubUrl ? (
          <Motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ borderColor: 'rgba(0, 245, 212, 0.45)', color: '#00f5d4' }}
            whileTap={{ scale: 0.98 }}
            className="font-display rounded border border-white/15 px-3 py-2 text-xs text-text uppercase tracking-wide"
          >
            GitHub
          </Motion.a>
        ) : null}
        {project.demoUrl ? (
          <Motion.a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ borderColor: 'rgba(0, 245, 212, 0.45)', color: '#00f5d4' }}
            whileTap={{ scale: 0.98 }}
            className="font-display rounded border border-white/15 px-3 py-2 text-xs text-text uppercase tracking-wide"
          >
            Démo
          </Motion.a>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const projectsData = useRepoProjects()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalProject, setModalProject] = useState(null)

  const openModal = (project) => {
    setModalProject(project)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleExitComplete = () => {
    setModalProject(null)
  }

  const modal = (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      onExitComplete={handleExitComplete}
      title={modalProject?.title ?? ''}
    >
      {modalProject ? <ProjectModalContent project={modalProject} /> : null}
    </Modal>
  )

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-white/5 bg-bg px-4 py-20 sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-xl font-semibold text-text md:text-2xl">Projets</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Sélection de réalisations data : stack, méthodes et contexte métier. Cliquez sur une carte
          pour le détail.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openModal}
            />
          ))}
        </div>
      </div>

      {typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </section>
  )
}
