import { useEffect, useState } from 'react'
import { useAdminSlice } from '../../hooks/useSiteData'
import { saveAdminSlice } from '../../lib/adminSiteData'
import { SiteForm } from './SiteForm'

function copySite(site) {
  return JSON.parse(JSON.stringify(site))
}

function normalizeSiteDraft(d) {
  const nav = d.nav
    .map((n) => ({ id: String(n.id || '').trim(), label: String(n.label || '').trim() }))
    .filter((n) => n.id && n.label)
  if (nav.length === 0) {
    throw new Error('Ajoute au moins une entrée de menu avec un id et un libellé.')
  }
  return {
    brand: d.brand.trim(),
    title: d.title.trim(),
    subtitle: d.subtitle.trim(),
    heroCta: d.heroCta.trim(),
    ctaTargetId: d.ctaTargetId.trim(),
    lastUpdated: d.lastUpdated.trim() || new Date().toISOString().slice(0, 10),
    nav,
    footer: {
      github: d.footer.github.trim(),
      linkedin: d.footer.linkedin.trim(),
      datacamp: d.footer.datacamp.trim(),
      email: d.footer.email.trim(),
    },
    seo: {
      documentTitle: d.seo.documentTitle.trim(),
      metaDescription: d.seo.metaDescription.trim(),
      siteUrl: d.seo.siteUrl.trim(),
      ogImage: d.seo.ogImage.trim(),
      twitterSite: d.seo.twitterSite.trim(),
    },
  }
}

export function AdminSiteTab() {
  const site = useAdminSlice('site')
  const [draft, setDraft] = useState(() => copySite(site))
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- recharger le brouillon quand la source admin change
    setDraft(copySite(site))
  }, [site])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const normalized = normalizeSiteDraft(draft)
      saveAdminSlice('site', normalized)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Enregistrement impossible.'
      setError(msg)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Contenu global : marque, hero, liens du menu (ancres des sections), footer, SEO. Enregistre
        puis exporte le ZIP ou <code className="font-display text-accent-cyan/90">site.json</code>{' '}
        via ton workflow Git.
      </p>
      <SiteForm draft={draft} setDraft={setDraft} onSubmit={handleSubmit} error={error} />
    </div>
  )
}
