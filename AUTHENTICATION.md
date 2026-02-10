# Authentication & User Management Guide

## Overview

The Food Reels platform now includes a comprehensive authentication system with role-based access control, supporting both regular users and restaurant accounts.

## Features

### Authentication
- ✅ Professional login/signup pages
- ✅ Forgot password functionality
- ✅ JWT-based session management (NextAuth.js)
- ✅ Password hashing with bcrypt
- ✅ Email-based authentication

### User Roles

#### 1. User Account
Regular users who can:
- Browse and watch food videos
- Like and comment on videos
- Create their own video content
- Customize their profile
- Track liked videos

#### 2. Restaurant Account
Business accounts that can:
- Manage video content
- Add/edit/delete food items
- Link to iFood and other marketplaces
- View analytics dashboard
- Manage restaurant profile
- Track engagement metrics

## Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/food_reels"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="development"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Database Migration

Run the following commands to set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database with sample data
npm run db:seed
```

### 3. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## User Flows

### New User Registration

1. Click "Sign In" in the sidebar
2. Click "Sign up" 
3. Choose account type:
   - **User**: For regular users who want to discover food
   - **Restaurant**: For businesses showcasing their menu
4. Fill in required information
5. After signup, automatically redirected to:
   - Users → `/feed` (main video feed)
   - Restaurants → `/dashboard/restaurant` (management dashboard)

### Sign In

1. Click "Sign In" in the sidebar
2. Enter email and password
3. Redirected to appropriate page based on role

### Forgot Password

1. Click "Forgot password?" on sign in page
2. Enter your email
3. Check email for reset instructions
4. Follow link to reset password

## Protected Routes

The following routes require authentication:

- `/dashboard/*` - Restaurant dashboard and management
- `/profile/*` - User profile settings
- `/liked` - Liked videos (user accounts)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Protected APIs

All video and food item creation/modification endpoints require authentication:

- `POST /api/videos` - Create video (requires auth)
- `PUT /api/videos/[id]` - Update video (owner only)
- `DELETE /api/videos/[id]` - Delete video (owner only)
- `POST /api/food-items` - Create food item (requires auth)
- `PUT /api/profile` - Update profile (requires auth)

## Restaurant Dashboard

### Features

1. **Overview Stats**
   - Total videos
   - Total views
   - Total likes

2. **Video Management**
   - Add new videos with food items
   - Edit existing videos
   - Delete videos
   - Link to marketplaces (iFood, etc.)

3. **Profile Management**
   - Business information
   - Contact details
   - Cuisine type
   - Social media links

### Adding a New Video

1. Navigate to Restaurant Dashboard
2. Click "Add New Video"
3. Fill in video information:
   - Title and description
   - Video URL (path to video file)
   - Thumbnail (optional)
4. Add food item details:
   - Name and description
   - Price
   - Category
   - Marketplace links (iFood, website)
5. Click "Create Video"

## User Profile

Both account types can customize their profiles:

### User Profile
- Display name
- Username
- Bio
- Avatar

### Restaurant Profile
- Business name
- Description
- Address and contact info
- Website
- Cuisine type
- iFood integration

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT session tokens
- ✅ CSRF protection
- ✅ Route protection with middleware
- ✅ Owner-only actions for content
- ✅ Reset token expiration (1 hour)

## Navigation

The sidebar provides context-aware navigation based on user role:

### User Navigation
- Feed
- Liked Videos
- Profile
- Sign Out

### Restaurant Navigation
- Feed
- Dashboard
- Analytics
- Profile
- Sign Out

### Guest Navigation
- Feed
- Sign In
- Sign Up

## Troubleshooting

### Common Issues

**"Unauthorized" errors**
- Ensure you're signed in
- Check that your session hasn't expired
- Try signing out and back in

**Can't create videos**
- Verify you have a restaurant account
- Check that all required fields are filled
- Ensure video URL is accessible

**Database errors**
- Run `npm run db:migrate` to apply latest migrations
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running

## Next Steps

To further enhance the platform:

1. **Email Integration**: Set up email service (SendGrid, etc.) for password resets
2. **File Upload**: Implement video/image upload to cloud storage (AWS S3, Cloudinary)
3. **Social Login**: Add Google/Facebook OAuth providers
4. **Email Verification**: Require email verification before full access
5. **Analytics**: Expand analytics dashboard with detailed metrics
6. **Notifications**: Add real-time notifications for likes/comments
7. **Search**: Implement advanced search and filtering

## Support

For issues or questions, please check the main README or create an issue in the repository.

