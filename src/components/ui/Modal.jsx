import { useEffect } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'

export function Modal({ open, onClose, title, children, onExitComplete }) {
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open ? (
        <Motion.div
          key="modal-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
        >
          <Motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <Motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 flex max-h-[min(90svh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-white/10 bg-surface shadow-[0_0_0_1px_rgba(0,245,212,0.06)]"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
              <h2
                id="modal-title"
                className="font-display pr-8 text-lg font-semibold leading-snug text-text sm:text-xl"
              >
                {title}
              </h2>
              <Motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(0, 245, 212, 0.35)',
                  color: '#00f5d4',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="font-display -mr-1 -mt-1 shrink-0 cursor-pointer rounded border border-white/10 px-2.5 py-1 text-xs text-muted uppercase tracking-wide"
              >
                Fermer
              </Motion.button>
            </div>
            <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}
