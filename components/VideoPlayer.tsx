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
  const [error, setError] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const isPhoto =
    video.contentType === 'photo' ||
    /\.(png|jpe?g|webp|gif)(\?|#|$)/i.test(video.videoUrl)

  useEffect(() => {
    if (isActive) {
      if (!isPhoto) setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [isActive, isPhoto])

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

  const handleError = () => {
    setError(true)
    console.error('Video failed to load:', video.videoUrl)
  }

  // Photo posts (for validation: images of dishes)
  if (isPhoto) {
    return (
      <div className="relative w-full h-full bg-black">
        <img
          src={video.videoUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="text-white space-y-1">
            <p className="text-lg font-semibold line-clamp-2">{video.title}</p>
            {video.description && (
              <p className="text-sm text-white/80 line-clamp-2">{video.description}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show error state if video fails to load
  if (error) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        {video.thumbnailUrl ? (
          <div className="relative w-full h-full">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <svg className="w-16 h-16 mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-semibold mb-2">Video unavailable</p>
              <p className="text-sm text-white/70 text-center">Unable to load video. Showing thumbnail instead.</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-white text-lg font-semibold mb-2">Video unavailable</p>
            <p className="text-white/70 text-sm">Unable to load video</p>
          </div>
        )}
      </div>
    )
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
          onError={handleError}
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

