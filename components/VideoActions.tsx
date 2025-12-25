'use client'

import { useState } from 'react'
import { VideoWithRelations } from '@/lib/types'
import { FiHeart, FiMessageCircle, FiShare2, FiMoreVertical } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'

interface VideoActionsProps {
  video: VideoWithRelations
}

export default function VideoActions({ video }: VideoActionsProps) {
  const [isLiked, setIsLiked] = useState(video.isLiked || false)
  const [likesCount, setLikesCount] = useState(video.likesCount)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isProcessing) return
    
    setIsProcessing(true)
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)

    try {
      const response = await fetch(`/api/videos/${video.id}/like`, {
        method: newLikedState ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newLikedState)
        setLikesCount(prev => newLikedState ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert on error
      setIsLiked(!newLikedState)
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Open comment modal
    console.log('Open comments for video:', video.id)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || video.title,
          url: `${window.location.origin}/video/${video.id}`,
        })
        
        // Track share event
        await fetch(`/api/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'share',
            videoId: video.id,
            contentType: video.contentType,
          }),
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/video/${video.id}`)
      // TODO: Show toast notification
    }
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="flex md:flex-col flex-row items-center justify-end gap-4 md:gap-6 bg-black/30 md:bg-transparent px-3 py-2 md:px-0 md:py-0 rounded-full md:rounded-none backdrop-blur-sm md:backdrop-blur-0 border border-white/5 md:border-0">
      {/* Like button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleLike}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? (
            <FaHeart className="w-6 h-6 text-red-500" />
          ) : (
            <FiHeart className="w-6 h-6 text-white" />
          )}
        </button>
        <span className="text-white text-xs mt-1 font-semibold">
          {formatCount(likesCount)}
        </span>
      </div>

      {/* Comment button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleComment}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          aria-label="Comments"
        >
          <FiMessageCircle className="w-6 h-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1 font-semibold">
          {formatCount(video.commentsCount)}
        </span>
      </div>

      {/* Share button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleShare}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          aria-label="Share"
        >
          <FiShare2 className="w-6 h-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1 font-semibold">
          {formatCount(video.sharesCount)}
        </span>
      </div>

      {/* More options */}
      <button
        className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="More options"
      >
        <FiMoreVertical className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}

