'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export default function LikedVideosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchLikedVideos()
    }
  }, [status, router])

  const fetchLikedVideos = async () => {
    try {
      setLoading(true)
      // TODO: Implement liked videos API endpoint
      setVideos([])
    } catch (error) {
      console.error('Error fetching liked videos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="text-gray-700 text-xl">Loading liked videos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Liked Videos
          </h1>
          <p className="text-gray-600">
            Videos you've liked
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No liked videos yet</p>
          <button
            onClick={() => router.push('/feed')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Discover Videos
          </button>
        </div>
      </div>
    </div>
  )
}

