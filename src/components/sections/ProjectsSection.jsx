import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useRepoProjects } from '../../hooks/useKeywords'
import { ProjectCard } from '../cards/ProjectCard'
import { Modal } from '../ui/Modal'

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
      {project.thumbnail ? (
        <div className="overflow-hidden rounded-md border border-white/10">
          <img
            src={project.thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

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
