'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'

export default function AddVideoPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    foodItemName: '',
    foodItemPrice: '',
    foodItemDescription: '',
    ifoodUrl: '',
    storeUrl: '',
    category: '',
  })

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file')
      return
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Video file must be less than 100MB')
      return
    }

    setVideoFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setVideoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadVideo = async () => {
    if (!videoFile) return null

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('video', videoFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      setUploadProgress(100)
      return data.url
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate video file
    if (!videoFile && !formData.videoUrl) {
      setError('Please select a video file to upload')
      return
    }

    setLoading(true)

    try {
      // Upload video if file is selected
      let videoUrl = formData.videoUrl
      if (videoFile) {
        videoUrl = await uploadVideo()
        if (!videoUrl) {
          throw new Error('Failed to upload video')
        }
      }

      // Create food item first
      const foodItemResponse = await fetch('/api/food-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.foodItemName,
          description: formData.foodItemDescription,
          price: formData.foodItemPrice ? parseFloat(formData.foodItemPrice) : undefined,
          ifoodUrl: formData.ifoodUrl || undefined,
          storeUrl: formData.storeUrl || undefined,
          category: formData.category || undefined,
          restaurantName: session?.user?.restaurant?.businessName || session?.user?.name,
        }),
      })

      if (!foodItemResponse.ok) {
        throw new Error('Failed to create food item')
      }

      const foodItem = await foodItemResponse.json()

      // Create video
      const videoResponse = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          videoUrl: videoUrl,
          foodItemId: foodItem.id,
        }),
      })

      if (!videoResponse.ok) {
        throw new Error('Failed to create video')
      }

      router.push('/dashboard/restaurant')
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Video
          </h1>
          <p className="text-gray-600">
            Share your food creations with the world
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Video
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {videoPreview ? (
                        <div className="mb-4">
                          <video
                            src={videoPreview}
                            controls
                            className="mx-auto h-40 rounded-lg"
                          />
                          <p className="mt-2 text-sm text-gray-600">
                            {videoFile?.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoFile(null)
                              setVideoPreview(null)
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Remove video
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="video-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                            >
                              <span>Upload a video</span>
                              <input
                                id="video-upload"
                                name="video-upload"
                                type="file"
                                accept="video/*"
                                className="sr-only"
                                onChange={handleVideoChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            MP4, MOV, AVI up to 100MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {uploading && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Delicious Salmon Sushi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us about your dish..."
                  />
                </div>
              </div>
            </div>

            {/* Food Item Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Food Item Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.foodItemName}
                    onChange={(e) => setFormData({ ...formData, foodItemName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Salmon Sushi Roll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Description
                  </label>
                  <textarea
                    value={formData.foodItemDescription}
                    onChange={(e) => setFormData({ ...formData, foodItemDescription: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe the dish..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.foodItemPrice}
                      onChange={(e) => setFormData({ ...formData, foodItemPrice: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="29.90"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Japanese"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    iFood URL
                  </label>
                  <input
                    type="url"
                    value={formData.ifoodUrl}
                    onChange={(e) => setFormData({ ...formData, ifoodUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://www.ifood.com.br/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store/Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : loading ? 'Creating...' : 'Create Video'}
            </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

