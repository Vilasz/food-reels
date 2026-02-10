# 🚀 Quick Start - Food Reels

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# Check PostgreSQL is running
psql --version
```

## 1. Install Dependencies (1 min)

```bash
npm install
```

## 2. Configure Environment (1 min)

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/food_reels"
NEXTAUTH_SECRET="run-this-command-below-to-generate"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

Generate secret:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

## 3. Setup Database (2 min)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

## 4. Start Application (1 min)

```bash
npm run dev
```

Open: **http://localhost:3000**

## 5. Create Your First Account

1. Click the **☰** menu icon (top-left)
2. Click **"Sign Up"**
3. Choose **"Restaurant"** to test the dashboard
4. Fill in:
   - Email: `demo@restaurant.com`
   - Username: `demorestaurant`
   - Business Name: `Demo Restaurant`
   - Password: `password123`
5. Click **"Create Account"**

You'll be redirected to the Restaurant Dashboard! 🎉

## 6. Add Your First Video

1. Click **"Add New Video"**
2. Fill in:
   - **Title**: `Delicious Sushi`
   - **Video URL**: `/videos/Salmao.mp4` (sample video included)
   - **Food Item Name**: `Salmon Roll`
   - **Price**: `29.90`
3. Click **"Create Video"**

Your video is now live in the feed! 🍣

## What's Next?

- 📖 Read [AUTHENTICATION.md](AUTHENTICATION.md) for detailed auth docs
- 🔧 Check [SETUP.md](SETUP.md) for troubleshooting
- ✅ Follow [TESTING_GUIDE.md](TESTING_GUIDE.md) to test all features
- 📋 Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

## Common Issues

**Database connection error?**
```bash
# Check your DATABASE_URL in .env
# Make sure PostgreSQL is running
```

**"NEXTAUTH_SECRET" error?**
```bash
# Generate a secret and add to .env
openssl rand -base64 32
```

**Port 3000 already in use?**
```bash
# Kill the process or use different port
PORT=3001 npm run dev
```

## Key Features to Test

✅ **Sign Up** - Create user or restaurant account  
✅ **Sign In** - Login with credentials  
✅ **Dashboard** - Manage videos (restaurant only)  
✅ **Profile** - Update your information  
✅ **Feed** - Browse food videos  
✅ **Mobile** - Test responsive design  

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:studio        # Open database GUI
npm run db:push          # Sync schema

# Production
npm run build            # Build for production
npm start                # Start production server
```

## Need Help?

1. Check the error message in terminal
2. Look at browser console (F12)
3. Review the documentation files
4. Check `SETUP.md` troubleshooting section

## Success! 🎉

If you see the feed page and can create an account, you're all set!

**Enjoy building with Food Reels!** 🍔📹

