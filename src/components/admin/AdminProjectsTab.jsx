import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useAdminSlice } from '../../hooks/useSiteData'
import { saveAdminSlice } from '../../lib/adminSiteData'
import { suggestProjectId } from '../../lib/projectIds'
import { Modal } from '../ui/Modal'
import { ProjectForm } from './ProjectForm'

export function AdminProjectsTab({ onNotice }) {
  const projects = useAdminSlice('projects')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formKey, setFormKey] = useState(0)

  const sorted = useMemo(
    () => [...projects].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fr')),
    [projects],
  )

  function openCreate() {
    setEditing(null)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function openEdit(project) {
    setEditing(project)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function persist(nextList) {
    try {
      saveAdminSlice('projects', nextList)
    } catch (e) {
      onNotice?.({
        type: 'error',
        text: e instanceof Error ? e.message : 'Validation impossible.',
      })
    }
  }

  function handleSave(payload) {
    if (editing) {
      persist(
        projects.map((p) =>
          p.id === editing.id ? { ...p, ...payload, id: editing.id } : p,
        ),
      )
    } else {
      const id = suggestProjectId(payload.title, projects)
      persist([...projects, { id, ...payload }])
    }
    closeModal()
  }

  function handleDelete(id) {
    if (!window.confirm('Supprimer ce projet ?')) return
    persist(projects.filter((p) => p.id !== id))
  }

  const modal = (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={editing ? 'Modifier le projet' : 'Nouveau projet'}
    >
      <ProjectForm key={formKey} initial={editing} onSubmit={handleSave} onCancel={closeModal} />
    </Modal>
  )

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        Gère les cartes de la section Projets. Pense à exporter le ZIP (ou{' '}
        <code className="font-display text-accent-cyan/90">projects.json</code> seul via ton
        workflow) puis à commit dans <code className="font-display text-xs">src/data/</code>.
      </p>

      <div className="flex justify-end">
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-xs font-medium text-accent-cyan uppercase tracking-wide"
        >
          Ajouter un projet
        </Motion.button>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-white/10 md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-bg/60 font-display text-xs tracking-wide text-muted uppercase">
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3">À la une</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <Motion.tr
                key={p.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                className="border-b border-white/5"
              >
                <td className="px-4 py-3 font-medium text-text">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.id}</td>
                <td className="px-4 py-3 font-display text-xs text-accent-amber">
                  {p.featured ? 'Oui' : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openEdit(p)}
                    className="font-display mr-2 cursor-pointer text-xs text-accent-cyan uppercase"
                  >
                    Éditer
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(p.id)}
                    className="font-display cursor-pointer text-xs text-red-400/90 uppercase"
                  >
                    Supprimer
                  </Motion.button>
                </td>
              </Motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {sorted.map((p) => (
          <Motion.li
            key={p.id}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            className="rounded-lg border border-white/10 bg-surface/60 px-4 py-3 text-sm"
          >
            <div className="font-display font-semibold text-text">{p.title}</div>
            <div className="mt-1 font-mono text-[11px] text-muted">{p.id}</div>
            {p.featured ? (
              <div className="mt-1 font-display text-[11px] text-accent-amber uppercase">À la une</div>
            ) : null}
            <div className="mt-3 flex gap-3">
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEdit(p)}
                className="font-display cursor-pointer text-xs text-accent-cyan uppercase"
              >
                Éditer
              </Motion.button>
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDelete(p.id)}
                className="font-display cursor-pointer text-xs text-red-400/90 uppercase"
              >
                Supprimer
              </Motion.button>
            </div>
          </Motion.li>
        ))}
      </ul>

      {typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </div>
  )
}
