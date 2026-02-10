# Food Reels - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Neon, Supabase)
- npm or yarn package manager

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/food_reels"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Apply database migrations
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the feed page!

## First Time Setup

### Create Your First Account

1. **Navigate to Sign Up**
   - Click the menu icon (☰) in the top-left
   - Click "Sign Up"

2. **Choose Account Type**
   - **User Account**: For discovering and watching food videos
   - **Restaurant Account**: For businesses showcasing their menu

3. **For Restaurant Account:**
   - Enter email and username
   - Choose a strong password
   - Enter your business name
   - Add a description (optional)
   - Click "Create Account"

4. **After Signup:**
   - You'll be automatically signed in
   - Restaurants are redirected to the Dashboard
   - Users are redirected to the Feed

### Add Your First Video (Restaurant Account)

1. **Access Dashboard**
   - Click "Dashboard" in the sidebar

2. **Add New Video**
   - Click "Add New Video" button
   - Fill in video information:
     - **Title**: "Delicious Salmon Sushi"
     - **Description**: "Fresh salmon with wasabi and soy sauce"
     - **Video URL**: `/videos/Salmao.mp4` (or your video path)
     - **Thumbnail URL**: (optional)

3. **Add Food Item Details**
   - **Food Item Name**: "Salmon Nigiri"
   - **Description**: "Premium fresh salmon"
   - **Price**: 29.90
   - **Category**: "Japanese"
   - **iFood URL**: (optional) Your iFood link
   - **Store URL**: (optional) Your website

4. **Save**
   - Click "Create Video"
   - Your video will now appear in the feed!

## Project Structure

```
food-reels/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── videos/       # Video CRUD operations
│   │   ├── food-items/   # Food item management
│   │   └── profile/      # User profile management
│   ├── auth/             # Authentication pages
│   │   ├── signin/       # Sign in page
│   │   ├── signup/       # Sign up page
│   │   └── forgot-password/  # Password reset
│   ├── dashboard/        # Restaurant dashboard
│   │   └── restaurant/   # Restaurant management
│   ├── feed/             # Main video feed
│   ├── profile/          # User profile settings
│   └── liked/            # Liked videos
├── components/           # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── VideoFeed.tsx     # Video feed component
│   ├── VideoPlayer.tsx   # Video player
│   └── ...
├── lib/                  # Utilities and configs
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── providers/        # Context providers
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── public/
    └── videos/           # Sample video files
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Create and apply migrations
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database with sample data

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Features Overview

### 🔐 Authentication System
- Email/password authentication
- Role-based access (User, Restaurant, Admin)
- Password reset functionality
- Secure JWT sessions
- Protected routes

### 👤 User Accounts
- Browse video feed
- Like and interact with content
- Create personal videos
- Customize profile
- Track liked videos

### 🏪 Restaurant Accounts
- Full video management dashboard
- Add/edit/delete videos
- Manage food items
- Link to marketplaces (iFood, etc.)
- View engagement analytics
- Professional business profile

### 📹 Video Management
- TikTok-style vertical video feed
- Video player with controls
- Like and comment system
- Food item integration
- Marketplace links

### 🎨 UI/UX
- Modern, responsive design
- Smooth animations (Framer Motion)
- Mobile-friendly sidebar
- Professional authentication pages
- Intuitive dashboard

## Database Schema

### Key Models

**User**
- Basic info (email, username, name)
- Password (hashed with bcrypt)
- Role (USER, RESTAURANT, ADMIN)
- Authentication tokens

**Restaurant**
- Business information
- Contact details
- Cuisine types
- Marketplace links
- Verification status

**Video**
- Title, description
- Video URL and thumbnail
- Creator relation
- Engagement metrics
- Food item relation

**FoodItem**
- Product details
- Pricing information
- Marketplace URLs
- Categories and tags
- Restaurant info

## Common Issues & Solutions

### Database Connection Issues

**Problem**: Can't connect to database
```bash
Error: P1001: Can't reach database server
```

**Solution**:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Test connection: `npx prisma db pull`

### Authentication Errors

**Problem**: "NEXTAUTH_SECRET" is not set
```bash
Error: NEXTAUTH_SECRET missing
```

**Solution**:
1. Generate secret: `openssl rand -base64 32`
2. Add to `.env`: `NEXTAUTH_SECRET="generated-secret"`
3. Restart dev server

### Migration Issues

**Problem**: Schema out of sync
```bash
Error: Schema out of sync with database
```

**Solution**:
```bash
# Reset and resync (WARNING: loses data)
npx prisma migrate reset

# Or push without migration
npx prisma db push
```

### Video Not Playing

**Problem**: Video shows but doesn't play

**Solution**:
1. Check video file exists in `public/videos/`
2. Verify video URL is correct (e.g., `/videos/Salmao.mp4`)
3. Ensure video format is supported (MP4 recommended)
4. Check browser console for errors

## Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Recommended Hosting

- **Frontend**: Vercel, Netlify
- **Database**: Neon, Supabase, Railway
- **Videos**: AWS S3, Cloudinary, Vercel Blob

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Deploy database**
   ```bash
   npx prisma migrate deploy
   ```

4. **Deploy application**
   - Push to Git
   - Connect to Vercel/Netlify
   - Auto-deploy on push

## Next Steps

After setup, you can:

1. **Customize Branding**
   - Update colors in `tailwind.config.js`
   - Change logo in `components/Sidebar.tsx`
   - Modify metadata in `app/layout.tsx`

2. **Add Features**
   - Implement file uploads
   - Add social login (Google, Facebook)
   - Create analytics dashboard
   - Add real-time notifications

3. **Enhance Security**
   - Add email verification
   - Implement rate limiting
   - Add 2FA authentication
   - Set up CORS properly

4. **Optimize Performance**
   - Add CDN for videos
   - Implement lazy loading
   - Add caching layer
   - Optimize images

## Support

- Check `AUTHENTICATION.md` for detailed auth documentation
- Review `README.md` for project overview
- Check `reset-database.md` for database reset instructions

## Troubleshooting

Still having issues? Try:

1. **Clear and reinstall**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Reset database**
   ```bash
   npx prisma migrate reset
   npx prisma db push
   ```

3. **Check all environment variables**
   ```bash
   cat .env
   ```

4. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

Happy coding! 🚀

