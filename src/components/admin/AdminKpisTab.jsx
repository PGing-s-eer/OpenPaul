import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useAdminSlice } from '../../hooks/useSiteData'
import { saveAdminSlice } from '../../lib/adminSiteData'
import { suggestKpiId } from '../../lib/kpiIds'
import { KpiIcon } from '../sections/KpiIcons'
import { Modal } from '../ui/Modal'
import { KpiForm } from './KpiForm'

function kpiKind(row) {
  return typeof row.value === 'number' && !Number.isNaN(row.value) ? 'fixe' : 'dynamique'
}

function kpiSourceOrValue(row) {
  if (typeof row.value === 'number' && !Number.isNaN(row.value)) {
    return String(row.value)
  }
  return row.source ?? '—'
}

export function AdminKpisTab({ onNotice }) {
  const kpis = useAdminSlice('kpis')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formKey, setFormKey] = useState(0)

  const sorted = useMemo(() => [...kpis], [kpis])

  function openCreate() {
    setEditing(null)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function persist(nextList) {
    try {
      saveAdminSlice('kpis', nextList)
    } catch (e) {
      onNotice?.({
        type: 'error',
        text: e instanceof Error ? e.message : 'Validation impossible.',
      })
    }
  }

  function buildRow(id, payload) {
    const base = {
      id,
      label: payload.label,
      icon: payload.icon,
      suffix: payload.suffix ?? '',
    }
    if ('value' in payload && typeof payload.value === 'number') {
      return { ...base, value: payload.value }
    }
    return { ...base, source: payload.source }
  }

  function handleSave(payload) {
    if (editing) {
      persist(kpis.map((k) => (k.id === editing.id ? buildRow(editing.id, payload) : k)))
    } else {
      const id = suggestKpiId(payload.label, kpis)
      persist([...kpis, buildRow(id, payload)])
    }
    closeModal()
  }

  function handleDelete(id) {
    if (kpis.length <= 1) {
      onNotice?.({
        type: 'error',
        text: 'Il doit rester au moins un indicateur (kpis.json non vide).',
      })
      return
    }
    if (!window.confirm('Supprimer ce KPI ?')) return
    persist(kpis.filter((k) => k.id !== id))
  }

  const modal = (
    <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Modifier le KPI' : 'Nouveau KPI'}>
      <KpiForm key={formKey} initial={editing} onSubmit={handleSave} onCancel={closeModal} />
    </Modal>
  )

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted">
        Bandeau « Indicateurs » : une ligne = un KPI. Les entrées <strong>dynamiques</strong> lisent
        projets, certifications, keywords ou DataCamp (voir le code de la section KPIs). Les entrées{' '}
        <strong>fixes</strong> affichent un nombre saisi.
      </p>

      <div className="flex justify-end">
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-xs font-medium text-accent-cyan uppercase tracking-wide"
        >
          Ajouter un KPI
        </Motion.button>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-white/10 md:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-bg/60 font-display text-xs tracking-wide text-muted uppercase">
              <th className="w-12 px-4 py-3" aria-hidden />
              <th className="px-4 py-3">Libellé</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Source / valeur</th>
              <th className="px-4 py-3">Id</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((k) => (
              <Motion.tr
                key={k.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                className="border-b border-white/5"
              >
                <td className="px-4 py-3">
                  <KpiIcon name={k.icon} />
                </td>
                <td className="px-4 py-3 font-medium text-text">{k.label}</td>
                <td className="px-4 py-3 font-display text-xs text-muted uppercase">{kpiKind(k)}</td>
                <td className="max-w-[14rem] truncate px-4 py-3 font-mono text-xs text-accent-amber">
                  {kpiSourceOrValue(k)}
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted">{k.id}</td>
                <td className="px-4 py-3 text-right">
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openEdit(k)}
                    className="font-display mr-2 cursor-pointer text-xs text-accent-cyan uppercase"
                  >
                    Éditer
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ textDecoration: 'underline' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(k.id)}
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
        {sorted.map((k) => (
          <Motion.li
            key={k.id}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            className="rounded-lg border border-white/10 bg-surface/60 px-4 py-3 text-sm"
          >
            <div className="flex items-start gap-3">
              <KpiIcon name={k.icon} />
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-text">{k.label}</div>
                <div className="mt-1 font-display text-[11px] text-muted uppercase">
                  {kpiKind(k)} · <span className="font-mono text-accent-amber">{kpiSourceOrValue(k)}</span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-muted">{k.id}</div>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEdit(k)}
                className="font-display cursor-pointer text-xs text-accent-cyan uppercase"
              >
                Éditer
              </Motion.button>
              <Motion.button
                type="button"
                whileHover={{ textDecoration: 'underline' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDelete(k.id)}
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
