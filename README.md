# Food Reels 🍔📹

A TikTok-like food discovery platform that connects videos to marketplaces like iFood and stores. This project validates whether videos help people decide what to eat better than photos through A/B testing.

## Features

- 🎥 **TikTok-like Video Feed**: Smooth vertical scrolling with gesture support
- 🔐 **Complete Authentication**: Email/password auth with role-based access (User & Restaurant)
- 🏪 **Restaurant Dashboard**: Full video and food item management for businesses
- 🍕 **Food Marketplace Integration**: Direct links to iFood and stores
- 👤 **User Profiles**: Customizable profiles for both users and restaurants
- 📊 **A/B Testing**: Built-in analytics to compare video vs photo effectiveness
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile-First**: Optimized for touch gestures and mobile devices
- 🔍 **Analytics Dashboard**: Track views, likes, clicks, and conversions
- 🎭 **Professional Auth Pages**: Sign in, sign up, and forgot password flows

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with JWT
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Video Player**: React Player
- **TypeScript**: Full type safety
- **Password Hashing**: bcrypt

## Project Structure

```
food-reels/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints (signup, signin, forgot-password)
│   │   ├── videos/       # Video CRUD operations (protected)
│   │   ├── analytics/    # Analytics tracking
│   │   ├── food-items/   # Food item endpoints (protected)
│   │   └── profile/      # User profile management
│   ├── auth/             # Authentication pages
│   │   ├── signin/       # Sign in page
│   │   ├── signup/       # Sign up page (user/restaurant)
│   │   ├── forgot-password/  # Password reset
│   │   └── error/        # Auth error handling
│   ├── dashboard/        # Restaurant dashboard (protected)
│   │   └── restaurant/   # Video & food management
│   ├── feed/             # Main video feed
│   ├── profile/          # User profile settings (protected)
│   ├── liked/            # Liked videos (protected)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with sidebar
│   └── page.tsx          # Home (redirects to feed)
├── components/
│   ├── Sidebar.tsx       # Navigation sidebar with auth
│   ├── VideoFeed.tsx     # Main video feed component
│   ├── VideoPlayer.tsx   # Video player with controls
│   ├── VideoActions.tsx  # Like, comment, share buttons
│   └── FoodItemCard.tsx  # Food item display with marketplace links
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── services/         # Business logic services
│   │   ├── marketplace.ts # Marketplace integration
│   │   └── analytics.ts   # Analytics tracking
│   ├── providers/        # Context providers (Session)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   ├── prisma.ts         # Prisma client
│   └── types.ts          # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema (with auth models)
│   └── migrations/       # Database migrations
└── middleware.ts         # Route protection middleware
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

Edit `.env` and add your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/foodreels"

# NextAuth (generate secret with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
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

- **User**: User accounts with authentication (email/password, role: USER/RESTAURANT/ADMIN)
- **Restaurant**: Business profiles for restaurant accounts
- **Account/Session**: NextAuth.js authentication tables
- **Video**: Video content with metadata (creator relation, engagement metrics)
- **FoodItem**: Food items with marketplace links
- **Like**: User likes on videos
- **Comment**: User comments
- **VideoView**: View tracking with watch duration
- **AnalyticsEvent**: Event tracking for A/B testing
- **Store**: Marketplace/store configurations

### User Roles

- **USER**: Regular users who watch and like videos
- **RESTAURANT**: Business accounts that can manage videos and food items
- **ADMIN**: Platform administrators (future use)

## API Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - Create new user/restaurant account
- `POST /api/auth/[...nextauth]` - NextAuth handlers (signin, signout, session)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Videos
- `GET /api/videos` - Get paginated videos (public)
- `GET /api/videos?my=true` - Get current user's videos (protected)
- `POST /api/videos` - Create a new video (protected, restaurant only)
- `GET /api/videos/[id]` - Get video by ID (public)
- `PUT /api/videos/[id]` - Update video (protected, owner only)
- `DELETE /api/videos/[id]` - Delete video (protected, owner only)
- `POST /api/videos/[id]/like` - Like a video (protected)
- `DELETE /api/videos/[id]/like` - Unlike a video (protected)

### Profile (Protected)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

### Analytics
- `POST /api/analytics` - Track an event
- `GET /api/analytics` - Get analytics data with A/B test stats

### Food Items
- `GET /api/food-items` - Get food items (with filters)
- `POST /api/food-items` - Create a food item (protected)

## Usage

### Getting Started as a User

1. **Sign Up**: Navigate to `/auth/signup` and create a user account
2. **Browse Videos**: Watch food videos in the feed
3. **Interact**: Like and comment on videos
4. **Profile**: Customize your profile at `/profile`

### Getting Started as a Restaurant

1. **Sign Up**: Navigate to `/auth/signup` and create a restaurant account
2. **Access Dashboard**: Go to `/dashboard/restaurant`
3. **Add Videos**: Click "Add New Video" to create content
4. **Manage Content**: Edit or delete your videos
5. **Profile**: Update business info at `/profile`

### Adding Videos (Restaurant Accounts)

Videos can be added through the restaurant dashboard:
1. Log in with a restaurant account
2. Navigate to the dashboard
3. Click "Add New Video"
4. Fill in video and food item details
5. Link to marketplaces (iFood, etc.)

Each video can be linked to a food item for marketplace integration.

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

- [x] User authentication with NextAuth
- [x] User profiles (both user & restaurant)
- [x] Restaurant dashboard for content management
- [x] Role-based access control
- [x] Professional auth pages
- [ ] Video upload functionality (currently uses URLs)
- [ ] Comments system (UI ready, needs backend)
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] File upload to cloud storage (S3, Cloudinary)
- [ ] Search and filters
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Real-time features (live notifications)
- [ ] Payment integration for premium features

## Documentation

- **[SETUP.md](SETUP.md)**: Complete setup guide with troubleshooting
- **[AUTHENTICATION.md](AUTHENTICATION.md)**: Detailed authentication documentation
- **[reset-database.md](reset-database.md)**: Database reset instructions

## Quick Links

- 🏠 **Feed**: `/feed` - Main video feed (public)
- 🔐 **Sign In**: `/auth/signin` - User authentication
- 📝 **Sign Up**: `/auth/signup` - Create account (user or restaurant)
- 🏪 **Dashboard**: `/dashboard/restaurant` - Restaurant management (protected)
- 👤 **Profile**: `/profile` - User settings (protected)
- ❤️ **Liked**: `/liked` - Liked videos (protected)
