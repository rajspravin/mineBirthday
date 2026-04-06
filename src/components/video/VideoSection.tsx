import { useCallback, useEffect, useRef, useState } from 'react'
import type { VideoClip } from '../../data/videos'
import { VIDEO_CLIPS } from '../../data/videos'
import { useNearViewport } from '../../hooks/useNearViewport'
import styles from './VideoSection.module.css'

type VideoSectionProps = {
  clips?: VideoClip[]
  title?: string
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}

type VideoCardProps = {
  clip: VideoClip
  anotherIsPlaying: boolean
  playingSrc: string | null
  onPlayingChange: (src: string | null) => void
}

function VideoCard({
  clip,
  anotherIsPlaying,
  playingSrc,
  onPlayingChange,
}: VideoCardProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const near = useNearViewport(shellRef)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!anotherIsPlaying) return
    videoRef.current?.pause()
  }, [anotherIsPlaying])

  const handleOverlayClick = () => {
    const v = videoRef.current
    if (!v) return
    void v.play().catch(() => {
      /* missing file or playback blocked */
    })
  }

  const handlePause = useCallback(() => {
    const v = videoRef.current
    if (v?.paused && playingSrc === clip.src) {
      onPlayingChange(null)
    }
  }, [clip.src, onPlayingChange, playingSrc])

  const handleEnded = useCallback(() => {
    if (playingSrc === clip.src) {
      onPlayingChange(null)
    }
  }, [clip.src, onPlayingChange, playingSrc])

  return (
    <li className={styles.card}>
      <article className={styles.cardInner}>
        <div ref={shellRef} className={styles.mediaShell}>
          {!near ? (
            <div className={styles.placeholder} aria-hidden>
              Scroll to load video
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className={styles.video}
                src={clip.src}
                poster={clip.poster}
                preload="none"
                playsInline
                controls={started}
                onPlay={() => {
                  setStarted(true)
                  onPlayingChange(clip.src)
                }}
                onPause={handlePause}
                onEnded={handleEnded}
              />
              <button
                type="button"
                className={`${styles.overlay} ${started ? styles.overlayHidden : ''}`}
                onClick={handleOverlayClick}
                aria-label={`Play video: ${clip.title}`}
              >
                <span className={styles.playIcon}>
                  <PlayGlyph />
                </span>
              </button>
            </>
          )}
        </div>
        <div className={styles.meta}>
          <h3 className={styles.clipTitle}>{clip.title}</h3>
          {clip.description ? (
            <p className={styles.clipDesc}>{clip.description}</p>
          ) : null}
        </div>
      </article>
    </li>
  )
}

export function VideoSection({
  clips = VIDEO_CLIPS,
  title = 'Video moments',
}: VideoSectionProps) {
  const [playingSrc, setPlayingSrc] = useState<string | null>(null)

  const onPlayingChange = useCallback((src: string | null) => {
    setPlayingSrc(src)
  }, [])

  if (clips.length === 0) {
    return (
      <section className={styles.section} aria-label={title}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        <p className={styles.empty}>
          Add videos to <code>public/assets/videos/</code> and list them in{' '}
          <code>src/data/videos.ts</code>.
        </p>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-label={title}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <ul className={styles.list}>
        {clips.map((clip) => (
          <VideoCard
            key={clip.src}
            clip={clip}
            anotherIsPlaying={
              playingSrc !== null && playingSrc !== clip.src
            }
            playingSrc={playingSrc}
            onPlayingChange={onPlayingChange}
          />
        ))}
      </ul>
    </section>
  )
}
