'use client'

import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { VideoWithRelations } from '@/lib/types'

interface VideoPlayerProps {
  video: VideoWithRelations
  isActive?: boolean
  onViewComplete?: () => void
}

export default function VideoPlayer({ video, isActive = true, onViewComplete }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [played, setPlayed] = useState(0)
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    if (isActive) {
      setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [isActive])

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    setPlayed(state.played)
    
    // Track view completion (90% watched)
    if (state.played >= 0.9 && onViewComplete) {
      onViewComplete()
    }
  }

  const handleClick = () => {
    setPlaying(!playing)
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMuted(!muted)
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleClick}
      >
        <ReactPlayer
          ref={playerRef}
          url={video.videoUrl}
          playing={playing}
          muted={muted}
          loop
          playsinline
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
          onProgress={handleProgress}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </div>

      {/* Play/Pause overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute toggle button */}
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${played * 100}%` }}
        />
      </div>
    </div>
  )
}

