import { Children } from 'react'
import { motion as Motion } from 'framer-motion'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

const mainContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
}

const sectionItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Motion.main
        className="min-w-0"
        variants={mainContainer}
        initial="hidden"
        animate="visible"
      >
        {Children.map(children, (child, index) => (
          <Motion.div key={child.key ?? index} variants={sectionItem}>
            {child}
          </Motion.div>
        ))}
      </Motion.main>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.45 }}
      >
        <Footer />
      </Motion.div>
    </>
  )
}
