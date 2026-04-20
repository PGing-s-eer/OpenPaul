import { motion as Motion } from 'framer-motion'
import { useRepoSite } from '../../hooks/useKeywords'

const linkHover = {
  color: '#00f5d4',
  textDecoration: 'underline',
}

export function Footer() {
  const siteData = useRepoSite()
  const { footer, lastUpdated } = siteData

  return (
    <footer className="border-t border-white/5 bg-bg px-4 py-12 sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-sm font-medium text-text">{siteData.brand}</p>
          <p className="mt-2 text-sm text-muted">Portfolio Data Science</p>
        </div>
        <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-3 text-sm">
          <li>
            <Motion.a
              href={footer.github}
              target="_blank"
              rel="noreferrer"
              whileHover={linkHover}
              whileTap={{ scale: 0.98 }}
              className="inline-block text-muted underline-offset-4"
            >
              GitHub
            </Motion.a>
          </li>
          <li>
            <Motion.a
              href={footer.linkedin}
              target="_blank"
              rel="noreferrer"
              whileHover={linkHover}
              whileTap={{ scale: 0.98 }}
              className="inline-block text-muted underline-offset-4"
            >
              LinkedIn
            </Motion.a>
          </li>
          <li>
            <Motion.a
              href={footer.datacamp}
              target="_blank"
              rel="noreferrer"
              whileHover={linkHover}
              whileTap={{ scale: 0.98 }}
              className="inline-block text-muted underline-offset-4"
            >
              DataCamp
            </Motion.a>
          </li>
          <li>
            <Motion.a
              href={`mailto:${footer.email}`}
              whileHover={linkHover}
              whileTap={{ scale: 0.98 }}
              className="inline-block break-all text-muted underline-offset-4"
            >
              {footer.email}
            </Motion.a>
          </li>
        </ul>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-muted/80">
        Dernière mise à jour : {lastUpdated}
      </p>
    </footer>
  )
}
