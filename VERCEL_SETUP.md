# Vercel Deployment Setup Guide

## Database Configuration

### Problem
If you're seeing `500 Internal Server Error` when accessing `/api/videos` on Vercel, it's likely a database connection issue.

### Solution

#### Option 1: Using Neon (Recommended for Vercel)

1. **Create a Neon Database** (Free tier available)
   - Go to https://neon.tech
   - Create a new project
   - Copy the connection string

2. **Configure Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:

   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/database?pgbouncer=true&connect_timeout=10
   NEXTAUTH_SECRET=your-random-secret-key-here
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

   **Important Notes:**
   - Use the **pooled connection string** (with `pgbouncer=true`)
   - Add `connect_timeout=10` to the connection string
   - For Neon, use the connection string from the "Pooled connection" tab

3. **Run Migrations**
   ```bash
   # Set the DATABASE_URL to your Vercel database
   export DATABASE_URL="your-neon-connection-string"
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed the database (optional)
   npx prisma db seed
   ```

#### Option 2: Using Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Go to Settings → Database
   - Copy the "Connection Pooling" URL (Transaction mode)

2. **Configure Vercel Environment Variables**
   ```
   DATABASE_URL=postgresql://postgres.xxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   NEXTAUTH_SECRET=your-random-secret-key-here
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

#### Option 3: Using Railway

1. **Create a Railway Project**
   - Go to https://railway.app
   - Create a new PostgreSQL database
   - Copy the connection string

2. **Configure Vercel Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@xxx.railway.app:5432/database
   NEXTAUTH_SECRET=your-random-secret-key-here
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

### Vercel Environment Variables Setup

1. Go to your Vercel project
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable:
   - Variable name: `DATABASE_URL`
   - Value: Your database connection string
   - Environment: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy your project

### Testing the Connection

After setting up the environment variables:

1. **Redeploy your project** (Vercel → Deployments → Redeploy)
2. **Check the logs** (Vercel → Deployments → [Latest] → View Function Logs)
3. **Test the API**: Visit `https://your-project.vercel.app/api/videos`

### Common Issues

#### Issue: "Can't reach database server"
**Solution**: Make sure your database allows connections from Vercel's IP addresses. Most cloud providers (Neon, Supabase, Railway) automatically allow this.

#### Issue: "Too many connections"
**Solution**: Use a connection pooler:
- For Neon: Add `?pgbouncer=true` to your connection string
- For Supabase: Use the "Connection Pooling" URL instead of direct connection
- Add connection timeout: `?connect_timeout=10`

#### Issue: "Environment variable not found"
**Solution**: 
1. Make sure you added the environment variable in Vercel
2. Redeploy your project (environment changes require a redeploy)
3. Check that you selected all environments (Production, Preview, Development)

### Checking Logs

To see detailed error messages:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click on the latest deployment
5. Click "View Function Logs"
6. Look for errors related to database connections

### Local Development

For local development, create a `.env` file (copy from `env.example`):

```bash
cp env.example .env
```

Edit `.env` with your local database credentials:

```
DATABASE_URL="postgresql://user:password@localhost:5432/foodreels?schema=public"
NEXTAUTH_SECRET="your-local-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Then run migrations:

```bash
npx prisma migrate dev
npx prisma db seed
```

### Next Steps

After successful deployment:

1. ✅ Verify `/api/videos` returns data
2. ✅ Test video playback
3. ✅ Test user registration and login
4. ✅ Test video likes and interactions

For more help, check the Vercel logs or open an issue.

