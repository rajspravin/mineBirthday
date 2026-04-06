import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FinaleSection } from '../components/finale/FinaleSection'
import { PageContainer } from '../components/layout/PageContainer'
import styles from './FinalePage.module.css'

export default function FinalePage() {
  const reduced = useReducedMotion() ?? false

  return (
    <PageContainer>
      <FinaleSection />
      <motion.div
        className={styles.homeLinkWrap}
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.35 }}
      >
        <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
          <Link className={styles.homeLink} to="/home">
            Back home
          </Link>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
