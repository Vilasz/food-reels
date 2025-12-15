'use client'

import { useEffect, useState } from 'react'
import VideoFeed from '@/components/VideoFeed'
import { VideoWithRelations } from '@/lib/types'

export default function Home() {
  const [videos, setVideos] = useState<VideoWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/videos')
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }
      
      const data = await response.json()
      // Handle paginated response
      const videosList = data.videos || data
      setVideos(videosList)
    } catch (error) {
      console.error('Error fetching videos:', error)
      setError('Failed to load videos. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="text-white text-xl">Loading videos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="text-red-400 text-xl">{error}</div>
          <button
            onClick={fetchVideos}
            className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen w-full bg-black overflow-hidden">
      <VideoFeed videos={videos} />
    </main>
  )
}

