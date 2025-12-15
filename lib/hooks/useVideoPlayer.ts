/**
 * Custom hook for video player state management
 */

import { useState, useRef, useEffect, useCallback } from 'react'

interface UseVideoPlayerOptions {
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const {
    autoplay = true,
    loop = true,
    muted = true,
    onProgress,
    onComplete,
  } = options

  const [playing, setPlaying] = useState(autoplay)
  const [mutedState, setMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<any>(null)

  const togglePlay = useCallback(() => {
    setPlaying((prev) => !prev)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev)
  }, [])

  const handleProgress = useCallback(
    (state: { played: number; playedSeconds: number }) => {
      setProgress(state.played)
      if (onProgress) {
        onProgress(state.played)
      }

      // Check if video is complete (90% watched)
      if (state.played >= 0.9 && onComplete && !loop) {
        onComplete()
      }
    },
    [onProgress, onComplete, loop]
  )

  const handleDuration = useCallback((duration: number) => {
    setDuration(duration)
  }, [])

  return {
    playing,
    muted: mutedState,
    progress,
    duration,
    playerRef,
    togglePlay,
    toggleMute,
    setPlaying,
    handleProgress,
    handleDuration,
  }
}

