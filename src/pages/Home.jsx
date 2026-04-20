import { Layout } from '../components/layout/Layout'
import { CertificationsSection } from '../components/sections/CertificationsSection'
import { DataCampSection } from '../components/sections/DataCampSection'
import { Hero } from '../components/sections/Hero'
import { KpiStrip } from '../components/sections/KpiStrip'
import { LibrarySection } from '../components/sections/LibrarySection'
import { ProjectsSection } from '../components/sections/ProjectsSection'

export default function Home() {
  return (
    <Layout>
      <Hero key="hero" />
      <KpiStrip key="kpis" />
      <ProjectsSection key="projects" />
      <CertificationsSection key="certifications" />
      <DataCampSection key="datacamp" />
      <LibrarySection key="library" />
    </Layout>
  )
}
