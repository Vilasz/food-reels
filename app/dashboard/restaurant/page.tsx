'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiExternalLink, FiVideo } from 'react-icons/fi'

interface Video {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  viewsCount: number
  likesCount: number
  createdAt: string
  foodItem?: {
    id: string
    name: string
    price?: number
    ifoodUrl?: string
    storeUrl?: string
  }
}

export default function RestaurantDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user?.role !== 'RESTAURANT') {
      router.push('/feed')
    } else if (status === 'authenticated') {
      fetchMyVideos()
    }
  }, [status, session, router])

  const fetchMyVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/videos?my=true')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVideos(videos.filter(v => v.id !== videoId))
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <div className="text-gray-700 text-xl">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your videos and food items
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Videos</p>
                <p className="text-3xl font-bold text-gray-900">{videos.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiVideo className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {videos.reduce((sum, v) => sum + v.viewsCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiExternalLink className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {videos.reduce((sum, v) => sum + v.likesCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiPlus className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Video Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/restaurant/add-video')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New Video</span>
          </button>
        </div>

        {/* Videos List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Videos</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {videos.length === 0 ? (
              <div className="p-12 text-center">
                <FiVideo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No videos yet</p>
                <button
                  onClick={() => router.push('/dashboard/restaurant/add-video')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Your First Video</span>
                </button>
              </div>
            ) : (
              videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      {/* Thumbnail */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiVideo className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        {video.foodItem && (
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                              {video.foodItem.name}
                              {video.foodItem.price && ` - R$ ${video.foodItem.price}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{video.viewsCount} views</span>
                          <span>{video.likesCount} likes</span>
                          <span>
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/dashboard/restaurant/edit-video/${video.id}`)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

