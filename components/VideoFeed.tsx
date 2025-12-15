'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import VideoPlayer from './VideoPlayer'
import VideoActions from './VideoActions'
import FoodItemCard from './FoodItemCard'
import VideoNavigation from './VideoNavigation'
import VideoList from './VideoList'
import { VideoWithRelations } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { FiList, FiSearch, FiX } from 'react-icons/fi'

interface VideoFeedProps {
  videos: VideoWithRelations[]
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [showVideoList, setShowVideoList] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overlayOpen = showVideoList || showSearch

  // Track video views
  const trackView = useCallback(async (videoId: string) => {
    try {
      await fetch(`/api/videos/${videoId}`, { method: 'GET' })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }, [])

  // Handle index change
  useEffect(() => {
    if (videos[currentIndex]) {
      trackView(videos[currentIndex].id)
    }
  }, [currentIndex, videos, trackView])

  // Smooth scroll navigation
  const navigateToVideo = useCallback(
    (index: number, opts?: { force?: boolean }) => {
      const force = opts?.force ?? false
      if (index < 0 || index >= videos.length) return
      if (isScrolling && !force) return

      setIsScrolling(true)
      setCurrentIndex(index)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 450)
    },
    [videos.length, isScrolling]
  )

  // Prevent default scroll behavior and handle navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (overlayOpen) return
      e.preventDefault()
      if (isScrolling) return

      const delta = e.deltaY
      const threshold = 50

      if (Math.abs(delta) > threshold) {
        if (delta > 0 && currentIndex < videos.length - 1) {
          // Scroll down - next video
          navigateToVideo(currentIndex + 1)
        } else if (delta < 0 && currentIndex > 0) {
          // Scroll up - previous video
          navigateToVideo(currentIndex - 1)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (overlayOpen) return
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (overlayOpen) return
      // Prevent default to avoid page scroll (but keep it disabled while overlays are open)
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (overlayOpen) return
      touchEndY.current = e.changedTouches[0].clientY
      handleSwipe()
    }

    const handleSwipe = () => {
      if (isScrolling) return

      const diff = touchStartY.current - touchEndY.current
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < videos.length - 1) {
          // Swipe up - next video
          navigateToVideo(currentIndex + 1)
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe down - previous video
          navigateToVideo(currentIndex - 1)
        }
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (overlayOpen) return
      if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        e.preventDefault()
        navigateToVideo(currentIndex + 1)
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        navigateToVideo(currentIndex - 1)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentIndex, videos.length, isScrolling, navigateToVideo, overlayOpen])

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">No videos available</div>
      </div>
    )
  }

  // Filter videos based on search
  const filteredVideos = searchQuery
    ? videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.foodItem?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos

  // Find current video's position in filtered list
  const currentVideoInFiltered = filteredVideos.findIndex(v => v.id === videos[currentIndex]?.id)
  const displayIndex = currentVideoInFiltered >= 0 ? currentVideoInFiltered : 0
  const currentVideo = filteredVideos[displayIndex] || videos[currentIndex] || videos[0]

  const handlePrevious = () => {
    if (displayIndex > 0) {
      const prevVideo = filteredVideos[displayIndex - 1]
      const newIndex = videos.findIndex(v => v.id === prevVideo.id)
      if (newIndex >= 0) {
        navigateToVideo(newIndex, { force: true })
      }
    } else if (!searchQuery && currentIndex > 0) {
      // If no search, navigate normally
      navigateToVideo(currentIndex - 1, { force: true })
    }
  }

  const handleNext = () => {
    if (displayIndex < filteredVideos.length - 1) {
      const nextVideo = filteredVideos[displayIndex + 1]
      const newIndex = videos.findIndex(v => v.id === nextVideo.id)
      if (newIndex >= 0) {
        navigateToVideo(newIndex, { force: true })
      }
    } else if (!searchQuery && currentIndex < videos.length - 1) {
      // If no search, navigate normally
      navigateToVideo(currentIndex + 1, { force: true })
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{ touchAction: 'pan-y' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <VideoPlayer 
              video={currentVideo} 
              isActive={!isScrolling}
              onViewComplete={() => {
                // Track completion
                fetch('/api/analytics', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    eventType: 'view_complete',
                    videoId: currentVideo.id,
                    contentType: currentVideo.contentType,
                  }),
                }).catch(console.error)
              }}
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 z-10">
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {currentVideo.creator.avatar && (
                      <img
                        src={currentVideo.creator.avatar}
                        alt={currentVideo.creator.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <h3 className="text-white text-lg font-semibold">
                      @{currentVideo.creator.username}
                    </h3>
                  </div>
                  <p className="text-white text-sm mb-4 line-clamp-2">
                    {currentVideo.description || currentVideo.title}
                  </p>
                  {currentVideo.foodItem && (
                    <FoodItemCard foodItem={currentVideo.foodItem} />
                  )}
                </div>
                <VideoActions video={currentVideo} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Scroll indicator */}
      {(displayIndex < filteredVideos.length - 1 || (!searchQuery && currentIndex < videos.length - 1)) && !isScrolling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 text-sm pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓ Swipe up or use arrows
          </motion.div>
        </motion.div>
      )}

      {/* Top navigation bar */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-white text-xl font-bold">Food Reels</h1>
            {searchQuery && (
              <span className="text-white/60 text-sm bg-white/10 px-2 py-1 rounded">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>

        <div className="flex items-center gap-2">
          {/* Search button */}
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5 text-white" />
          </motion.button>

          {/* Video list button */}
          <motion.button
            onClick={() => setShowVideoList(true)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Show video list"
          >
            <FiList className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-4 right-4 z-30"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, food items..."
              className="w-full bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Navigation buttons */}
      <VideoNavigation
        currentIndex={displayIndex}
        totalVideos={filteredVideos.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={displayIndex > 0 || (!searchQuery && currentIndex > 0)}
        canGoNext={displayIndex < filteredVideos.length - 1 || (!searchQuery && currentIndex < videos.length - 1)}
      />

      {/* Video list panel */}
      <VideoList
        videos={videos}
        currentIndex={currentIndex}
        onSelectVideo={(index) => navigateToVideo(index, { force: true })}
        isOpen={showVideoList}
        onClose={() => setShowVideoList(false)}
      />
    </div>
  )
}

