import { motion as Motion } from 'framer-motion'

function updateNav(draft, index, field, value) {
  return {
    ...draft,
    nav: draft.nav.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
  }
}

function addNavRow(draft) {
  return { ...draft, nav: [...draft.nav, { id: '', label: '' }] }
}

function removeNavRow(draft, index) {
  if (draft.nav.length <= 1) return draft
  return { ...draft, nav: draft.nav.filter((_, i) => i !== index) }
}

export function SiteForm({ draft, setDraft, onSubmit, error }) {
  function setField(path, value) {
    if (path.startsWith('footer.')) {
      const k = path.slice(7)
      setDraft((d) => ({ ...d, footer: { ...d.footer, [k]: value } }))
      return
    }
    if (path.startsWith('seo.')) {
      const k = path.slice(4)
      setDraft((d) => ({ ...d, seo: { ...d.seo, [k]: value } }))
      return
    }
    setDraft((d) => ({ ...d, [path]: value }))
  }

  const navIds = draft.nav.map((n) => n.id).filter(Boolean)

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">
          Identité &amp; hero
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">Marque</label>
            <input
              value={draft.brand}
              onChange={(e) => setField('brand', e.target.value)}
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          </div>
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">
              Dernière mise à jour
            </label>
            <input
              type="date"
              value={(draft.lastUpdated || '').slice(0, 10)}
              onChange={(e) => setField('lastUpdated', e.target.value)}
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          </div>
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Titre principal</label>
          <input
            value={draft.title}
            onChange={(e) => setField('title', e.target.value)}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Sous-titre</label>
          <input
            value={draft.subtitle}
            onChange={(e) => setField('subtitle', e.target.value)}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">Texte CTA</label>
            <input
              value={draft.heroCta}
              onChange={(e) => setField('heroCta', e.target.value)}
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          </div>
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">
              Cible du CTA (id de section)
            </label>
            <input
              list="site-nav-ids-datalist"
              value={draft.ctaTargetId}
              onChange={(e) => setField('ctaTargetId', e.target.value)}
              placeholder="kpis, projects…"
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
            <datalist id="site-nav-ids-datalist">
              {navIds.map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
            <p className="mt-1 text-[11px] text-muted">
              Doit correspondre à l’<code className="font-display">id</code> d’une entrée du menu.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">
            Menu (navbar)
          </h2>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDraft((d) => addNavRow(d))}
            className="font-display self-start rounded border border-white/15 px-3 py-1.5 text-xs text-muted uppercase tracking-wide sm:self-auto"
          >
            Ajouter une entrée
          </Motion.button>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-display text-xs tracking-wide text-muted uppercase">
                <th className="py-2 pr-3">Id (ancre)</th>
                <th className="py-2 pr-3">Libellé</th>
                <th className="w-24 py-2 text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {draft.nav.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 pr-2">
                    <input
                      value={row.id}
                      onChange={(e) => setDraft((d) => updateNav(d, i, 'id', e.target.value))}
                      className="font-mono w-full rounded border border-white/12 bg-bg px-2 py-1.5 text-xs text-text outline-none focus:border-accent-cyan/50"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      value={row.label}
                      onChange={(e) => setDraft((d) => updateNav(d, i, 'label', e.target.value))}
                      className="font-body w-full rounded border border-white/12 bg-bg px-2 py-1.5 text-sm text-text outline-none focus:border-accent-cyan/50"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <Motion.button
                      type="button"
                      whileHover={{ color: '#f87171' }}
                      onClick={() => setDraft((d) => removeNavRow(d, i))}
                      disabled={draft.nav.length <= 1}
                      className="font-display cursor-pointer text-xs text-red-400/80 uppercase disabled:opacity-30"
                    >
                      Retirer
                    </Motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-3 md:hidden">
          {draft.nav.map((row, i) => (
            <li key={i} className="rounded border border-white/10 bg-bg/50 p-3">
              <label className="font-display text-[10px] tracking-wide text-muted uppercase">Id</label>
              <input
                value={row.id}
                onChange={(e) => setDraft((d) => updateNav(d, i, 'id', e.target.value))}
                className="font-mono mt-1 w-full rounded border border-white/12 bg-bg px-2 py-1.5 text-xs text-text outline-none"
              />
              <label className="mt-2 block font-display text-[10px] tracking-wide text-muted uppercase">
                Libellé
              </label>
              <input
                value={row.label}
                onChange={(e) => setDraft((d) => updateNav(d, i, 'label', e.target.value))}
                className="font-body mt-1 w-full rounded border border-white/12 bg-bg px-2 py-1.5 text-sm text-text outline-none"
              />
              <Motion.button
                type="button"
                whileHover={{ color: '#f87171' }}
                onClick={() => setDraft((d) => removeNavRow(d, i))}
                disabled={draft.nav.length <= 1}
                className="font-display mt-2 text-xs text-red-400/80 uppercase disabled:opacity-30"
              >
                Retirer
              </Motion.button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">
          Pied de page
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {['github', 'linkedin', 'datacamp', 'email'].map((k) => (
            <div key={k}>
              <label className="font-display text-xs tracking-wide text-muted uppercase">{k}</label>
              <input
                value={draft.footer[k]}
                onChange={(e) => setField(`footer.${k}`, e.target.value)}
                className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-white/10 bg-surface/40 p-4 sm:p-5">
        <h2 className="font-display text-sm font-semibold tracking-wide text-accent-cyan uppercase">SEO</h2>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Titre du document</label>
          <input
            value={draft.seo.documentTitle}
            onChange={(e) => setField('seo.documentTitle', e.target.value)}
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Meta description</label>
          <textarea
            value={draft.seo.metaDescription}
            onChange={(e) => setField('seo.metaDescription', e.target.value)}
            rows={3}
            className="font-body mt-1 w-full resize-y rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">URL du site</label>
            <input
              value={draft.seo.siteUrl}
              onChange={(e) => setField('seo.siteUrl', e.target.value)}
              placeholder="https://… ou vide"
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          </div>
          <div>
            <label className="font-display text-xs tracking-wide text-muted uppercase">Image Open Graph</label>
            <input
              value={draft.seo.ogImage}
              onChange={(e) => setField('seo.ogImage', e.target.value)}
              placeholder="/og-image.svg"
              className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
            />
          </div>
        </div>
        <div>
          <label className="font-display text-xs tracking-wide text-muted uppercase">Twitter @site</label>
          <input
            value={draft.seo.twitterSite}
            onChange={(e) => setField('seo.twitterSite', e.target.value)}
            placeholder="@handle ou vide"
            className="font-body mt-1 w-full rounded-md border border-white/12 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent-cyan/50"
          />
        </div>
      </section>

      {error ? <p className="text-sm text-red-400/90">{error}</p> : null}

      <Motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="font-display cursor-pointer rounded-lg border border-accent-cyan/45 bg-accent-cyan/12 px-6 py-2.5 text-xs font-semibold tracking-wide text-accent-cyan uppercase"
      >
        Enregistrer dans le navigateur
      </Motion.button>
    </form>
  )
}
