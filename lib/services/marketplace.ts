/**
 * Marketplace Integration Service
 * Handles integration with external marketplaces like iFood, stores, etc.
 */

export interface MarketplaceConfig {
  name: string
  type: 'ifood' | 'restaurant' | 'marketplace' | 'custom'
  apiEndpoint?: string
  apiKey?: string
  config?: Record<string, any>
}

export interface MarketplaceLink {
  url: string
  marketplace: string
  label: string
  icon?: string
}

/**
 * Generate marketplace link with tracking parameters
 */
export function generateMarketplaceLink(
  baseUrl: string,
  marketplace: string,
  foodItemId: string,
  videoId?: string
): string {
  const url = new URL(baseUrl)
  
  // Add tracking parameters
  url.searchParams.set('source', 'food-reels')
  url.searchParams.set('food_item_id', foodItemId)
  
  if (videoId) {
    url.searchParams.set('video_id', videoId)
  }
  
  // Add marketplace-specific parameters
  switch (marketplace) {
    case 'ifood':
      url.searchParams.set('utm_source', 'food-reels')
      url.searchParams.set('utm_medium', 'video')
      break
    case 'store':
      url.searchParams.set('ref', 'food-reels')
      break
  }
  
  return url.toString()
}

/**
 * Track marketplace click for analytics
 */
export async function trackMarketplaceClick(
  foodItemId: string,
  marketplace: string,
  videoId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'click_food_link',
        foodItemId,
        videoId,
        source: marketplace,
        metadata: {
          ...metadata,
          timestamp: Date.now(),
        },
      }),
    })
  } catch (error) {
    console.error('Error tracking marketplace click:', error)
  }
}

/**
 * Get available marketplaces for a food item
 */
export function getAvailableMarketplaces(foodItem: {
  ifoodUrl?: string | null
  storeUrl?: string | null
  otherMarketplaceUrls?: any
}): MarketplaceLink[] {
  const marketplaces: MarketplaceLink[] = []

  if (foodItem.ifoodUrl) {
    marketplaces.push({
      url: foodItem.ifoodUrl,
      marketplace: 'ifood',
      label: 'Order on iFood',
      icon: '🍔',
    })
  }

  if (foodItem.storeUrl) {
    marketplaces.push({
      url: foodItem.storeUrl,
      marketplace: 'store',
      label: 'View Store',
      icon: '🛒',
    })
  }

  // Handle other marketplaces from JSON
  if (foodItem.otherMarketplaceUrls && typeof foodItem.otherMarketplaceUrls === 'object') {
    const other = foodItem.otherMarketplaceUrls as Record<string, string>
    Object.entries(other).forEach(([name, url]) => {
      marketplaces.push({
        url,
        marketplace: name,
        label: `View on ${name}`,
      })
    })
  }

  return marketplaces
}

