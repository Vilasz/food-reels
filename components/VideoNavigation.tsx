'use client'

import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface VideoNavigationProps {
  currentIndex: number
  totalVideos: number
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export default function VideoNavigation({
  currentIndex,
  totalVideos,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: VideoNavigationProps) {
  return (
    <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-3">
      {/* Previous button */}
      <motion.button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
          canGoPrevious
            ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
            : 'bg-white/5 text-white/30 cursor-not-allowed'
        }`}
        whileHover={canGoPrevious ? { scale: 1.1 } : {}}
        whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        aria-label="Previous video"
      >
        <FiChevronUp className="w-6 h-6" />
      </motion.button>

      {/* Video counter */}
      <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full text-white text-xs text-center min-w-[50px]">
        {currentIndex + 1}/{totalVideos}
      </div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={!canGoNext}
        className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
          canGoNext
            ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
            : 'bg-white/5 text-white/30 cursor-not-allowed'
        }`}
        whileHover={canGoNext ? { scale: 1.1 } : {}}
        whileTap={canGoNext ? { scale: 0.95 } : {}}
        aria-label="Next video"
      >
        <FiChevronDown className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

