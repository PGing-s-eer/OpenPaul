import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion as Motion } from 'framer-motion'
import { useAdminKeywords } from '../../hooks/useKeywords'
import { clearAdminSession } from '../../lib/adminAuth'
import { clearAllAdminDataOverrides } from '../../lib/adminSiteData'
import { buildOpenPaulDataZipBlob, importOpenPaulDataZipBlob } from '../../lib/dataZip'
import { uniqueKeywordId, slugify } from '../../lib/keywordIds'
import {
  clearKeywordsOverride,
  parseImportedKeywordsJson,
  saveKeywords,
} from '../../lib/keywordsStorage'
import { Modal } from '../ui/Modal'
import { MotionLink } from '../ui/MotionLink'
import { AdminCertificationsTab } from './AdminCertificationsTab'
import { AdminDataCampTab } from './AdminDataCampTab'
import { AdminKpisTab } from './AdminKpisTab'
import { AdminProjectsTab } from './AdminProjectsTab'
import { AdminSiteTab } from './AdminSiteTab'
import { KeywordForm } from './KeywordForm'

const TABS = [
  { id: 'keywords', label: 'Mots-clés' },
  { id: 'projects', label: 'Projets' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'datacamp', label: 'DataCamp' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'site', label: 'Site' },
]

export function AdminDashboard({ onLogout }) {
  const keywords = useAdminKeywords()
  const [activeTab, setActiveTab] = useState('keywords')
  const keywordsFileRef = useRef(null)
  const zipFileRef = useRef(null)
  const [persistNotice, setPersistNotice] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formKey, setFormKey] = useState(0)

  const sorted = useMemo(
    () => [...keywords].sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || '')),
    [keywords],
  )

  function setNotice(n) {
    setPersistNotice(n)
  }

  function openCreate() {
    setEditing(null)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function openEdit(kw) {
    setEditing(kw)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function handleSave(payload) {
    if (editing) {
      saveKeywords(
        keywords.map((k) =>
          k.id === editing.id ? { ...k, ...payload, id: editing.id } : k,
        ),
      )
    } else {
      const base = slugify(payload.name)
      const id = uniqueKeywordId(base, keywords)
      saveKeywords([...keywords, { id, ...payload }])
    }
    closeModal()
  }

  function handleDelete(id) {
    if (!window.confirm('Supprimer ce mot-clé ?')) return
    saveKeywords(keywords.filter((k) => k.id !== id))
  }

  function exportKeywordsOnly() {
    setPersistNotice(null)
    const blob = new Blob([JSON.stringify(keywords, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keywords.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function openKeywordsImportPicker() {
    setPersistNotice(null)
    keywordsFileRef.current?.click()
  }

  function handleKeywordsImportChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const result = parseImportedKeywordsJson(text)
      if (!result.ok) {
        setPersistNotice({ type: 'error', text: result.error })
        return
      }
      saveKeywords(result.data)
      setPersistNotice({
        type: 'success',
        text: `${result.data.length} mot(s)-clé importés dans le navigateur.`,
      })
    }
    reader.onerror = () => {
      setPersistNotice({ type: 'error', text: 'Impossible de lire le fichier.' })
    }
    reader.readAsText(file)
  }

  async function downloadDataZip() {
    setPersistNotice(null)
    try {
      const blob = await buildOpenPaulDataZipBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'openpaul-data.zip'
      a.click()
      URL.revokeObjectURL(url)
      setPersistNotice({
        type: 'success',
        text: 'ZIP téléchargé : décompresse-le et remplace le contenu de src/data/ dans ton repo.',
      })
    } catch {
      setPersistNotice({ type: 'error', text: 'Impossible de générer le ZIP.' })
    }
  }

  function openZipImportPicker() {
    setPersistNotice(null)
    zipFileRef.current?.click()
  }

  async function handleZipImportChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const result = await importOpenPaulDataZipBlob(file)
    if (!result.ok) {
      setPersistNotice({ type: 'error', text: result.error })
      return
    }
    setPersistNotice({
      type: 'success',
      text: 'Les 6 fichiers JSON du ZIP ont été importés dans le navigateur.',
    })
  }

  function handleResetKeywordsOnly() {
    if (
      !window.confirm(
        'Effacer uniquement la copie locale des mots-clés et revenir au fichier du dépôt ?',
      )
    ) {
      return
    }
    clearKeywordsOverride()
    setPersistNotice({ type: 'success', text: 'Copie locale des mots-clés effacée.' })
  }

  function handleResetAllLocal() {
    if (
      !window.confirm(
        'Effacer TOUTES les copies locales (les 6 JSON : mots-clés, projets, certifications, DataCamp, KPIs, site) et revenir aux fichiers du dépôt ?',
      )
    ) {
      return
    }
    clearAllAdminDataOverrides()
    setPersistNotice({ type: 'success', text: 'Toutes les surcharges locales ont été effacées.' })
  }

  function logout() {
    clearAdminSession()
    onLogout()
  }

  const modal = (
    <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Modifier le mot-clé' : 'Nouveau mot-clé'}>
      <KeywordForm key={formKey} initial={editing} onSubmit={handleSave} onCancel={closeModal} />
    </Modal>
  )

  return (
    <div className="min-h-svh bg-bg text-text">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <h1 className="font-display text-base font-semibold">Admin — données du site</h1>
          <div className="flex flex-wrap items-center gap-2">
            <MotionLink
              to="/"
              whileHover={{ scale: 1.02, borderColor: 'rgba(0, 245, 212, 0.35)', color: '#00f5d4' }}
              whileTap={{ scale: 0.98 }}
              className="font-display inline-block rounded border border-white/12 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
            >
              Site public
            </MotionLink>
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255, 190, 11, 0.45)', color: '#ffbe0b' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetAllLocal}
              className="font-display cursor-pointer rounded border border-white/12 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
            >
              Tout réinitialiser
            </Motion.button>
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02, color: '#e8e8f0' }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="font-display cursor-pointer rounded border border-white/12 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
            >
              Déconnexion
            </Motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <input
          ref={keywordsFileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Importer keywords.json"
          onChange={handleKeywordsImportChange}
        />
        <input
          ref={zipFileRef}
          type="file"
          accept=".zip,application/zip"
          className="sr-only"
          tabIndex={-1}
          aria-label="Importer un ZIP openpaul-data"
          onChange={handleZipImportChange}
        />

        <section
          className="rounded-xl border-2 border-accent-cyan/35 bg-accent-cyan/[0.06] p-5 shadow-[0_0_0_1px_rgba(0,245,212,0.12)] sm:p-6"
          aria-labelledby="data-persist-heading"
        >
          <h2 id="data-persist-heading" className="font-display text-lg font-semibold tracking-tight text-text sm:text-xl">
            Exporter tout <code className="text-accent-cyan">src/data/</code>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text/95 sm:text-base">
            Après une session d&apos;édition, télécharge le ZIP, remplace les six fichiers JSON dans{' '}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-display text-xs text-accent-cyan sm:text-sm">
              src/data/
            </code>{' '}
            dans ton repo, puis push sur GitHub — le site se met à jour automatiquement via Vercel.
          </p>
          <p className="mt-2 text-xs text-muted sm:text-sm">
            Le site public lit toujours les fichiers du dépôt au moment du build. L&apos;admin stocke
            les brouillons dans{' '}
            <code className="font-display text-accent-cyan/80">localStorage</code> jusqu&apos;à
            export + commit.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center">
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadDataZip}
              className="font-display w-full cursor-pointer rounded-lg border-2 border-accent-cyan/60 bg-accent-cyan/15 px-5 py-3.5 text-center text-sm font-semibold tracking-wide text-accent-cyan uppercase shadow-[0_0_24px_rgba(0,245,212,0.15)] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              Télécharger src/data (.zip)
            </Motion.button>
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.28)' }}
              whileTap={{ scale: 0.98 }}
              onClick={openZipImportPicker}
              className="font-display w-full cursor-pointer rounded-lg border border-white/20 bg-surface/80 px-5 py-3 text-center text-xs font-medium tracking-wide text-text uppercase sm:w-auto sm:px-6 sm:text-sm"
            >
              Importer ZIP (6 JSON)
            </Motion.button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Le ZIP doit contenir les fichiers à la racine (ou dans un dossier{' '}
            <code className="font-display text-accent-cyan/80">data/</code>) : keywords.json,
            projects.json, certifications.json, datacamp.json, kpis.json, site.json.
          </p>
        </section>

        {persistNotice ? (
          <p
            role="status"
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              persistNotice.type === 'error'
                ? 'border-red-400/40 bg-red-500/10 text-red-200'
                : 'border-accent-cyan/30 bg-accent-cyan/10 text-text'
            }`}
          >
            {persistNotice.text}
          </p>
        ) : null}

        <div
          className="mt-8 flex gap-1 overflow-x-auto border-b border-white/10 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Jeux de données"
        >
          {TABS.map((t) => (
            <Motion.button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              whileHover={{ color: '#00f5d4' }}
              onClick={() => {
                setActiveTab(t.id)
                setPersistNotice(null)
              }}
              className={`font-display shrink-0 cursor-pointer border-b-2 px-3 py-2.5 text-xs tracking-wide uppercase transition-none sm:px-4 sm:text-sm ${
                activeTab === t.id
                  ? 'border-accent-cyan text-accent-cyan'
                  : 'border-transparent text-muted'
              }`}
            >
              {t.label}
            </Motion.button>
          ))}
        </div>

        <div className="mt-8" role="tabpanel">
          {activeTab === 'keywords' ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-surface/40 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  Import / export rapide du seul fichier{' '}
                  <code className="font-display text-accent-cyan/90">keywords.json</code>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportKeywordsOnly}
                    className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
                  >
                    Télécharger keywords.json
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openKeywordsImportPicker}
                    className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
                  >
                    Importer keywords.json
                  </Motion.button>
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.02, color: '#ffbe0b' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetKeywordsOnly}
                    className="font-display cursor-pointer rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide"
                  >
                    Réinit. mots-clés
                  </Motion.button>
                </div>
              </div>

              <div className="flex justify-end">
                <Motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCreate}
                  className="font-display cursor-pointer rounded border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2 text-xs font-medium text-accent-cyan uppercase tracking-wide"
                >
                  Ajouter un mot-clé
                </Motion.button>
              </div>

              <div className="hidden overflow-x-auto rounded-lg border border-white/10 md:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-bg/60 font-display text-xs tracking-wide text-muted uppercase">
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">Catégorie</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((kw) => (
                      <Motion.tr
                        key={kw.id}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
                        className="border-b border-white/5"
                      >
                        <td className="px-4 py-3 font-medium text-text">{kw.name}</td>
                        <td className="px-4 py-3 text-muted">{kw.category}</td>
                        <td className="px-4 py-3 font-display text-xs text-accent-amber tabular-nums">
                          {kw.dateAdded}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Motion.button
                            type="button"
                            whileHover={{ textDecoration: 'underline' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openEdit(kw)}
                            className="font-display mr-2 cursor-pointer text-xs text-accent-cyan uppercase"
                          >
                            Éditer
                          </Motion.button>
                          <Motion.button
                            type="button"
                            whileHover={{ textDecoration: 'underline' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDelete(kw.id)}
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
                {sorted.map((kw) => (
                  <Motion.li
                    key={kw.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                    className="rounded-lg border border-white/10 bg-surface/60 px-4 py-3 text-sm"
                  >
                    <div className="font-display font-semibold text-text">{kw.name}</div>
                    <div className="mt-1 text-xs text-muted">
                      {kw.category} · <span className="text-accent-amber">{kw.dateAdded}</span>
                    </div>
                    <div className="mt-3 flex gap-3">
                      <Motion.button
                        type="button"
                        whileHover={{ textDecoration: 'underline' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openEdit(kw)}
                        className="font-display cursor-pointer text-xs text-accent-cyan uppercase"
                      >
                        Éditer
                      </Motion.button>
                      <Motion.button
                        type="button"
                        whileHover={{ textDecoration: 'underline' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDelete(kw.id)}
                        className="font-display cursor-pointer text-xs text-red-400/90 uppercase"
                      >
                        Supprimer
                      </Motion.button>
                    </div>
                  </Motion.li>
                ))}
              </ul>
            </div>
          ) : activeTab === 'projects' ? (
            <AdminProjectsTab onNotice={setNotice} />
          ) : activeTab === 'certifications' ? (
            <AdminCertificationsTab onNotice={setNotice} />
          ) : activeTab === 'kpis' ? (
            <AdminKpisTab onNotice={setNotice} />
          ) : activeTab === 'site' ? (
            <AdminSiteTab />
          ) : activeTab === 'datacamp' ? (
            <AdminDataCampTab />
          ) : null}
        </div>
      </main>

      {typeof document !== 'undefined' ? createPortal(modal, document.body) : null}
    </div>
  )
}
