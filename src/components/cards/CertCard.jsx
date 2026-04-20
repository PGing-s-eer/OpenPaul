import { motion as Motion } from 'framer-motion'

function badgeInitials(name, issuer) {
  const from = name || issuer || '?'
  const parts = from.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return from.slice(0, 2).toUpperCase()
}

export function CertCard({ cert, index = 0 }) {
  const hasBadge = Boolean(cert.badgeUrl)

  return (
    <Motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 400, damping: 28 },
      }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-bg/60 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-accent-cyan/15 to-transparent sm:h-[4.5rem] sm:w-[4.5rem]">
            {hasBadge ? (
              <Motion.img
                src={cert.badgeUrl}
                alt=""
                whileHover={{
                  scale: 1.06,
                  transition: { type: 'spring', stiffness: 380, damping: 22 },
                }}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-xs font-semibold tracking-wide text-accent-cyan/80">
                  {badgeInitials(cert.name, cert.issuer)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-semibold leading-snug text-text sm:text-base">
              {cert.name}
            </h3>
            <p className="mt-1 text-xs text-muted sm:text-sm">{cert.issuer}</p>
            <p className="mt-2 font-display text-xs text-accent-amber">{cert.dateObtained}</p>
          </div>
        </div>

        <Motion.a
          href={cert.credentialUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{
            scale: 1.02,
            borderColor: 'rgba(0, 245, 212, 0.55)',
            backgroundColor: 'rgba(0, 245, 212, 0.12)',
            transition: { type: 'spring', stiffness: 400, damping: 28 },
          }}
          whileTap={{ scale: 0.98 }}
          className="font-display mt-5 inline-flex w-fit cursor-pointer rounded border border-accent-cyan/35 bg-accent-cyan/5 px-3 py-2 text-xs tracking-wide text-accent-cyan uppercase"
        >
          Voir le certificat
        </Motion.a>
      </div>
    </Motion.article>
  )
}
