import { useEffect, useState } from 'react'

type UseTypingTextOptions = {
  msPerChar?: number
  enabled?: boolean
}

/**
 * Types out `text` one character at a time when `enabled` is true.
 * Lightweight — no external animation libraries.
 */
export function useTypingText(
  text: string,
  { msPerChar = 80, enabled = true }: UseTypingTextOptions = {},
) {
  const [len, setLen] = useState(0)
  const [prevText, setPrevText] = useState(text)

  if (text !== prevText) {
    setPrevText(text)
    setLen(0)
  }

  useEffect(() => {
    if (!enabled || len >= text.length) return
    const id = window.setTimeout(() => setLen((n) => n + 1), msPerChar)
    return () => window.clearTimeout(id)
  }, [enabled, len, text, msPerChar])

  return {
    displayed: text.slice(0, len),
    complete: len >= text.length,
  }
}
