/**
 * Marketplace constants and configuration
 */

export const MARKETPLACES = {
  IFOOD: 'ifood',
  STORE: 'store',
  RESTAURANT: 'restaurant',
  CUSTOM: 'custom',
} as const

export type MarketplaceType = typeof MARKETPLACES[keyof typeof MARKETPLACES]

export const MARKETPLACE_CONFIG = {
  [MARKETPLACES.IFOOD]: {
    name: 'iFood',
    color: '#EA1D2C',
    icon: '🍔',
  },
  [MARKETPLACES.STORE]: {
    name: 'Store',
    color: '#0066CC',
    icon: '🛒',
  },
  [MARKETPLACES.RESTAURANT]: {
    name: 'Restaurant',
    color: '#FF6B35',
    icon: '🍽️',
  },
} as const

