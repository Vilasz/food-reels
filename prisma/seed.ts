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

  // Create more food items
  const pasta = await prisma.foodItem.upsert({
    where: { id: 'pasta-1' },
    update: {},
    create: {
      id: 'pasta-1',
      name: 'Carbonara Pasta',
      description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
      price: 32.00,
      currency: 'BRL',
      category: 'Italian',
      tags: ['pasta', 'italian', 'creamy'],
      restaurantName: 'Trattoria Roma',
      location: 'São Paulo, SP',
      ifoodUrl: 'https://www.ifood.com.br/carbonara',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    },
  })

  const tacos = await prisma.foodItem.upsert({
    where: { id: 'tacos-1' },
    update: {},
    create: {
      id: 'tacos-1',
      name: 'Beef Tacos',
      description: 'Authentic Mexican tacos with seasoned beef, onions, and cilantro',
      price: 18.90,
      currency: 'BRL',
      category: 'Mexican',
      tags: ['tacos', 'mexican', 'beef'],
      restaurantName: 'Taco Loco',
      location: 'Rio de Janeiro, RJ',
      ifoodUrl: 'https://www.ifood.com.br/beef-tacos',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38174c3d16f8?w=400',
    },
  })

  // Delete existing videos to avoid unique constraint conflicts
  // (since foodItemId is unique, we need to clear existing videos first)
  await prisma.video.deleteMany({})
  console.log('🧹 Cleared existing videos')

  // Create POSTS with food-related content (photos of dishes)
  // This matches the validation goal: photos vs videos (A/B test)
  // Here we seed with photos (contentType: 'photo') using high-quality dish images.
  const video1 = await prisma.video.create({
    data: {
      title: 'Making the Perfect Margherita Pizza',
      description: 'Pizza Margherita com mozzarella e manjericão 🍕',
      videoUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1080&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      duration: null,
      creatorId: user1.id,
      foodItemId: pizza.id,
      contentType: 'photo',
      likesCount: 150,
      commentsCount: 23,
      viewsCount: 1200,
      sharesCount: 45,
    },
  })

  const video2 = await prisma.video.create({
    data: {
      title: 'Gourmet Burger Recipe',
      description: 'Hambúrguer artesanal suculento 🍔',
      videoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1080&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      duration: null,
      creatorId: user2.id,
      foodItemId: burger.id,
      contentType: 'photo',
      likesCount: 89,
      commentsCount: 12,
      viewsCount: 850,
      sharesCount: 28,
    },
  })

  const video3 = await prisma.video.create({
    data: {
      title: 'Fresh Salmon Sashimi',
      description: 'Sashimi de salmão fresquinho 🍣',
      videoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1080&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      duration: null,
      creatorId: user1.id,
      foodItemId: sushi.id,
      contentType: 'photo',
      likesCount: 234,
      commentsCount: 45,
      viewsCount: 2100,
      sharesCount: 67,
    },
  })

  const video4 = await prisma.video.create({
    data: {
      title: 'Creamy Carbonara Pasta',
      description: 'Carbonara cremosa (estilo italiano) 🍝',
      videoUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1080&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
      duration: null,
      creatorId: user1.id,
      foodItemId: pasta.id,
      contentType: 'photo',
      likesCount: 312,
      commentsCount: 67,
      viewsCount: 3400,
      sharesCount: 89,
    },
  })

  const video5 = await prisma.video.create({
    data: {
      title: 'Authentic Mexican Tacos',
      description: 'Tacos de carne com ingredientes frescos 🌮',
      videoUrl: 'https://images.unsplash.com/photo-1565299585323-38174c3d16f8?auto=format&fit=crop&w=1080&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1565299585323-38174c3d16f8?w=800',
      duration: null,
      creatorId: user2.id,
      foodItemId: tacos.id,
      contentType: 'photo',
      likesCount: 178,
      commentsCount: 34,
      viewsCount: 1650,
      sharesCount: 52,
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

