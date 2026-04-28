import { useRepoCertifications } from '../../hooks/useKeywords'
import { CertCard } from '../cards/CertCard'

export function CertificationsSection() {
  const certificationsData = useRepoCertifications()
  return (
    <section
      id="certifications"
      className="scroll-mt-20 border-t border-white/5 bg-surface px-4 py-20 sm:px-6 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-xl font-semibold text-text md:text-2xl">Certifications</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Evaluations certifiants une maîtrise dans un domaine. 
          Chaque carte renvoie vers la preuve publique du credential.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {certificationsData.map((cert, index) => (
            <CertCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
