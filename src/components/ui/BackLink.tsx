import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { easingSoft } from '../../motion/presets'
import styles from './BackLink.module.css'

type BackLinkProps = {
  to?: string
  children?: ReactNode
}

export function BackLink({ to = '/home', children = '← Back' }: BackLinkProps) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      className={styles.wrap}
      initial={reduced ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: reduced ? 0 : 0.4,
        ease: easingSoft,
        delay: 0.05,
      }}
    >
      <motion.div whileTap={reduced ? undefined : { scale: 0.97 }}>
        <Link className={styles.link} to={to}>
          {children}
        </Link>
      </motion.div>
    </motion.div>
  )
}
