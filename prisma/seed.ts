import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Donburizin chef user
  const donburizinChef = await prisma.user.upsert({
    where: { email: 'chef@donburizin.com' },
    update: {},
    create: {
      email: 'chef@donburizin.com',
      username: 'donburizin_oficial',
      name: 'Donburizin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=donburizin',
      bio: 'Culinária japonesa autêntica 🍣 | Peça já pelo nosso app!',
    },
  })

  console.log('✅ Created users')

  // Create food items for Donburizin
  const tunaSando = await prisma.foodItem.upsert({
    where: { id: 'tuna-sando-1' },
    update: {},
    create: {
      id: 'tuna-sando-1',
      name: 'Tuna Sando',
      description: 'Delicioso sanduíche de atum com ingredientes frescos e molho especial. Uma experiência única da culinária japonesa moderna!',
      price: null, // Preço pode variar, consulte no link
      currency: 'BRL',
      category: 'Japanese',
      tags: ['sando', 'tuna', 'japanese', 'donburizin'],
      restaurantName: 'Donburizin',
      location: 'São Paulo, SP',
      storeUrl: 'https://pedido.anota.ai/product/68a7837672a924a4a93bab41/0/donburizin',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
  })

  const spicySalmao = await prisma.foodItem.upsert({
    where: { id: 'spicy-salmao-1' },
    update: {},
    create: {
      id: 'spicy-salmao-1',
      name: 'Spicy Salmão (6 pcs.)',
      description: 'Seis peças de salmão temperado com molho picante especial. Perfeito para quem adora sabores intensos!',
      price: null,
      currency: 'BRL',
      category: 'Japanese',
      tags: ['sushi', 'salmon', 'spicy', 'japanese', 'donburizin'],
      restaurantName: 'Donburizin',
      location: 'São Paulo, SP',
      storeUrl: 'https://pedido.anota.ai/product/68af6c731368a56a54cf6f24/0/donburizin',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
  })

  const guiozaPorco = await prisma.foodItem.upsert({
    where: { id: 'guioza-porco-1' },
    update: {},
    create: {
      id: 'guioza-porco-1',
      name: 'Guioza de Porco (4 unidades)',
      description: 'Quatro unidades de guioza crocante recheado com porco temperado. Um clássico irresistível da culinária japonesa!',
      price: null,
      currency: 'BRL',
      category: 'Japanese',
      tags: ['gyoza', 'pork', 'japanese', 'donburizin', 'appetizer'],
      restaurantName: 'Donburizin',
      location: 'São Paulo, SP',
      storeUrl: 'https://pedido.anota.ai/product/689cf8b8d239d61ecc8c5283/0/donburizin',
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
    },
  })

  console.log('✅ Created food items')

  // Clear existing videos
  await prisma.video.deleteMany({})
  console.log('🧹 Cleared existing videos')

  // Create videos with real content from Donburizin
  const videoTuna = await prisma.video.create({
    data: {
      title: 'Confira Tuna Sando de Donburizin',
      description: 'Tuna Sando irresistível! 🍣 Peça agora e experimente o melhor da culinária japonesa 🥢',
      videoUrl: '/videos/Tuna.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      duration: 30, // Ajuste conforme duração real
      creatorId: donburizinChef.id,
      foodItemId: tunaSando.id,
      contentType: 'video',
      likesCount: 342,
      commentsCount: 67,
      viewsCount: 4520,
      sharesCount: 128,
    },
  })

  const videoSalmao = await prisma.video.create({
    data: {
      title: 'Confira Spicy Salmão (6 pcs.) de Donburizin',
      description: 'Spicy Salmão fresquinho! 🌶️🍣 6 peças de pura delícia! Peça já no nosso app 🔥',
      videoUrl: '/videos/Salmao.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      duration: 25,
      creatorId: donburizinChef.id,
      foodItemId: spicySalmao.id,
      contentType: 'video',
      likesCount: 528,
      commentsCount: 94,
      viewsCount: 6830,
      sharesCount: 201,
    },
  })

  const videoGuioza = await prisma.video.create({
    data: {
      title: 'Confira Guioza de Porco (4 unidades) de Donburizin',
      description: 'Guioza crocante de porco! 🥟 4 unidades perfeitas para começar sua refeição! 😋',
      videoUrl: '/videos/Guioza.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
      duration: 20,
      creatorId: donburizinChef.id,
      foodItemId: guiozaPorco.id,
      contentType: 'video',
      likesCount: 419,
      commentsCount: 82,
      viewsCount: 5240,
      sharesCount: 156,
    },
  })

  console.log('✅ Created videos')

  // Create some likes from the chef
  await prisma.like.createMany({
    data: [
      { userId: donburizinChef.id, videoId: videoSalmao.id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Created likes')

  // Create some analytics events
  await prisma.analyticsEvent.createMany({
    data: [
      {
        eventType: 'view',
        videoId: videoTuna.id,
        contentType: 'video',
        userId: donburizinChef.id,
      },
      {
        eventType: 'view',
        videoId: videoSalmao.id,
        contentType: 'video',
        userId: donburizinChef.id,
      },
      {
        eventType: 'view',
        videoId: videoGuioza.id,
        contentType: 'video',
        userId: donburizinChef.id,
      },
      {
        eventType: 'like',
        userId: donburizinChef.id,
        videoId: videoSalmao.id,
        contentType: 'video',
      },
    ],
  })

  console.log('✅ Created analytics events')
  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('📹 Vídeos do Donburizin carregados:')
  console.log('   1. Tuna Sando')
  console.log('   2. Spicy Salmão (6 pcs.)')
  console.log('   3. Guioza de Porco (4 unidades)')
  console.log('')
  console.log('🔗 Todos os links do pedido.anota.ai estão configurados!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

