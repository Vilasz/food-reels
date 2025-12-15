'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import VideoPlayer from './VideoPlayer'
import VideoActions from './VideoActions'
import FoodItemCard from './FoodItemCard'
import { VideoWithRelations } from '@/lib/types'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

interface VideoFeedProps {
  videos: VideoWithRelations[]
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const y = useMotionValue(0)

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
  const navigateToVideo = useCallback((index: number) => {
    if (index < 0 || index >= videos.length || isScrolling) return
    
    setIsScrolling(true)
    setCurrentIndex(index)
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 600)
  }, [videos.length, isScrolling])

  // Prevent default scroll behavior and handle navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
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
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to avoid page scroll
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
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
  }, [currentIndex, videos.length, isScrolling, navigateToVideo])

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">No videos available</div>
      </div>
    )
  }

  const currentVideo = videos[currentIndex]
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0])

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
      {currentIndex < videos.length - 1 && !isScrolling && (
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
            ↓ Swipe up
          </motion.div>
        </motion.div>
      )}

      {/* Video counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs z-20">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  )
}

