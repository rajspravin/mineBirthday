import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { pageVariants, transitionPage } from '../../motion/presets'
import { MusicToggle } from '../ui/MusicToggle'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const reducedMotion = useReducedMotion() ?? false

  return (
    <div className={styles.shell}>
      <MusicToggle />
      <main className={styles.main}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className={styles.pageWrap}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitionPage(reducedMotion)}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
