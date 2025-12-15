'use client'

import { VideoWithRelations } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlay } from 'react-icons/fi'

interface VideoListProps {
  videos: VideoWithRelations[]
  currentIndex: number
  onSelectVideo: (index: number) => void
  isOpen: boolean
  onClose: () => void
}

export default function VideoList({
  videos,
  currentIndex,
  onSelectVideo,
  isOpen,
  onClose,
}: VideoListProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Video list panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onWheelCapture={(e) => e.stopPropagation()}
            onTouchMoveCapture={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl z-50 overflow-y-auto overscroll-contain"
          >
            <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between z-10">
              <h2 className="text-white text-xl font-bold">All Videos</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 pb-24 space-y-3">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectVideo(index)
                    onClose()
                  }}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                    index === currentIndex
                      ? 'ring-2 ring-white'
                      : 'hover:ring-2 ring-white/50'
                  }`}
                >
                  <div className="relative aspect-video bg-gray-900">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <FiPlay className="w-12 h-12 text-white/30" />
                      </div>
                    )}

                    {/* Current video indicator */}
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <FiPlay className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Video number */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
                      #{index + 1}
                    </div>

                    {/* Duration */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                        {Math.floor(video.duration / 60)}:
                        {(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-gray-900/50">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-white/60 text-xs line-clamp-2">
                      {video.description || video.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                      <span>👁️ {video.viewsCount}</span>
                      <span>❤️ {video.likesCount}</span>
                      {video.foodItem && (
                        <span className="text-green-400">🍔 {video.foodItem.name}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

