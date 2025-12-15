# Food Reels 🍔📹

A TikTok-like food discovery platform that connects videos to marketplaces like iFood and stores. This project validates whether videos help people decide what to eat better than photos through A/B testing.

## Features

- 🎥 **TikTok-like Video Feed**: Smooth vertical scrolling with gesture support
- 🍕 **Food Marketplace Integration**: Direct links to iFood and stores
- 📊 **A/B Testing**: Built-in analytics to compare video vs photo effectiveness
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile-First**: Optimized for touch gestures and mobile devices
- 🔍 **Analytics Dashboard**: Track views, likes, clicks, and conversions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Video Player**: React Player
- **TypeScript**: Full type safety

## Project Structure

```
food-reels/
├── app/
│   ├── api/              # API routes
│   │   ├── videos/       # Video endpoints
│   │   ├── analytics/    # Analytics tracking
│   │   └── food-items/   # Food item endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── VideoFeed.tsx     # Main video feed component
│   ├── VideoPlayer.tsx   # Video player with controls
│   ├── VideoActions.tsx  # Like, comment, share buttons
│   └── FoodItemCard.tsx  # Food item display with marketplace links
├── lib/
│   ├── services/         # Business logic services
│   │   ├── marketplace.ts # Marketplace integration
│   │   └── analytics.ts   # Analytics tracking
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   ├── prisma.ts         # Prisma client
│   └── types.ts          # TypeScript types
└── prisma/
    └── schema.prisma     # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-reels
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/foodreels"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The database includes models for:

- **User**: User accounts and profiles
- **Video**: Video content with metadata
- **FoodItem**: Food items with marketplace links
- **Like**: User likes on videos
- **Comment**: User comments
- **VideoView**: View tracking with watch duration
- **AnalyticsEvent**: Event tracking for A/B testing
- **Store**: Marketplace/store configurations

## API Endpoints

### Videos
- `GET /api/videos` - Get paginated videos
- `POST /api/videos` - Create a new video
- `GET /api/videos/[id]` - Get video by ID
- `POST /api/videos/[id]/like` - Like a video
- `DELETE /api/videos/[id]/like` - Unlike a video

### Analytics
- `POST /api/analytics` - Track an event
- `GET /api/analytics` - Get analytics data with A/B test stats

### Food Items
- `GET /api/food-items` - Get food items (with filters)
- `POST /api/food-items` - Create a food item

## Usage

### Adding Videos

Videos can be added via the API or directly in the database. Each video can be linked to a food item for marketplace integration.

### A/B Testing

The platform tracks whether content is a "video" or "photo" to compare effectiveness. Analytics events automatically include the `contentType` field for analysis.

### Marketplace Integration

Food items can have links to:
- iFood (via `ifoodUrl`)
- Store websites (via `storeUrl`)
- Other marketplaces (via `otherMarketplaceUrls` JSON field)

All marketplace clicks are tracked for analytics.

## Development

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Code Structure

The project follows a scalable architecture:

- **Services**: Business logic and external integrations
- **Components**: Reusable UI components
- **API Routes**: Server-side endpoints
- **Hooks**: Custom React hooks for state management
- **Utils**: Helper functions

## Analytics & A/B Testing

The platform automatically tracks:
- Video views and completion rates
- Likes, comments, and shares
- Marketplace link clicks
- User engagement metrics

Compare video vs photo effectiveness using the analytics API:
```typescript
const stats = await getABTestStats()
// Returns conversion rates for videos vs photos
```

## Deployment

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Public app URL (for sharing)

### Build

```bash
npm run build
npm start
```

### Video Storage

For production, configure video storage:
- AWS S3
- Cloudinary
- Vercel Blob Storage

Update the `videoUrl` field to point to your storage provider.

## Roadmap

- [ ] User authentication
- [ ] Video upload functionality
- [ ] Comments system
- [ ] User profiles
- [ ] Search and filters
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
