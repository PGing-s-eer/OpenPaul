import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useAdminSlice } from '../../hooks/useSiteData'
import { saveAdminSlice } from '../../lib/adminSiteData'
import { suggestCertId } from '../../lib/certIds'
import { Modal } from '../ui/Modal'
import { CertificationForm } from './CertificationForm'

export function AdminCertificationsTab({ onNotice }) {
  const certifications = useAdminSlice('certifications')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formKey, setFormKey] = useState(0)

  const sorted = useMemo(
    () =>
      [...certifications].sort((a, b) =>
        (b.dateObtained || '').localeCompare(a.dateObtained || ''),
      ),
    [certifications],
  )

  function openCreate() {
    setEditing(null)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function openEdit(cert) {
    setEditing(cert)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function persist(nextList) {
    try {
      saveAdminSlice('certifications', nextList)
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
        certifications.map((c) =>
          c.id === editing.id ? { ...c, ...payload, id: editing.id } : c,
        ),
      )
    } else {
      const id = suggestCertId(payload.name, certifications)
      persist([...certifications, { id, ...payload }])
    }
    closeModal()
  }

  function handleDelete(id) {
    if (!window.confirm('Supprimer cette certification ?')) return
    persist(certifications.filter((c) => c.id !== id))
  }

  const modal = (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={editing ? 'Modifier la certification' : 'Nouvelle certification'}
    >
      <CertificationForm key={formKey} initial={editing} onSubmit={handleSave} onCancel={closeModal} />
    </Modal>
  )

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        Cartes de la section Certifications. Export ZIP ou commit de{' '}
        <code className="font-display text-accent-cyan/90">certifications.json</code> pour publier.
      </p>

      <div className="flex justify-end">
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-xs font-medium text-accent-cyan uppercase tracking-wide"
        >
          Ajouter une certification
        </Motion.button>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-white/10 md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-bg/60 font-display text-xs tracking-wide text-muted uppercase">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Organisme</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <Motion.tr
                key={c.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                className="border-b border-white/5"
              >
                <td className="px-4 py-3 font-medium text-text">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c.issuer}</td>
                <td className="px-4 py-3 font-display text-xs text-accent-amber tabular-nums">
                  {c.dateObtained}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{c.id}</td>
                <td className="px-4 py-3 text-right">
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openEdit(c)}
                    className="font-display mr-2 cursor-pointer text-xs text-accent-cyan uppercase"
                  >
                    Éditer
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(c.id)}
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
        {sorted.map((c) => (
          <Motion.li
            key={c.id}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            className="rounded-lg border border-white/10 bg-surface/60 px-4 py-3 text-sm"
          >
            <div className="font-display font-semibold text-text">{c.name}</div>
            <div className="mt-1 text-xs text-muted">
              {c.issuer} · <span className="text-accent-amber">{c.dateObtained}</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted">{c.id}</div>
            <div className="mt-3 flex gap-3">
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEdit(c)}
                className="font-display cursor-pointer text-xs text-accent-cyan uppercase"
              >
                Éditer
              </Motion.button>
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDelete(c.id)}
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
