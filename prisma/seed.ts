import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'chef@example.com' },
    update: {},
    create: {
      email: 'chef@example.com',
      username: 'chef_mario',
      name: 'Chef Mario',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef',
      bio: 'Professional chef sharing amazing recipes',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'foodie@example.com' },
    update: {},
    create: {
      email: 'foodie@example.com',
      username: 'foodie_lover',
      name: 'Foodie Lover',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie',
      bio: 'Love trying new foods!',
    },
  })

  console.log('✅ Created users')

  // Create food items
  const pizza = await prisma.foodItem.upsert({
    where: { id: 'pizza-1' },
    update: {},
    create: {
      id: 'pizza-1',
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
      price: 35.90,
      currency: 'BRL',
      category: 'Pizza',
      tags: ['pizza', 'italian', 'vegetarian'],
      restaurantName: 'Pizzaria Bella',
      location: 'São Paulo, SP',
      ifoodUrl: 'https://www.ifood.com.br/pizza-margherita',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    },
  })

  const burger = await prisma.foodItem.upsert({
    where: { id: 'burger-1' },
    update: {},
    create: {
      id: 'burger-1',
      name: 'Gourmet Burger',
      description: 'Juicy beef patty with cheddar, bacon, lettuce, and special sauce',
      price: 28.50,
      currency: 'BRL',
      category: 'Burger',
      tags: ['burger', 'beef', 'gourmet'],
      restaurantName: 'Burger House',
      location: 'Rio de Janeiro, RJ',
      ifoodUrl: 'https://www.ifood.com.br/gourmet-burger',
      storeUrl: 'https://burgerhouse.com.br/menu/gourmet-burger',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
  })

  const sushi = await prisma.foodItem.upsert({
    where: { id: 'sushi-1' },
    update: {},
    create: {
      id: 'sushi-1',
      name: 'Salmon Sashimi Set',
      description: 'Fresh salmon sashimi with rice, miso soup, and pickled vegetables',
      price: 45.00,
      currency: 'BRL',
      category: 'Japanese',
      tags: ['sushi', 'japanese', 'seafood'],
      restaurantName: 'Sushi Master',
      location: 'São Paulo, SP',
      ifoodUrl: 'https://www.ifood.com.br/salmon-sashimi',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
  })

  console.log('✅ Created food items')

  // Create videos
  const video1 = await prisma.video.create({
    data: {
      title: 'Making the Perfect Margherita Pizza',
      description: 'Watch me make this classic Italian pizza from scratch!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      duration: 120,
      creatorId: user1.id,
      foodItemId: pizza.id,
      contentType: 'video',
      likesCount: 150,
      commentsCount: 23,
      viewsCount: 1200,
      sharesCount: 45,
    },
  })

  const video2 = await prisma.video.create({
    data: {
      title: 'Gourmet Burger Recipe',
      description: 'The juiciest burger you\'ll ever make!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      duration: 180,
      creatorId: user2.id,
      foodItemId: burger.id,
      contentType: 'video',
      likesCount: 89,
      commentsCount: 12,
      viewsCount: 850,
      sharesCount: 28,
    },
  })

  const video3 = await prisma.video.create({
    data: {
      title: 'Fresh Salmon Sashimi',
      description: 'The freshest salmon sashimi in town!',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      duration: 90,
      creatorId: user1.id,
      foodItemId: sushi.id,
      contentType: 'video',
      likesCount: 234,
      commentsCount: 45,
      viewsCount: 2100,
      sharesCount: 67,
    },
  })

  console.log('✅ Created videos')

  // Create some likes
  await prisma.like.createMany({
    data: [
      { userId: user2.id, videoId: video1.id },
      { userId: user1.id, videoId: video2.id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Created likes')

  // Create some analytics events
  await prisma.analyticsEvent.createMany({
    data: [
      {
        eventType: 'view',
        videoId: video1.id,
        contentType: 'video',
      },
      {
        eventType: 'view',
        videoId: video2.id,
        contentType: 'video',
      },
      {
        eventType: 'like',
        userId: user2.id,
        videoId: video1.id,
        contentType: 'video',
      },
    ],
  })

  console.log('✅ Created analytics events')
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

