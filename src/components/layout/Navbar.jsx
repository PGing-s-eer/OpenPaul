import { motion as Motion } from 'framer-motion'
import { useRepoSite } from '../../hooks/useKeywords'

function scrollToId(id) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Navbar() {
  const siteData = useRepoSite()
  return (
    <Motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-md"
    >
      <nav
        className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:px-10"
        aria-label="Principale"
      >
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToId('hero')}
          className="font-display shrink-0 cursor-pointer text-sm font-semibold tracking-tight text-text"
        >
          {siteData.brand}
        </Motion.button>

        <ul className="flex min-w-0 max-w-[min(72vw,28rem)] flex-nowrap justify-end gap-x-3 gap-y-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-none sm:flex-wrap sm:gap-x-6 [&::-webkit-scrollbar]:hidden">
          {siteData.nav.map((item) => (
            <li key={item.id}>
              <Motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToId(item.id)}
                whileHover={{ color: '#00f5d4' }}
                className="font-display cursor-pointer text-xs tracking-wide text-muted uppercase"
              >
                {item.label}
              </Motion.button>
            </li>
          ))}
        </ul>
      </nav>
    </Motion.header>
  )
}
