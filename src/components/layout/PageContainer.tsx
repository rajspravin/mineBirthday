import type { ReactNode } from 'react'
import styles from './PageContainer.module.css'

type PageContainerProps = {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`${styles.root}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
