import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import type { GalleryImage } from '../../data/gallery'
import { GALLERY_IMAGES } from '../../data/gallery'
import styles from './PhotoGallery.module.css'

type PhotoGalleryProps = {
  images?: GalleryImage[]
  title?: string
}

export function PhotoGallery({
  images = GALLERY_IMAGES,
  title = 'Memories',
}: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [lightboxVisible, setLightboxVisible] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  const open = openIndex !== null
  const active =
    open && openIndex >= 0 && openIndex < images.length ? images[openIndex] : null

  useLayoutEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => setLightboxVisible(true))
    return () => cancelAnimationFrame(id)
  }, [open])

  const close = useCallback(() => {
    setLightboxVisible(false)
    window.setTimeout(() => setOpenIndex(null), 320)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft' && openIndex !== null && openIndex > 0) {
        setOpenIndex(openIndex - 1)
      }
      if (
        e.key === 'ArrowRight' &&
        openIndex !== null &&
        openIndex < images.length - 1
      ) {
        setOpenIndex(openIndex + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, openIndex, images.length])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open || !lightboxVisible) return
    closeRef.current?.focus()
  }, [open, lightboxVisible, openIndex])

  if (images.length === 0) {
    return (
      <section className={styles.section} aria-label={title}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        <p className={styles.empty}>
          Add images to <code>public/assets/images/</code> and list them in{' '}
          <code>src/data/gallery.ts</code>.
        </p>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-label={title}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <ul className={styles.grid}>
        {images.map((img, index) => (
          <li key={img.src} className={styles.cell}>
            <button
              type="button"
              className={styles.thumbButton}
              onClick={() => setOpenIndex(index)}
              aria-haspopup="dialog"
              aria-label={`Open image: ${img.alt}`}
            >
              <div className={styles.thumbWrap}>
                <img
                  className={styles.thumb}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 479px) 50vw, 33vw"
                />
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && active
        ? createPortal(
            <div
              className={styles.lightboxRoot}
              role="dialog"
              aria-modal="true"
              aria-label={active.alt}
            >
              <button
                type="button"
                className={`${styles.backdrop} ${lightboxVisible ? styles.backdropOpen : ''}`}
                aria-label="Close image"
                onClick={close}
              />
              <div className={styles.frameWrap}>
                <div
                  className={`${styles.frame} ${lightboxVisible ? styles.frameOpen : ''}`}
                >
                  <button
                    ref={closeRef}
                    type="button"
                    className={styles.close}
                    onClick={close}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <img
                    className={styles.fullImg}
                    src={active.src}
                    alt={active.alt}
                    loading="eager"
                    decoding="async"
                  />
                  <p className={styles.caption}>{active.alt}</p>
                  {images.length > 1 ? (
                    <div className={styles.navRow}>
                      <button
                        type="button"
                        className={styles.navBtn}
                        disabled={openIndex === 0}
                        onClick={() =>
                          setOpenIndex((i) =>
                            i !== null && i > 0 ? i - 1 : i,
                          )
                        }
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className={styles.navBtn}
                        disabled={openIndex === images.length - 1}
                        onClick={() =>
                          setOpenIndex((i) =>
                            i !== null && i < images.length - 1 ? i + 1 : i,
                          )
                        }
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  )
}
