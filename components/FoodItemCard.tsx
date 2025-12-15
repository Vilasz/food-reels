'use client'

import { useState } from 'react'
import { VideoWithRelations } from '@/lib/types'
import { FiExternalLink, FiShoppingBag, FiMapPin } from 'react-icons/fi'

interface FoodItemCardProps {
  foodItem: VideoWithRelations['foodItem']
}

export default function FoodItemCard({ foodItem }: FoodItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!foodItem) return null

  const handleMarketplaceClick = async (url: string, marketplace: string) => {
    // Track click event for analytics
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'click_food_link',
          foodItemId: foodItem.id,
          source: marketplace,
          metadata: {
            marketplace,
            timestamp: Date.now(),
          },
        }),
      })
    } catch (error) {
      console.error('Error tracking analytics:', error)
    }

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return null
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price)
  }

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 mt-4 border border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg mb-1">{foodItem.name}</h4>
          
          {foodItem.description && (
            <p className={`text-white/80 text-sm ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {foodItem.description}
            </p>
          )}

          {foodItem.description && foodItem.description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/60 text-xs mt-1 hover:text-white transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {foodItem.price && (
              <span className="text-green-400 font-bold text-lg">
                {formatPrice(foodItem.price, foodItem.currency)}
              </span>
            )}
            
            {foodItem.restaurantName && (
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <FiMapPin className="w-4 h-4" />
                <span>{foodItem.restaurantName}</span>
              </div>
            )}
          </div>

          {foodItem.tags && foodItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {foodItem.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded-full text-white/80 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {foodItem.imageUrl && (
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={foodItem.imageUrl}
              alt={foodItem.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Marketplace links */}
      <div className="flex gap-2 mt-4">
        {foodItem.ifoodUrl && (
          <button
            onClick={() => handleMarketplaceClick(foodItem.ifoodUrl!, 'ifood')}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Order on iFood</span>
            <FiExternalLink className="w-3 h-3" />
          </button>
        )}

        {foodItem.storeUrl && (
          <button
            onClick={() => handleMarketplaceClick(foodItem.storeUrl!, 'store')}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>View Store</span>
            <FiExternalLink className="w-3 h-3" />
          </button>
        )}

        {!foodItem.ifoodUrl && !foodItem.storeUrl && (
          <div className="w-full text-center text-white/60 text-sm py-2">
            No marketplace links available
          </div>
        )}
      </div>
    </div>
  )
}

