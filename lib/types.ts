export interface VideoWithRelations {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
  likesCount: number
  commentsCount: number
  viewsCount: number
  sharesCount: number
  contentType: string
  createdAt: Date
  creator: {
    id: string
    username: string
    name: string | null
    avatar: string | null
  }
  foodItem: {
    id: string
    name: string
    description: string | null
    price: number | null
    currency: string
    imageUrl: string | null
    ifoodUrl: string | null
    storeUrl: string | null
    restaurantName: string | null
    location: string | null
    category: string | null
    tags: string[]
  } | null
  isLiked?: boolean
}

export interface FoodItemData {
  name: string
  description?: string
  price?: number
  currency?: string
  imageUrl?: string
  ifoodUrl?: string
  storeUrl?: string
  restaurantName?: string
  location?: string
  category?: string
  tags?: string[]
}

