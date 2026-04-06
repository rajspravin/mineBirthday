import { useEffect } from 'react'
import { GalleryRomanticBackdrop } from '../components/gallery/GalleryRomanticBackdrop'
import { PhotoGallery } from '../components/gallery/PhotoGallery'
import { PageContainer } from '../components/layout/PageContainer'
import { BackLink } from '../components/ui/BackLink'
import { useMusicPlayback } from '../hooks/useMusicPlayback'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const {
    startSlideshowMusic,
    stopSlideshowMusic,
    resumeBackgroundIfReady,
  } = useMusicPlayback()

  useEffect(() => {
    startSlideshowMusic()
    return () => {
      stopSlideshowMusic()
      resumeBackgroundIfReady()
    }
  }, [startSlideshowMusic, stopSlideshowMusic, resumeBackgroundIfReady])

  return (
    <div className={styles.pageRoot}>
      <GalleryRomanticBackdrop />
      <div className={styles.contentLayer}>
        <PageContainer>
          <BackLink />
          <PhotoGallery />
        </PageContainer>
      </div>
    </div>
  )
}
