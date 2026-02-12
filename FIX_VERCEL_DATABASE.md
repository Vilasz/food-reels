# 🔧 Fix: Vercel Database Connection Error

## ❌ Current Problem
- ✅ Works locally: `http://localhost:3000`
- ❌ Error on Vercel: `500 Internal Server Error` at `/api/videos`
- Error message: `"Failed to fetch videos"`

## ✅ Solution: Configure Database in Vercel

### Step 1: Get a Database (Choose One)

#### Option A: Neon (Recommended - Free & Fast) ⚡

1. Go to https://neon.tech
2. Sign up / Log in
3. Click "Create Project"
4. Copy the **Pooled connection** string:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/database?pgbouncer=true
   ```

#### Option B: Supabase (Free Tier) 🚀

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the **Connection Pooling** URL (Transaction mode)

#### Option C: Railway (Simple Setup) 🚂

1. Go to https://railway.app  
2. Create a PostgreSQL database
3. Copy the connection string

### Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Open your project: https://vercel.com/dashboard

2. **Navigate to Settings**
   - Click on your project
   - Click "Settings" tab
   - Click "Environment Variables"

3. **Add DATABASE_URL**
   - Variable Name: `DATABASE_URL`
   - Value: Your database connection string from Step 1
   - Environments: Check ✅ ALL (Production, Preview, Development)
   - Click "Save"

4. **Add NEXTAUTH_SECRET**
   - Variable Name: `NEXTAUTH_SECRET`
   - Value: Any random string (e.g., use https://generate-secret.vercel.app/32)
   - Environments: Check ✅ ALL
   - Click "Save"

5. **Add NEXTAUTH_URL**
   - Variable Name: `NEXTAUTH_URL`
   - Value: `https://your-project-name.vercel.app`
   - Environments: Check ✅ Production only
   - Click "Save"

### Step 3: Run Database Migrations

In your local terminal:

```bash
# Set your Vercel database URL
export DATABASE_URL="your-neon-or-supabase-connection-string"

# Run migrations
npx prisma migrate deploy

# Seed the database with sample data
npx prisma db seed
```

### Step 4: Redeploy on Vercel

1. **Push your latest code**:
   ```bash
   git add .
   git commit -m "Fix Vercel database configuration"
   git push
   ```

2. **Or manually redeploy**:
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Click "..." on the latest deployment
   - Click "Redeploy"

### Step 5: Test Your Deployment ✅

1. **Visit the health endpoint**:
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "counts": {
       "users": 1,
       "videos": 3
     }
   }
   ```

2. **Visit the videos endpoint**:
   ```
   https://your-project.vercel.app/api/videos
   ```
   Should return a list of videos

3. **Visit your app**:
   ```
   https://your-project.vercel.app
   ```
   Videos should load and play! 🎉

## 🐛 Troubleshooting

### Issue: Still getting 500 error

**Check Vercel Logs:**
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click on the latest deployment
4. Click "View Function Logs"
5. Look for database connection errors

**Common fixes:**
- Make sure `DATABASE_URL` is set in Vercel (not just locally)
- Use the **pooled connection** URL (contains `pgbouncer=true` or similar)
- Redeploy after adding environment variables
- Check that migrations were run successfully

### Issue: "Too many connections"

**Solution:** Use connection pooling
- **Neon**: Use the "Pooled connection" URL (includes `?pgbouncer=true`)
- **Supabase**: Use "Connection Pooling" URL (port 6543), not direct connection (port 5432)

### Issue: Environment variables not working

**Solution:**
1. Double-check variable names (exact spelling)
2. Make sure you selected ALL environments
3. Redeploy (environment changes require redeploy)

## 📝 What Changed

I've improved the app to work better on Vercel:

✅ Optimized Prisma client for serverless
✅ Better error handling with detailed messages
✅ Added `/api/health` endpoint for debugging
✅ Fixed connection pooling configuration
✅ Added proper logging for troubleshooting

## 🎯 Quick Checklist

- [ ] Created database on Neon/Supabase/Railway
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Added `NEXTAUTH_SECRET` to Vercel environment variables  
- [ ] Added `NEXTAUTH_URL` to Vercel environment variables
- [ ] Ran `npx prisma migrate deploy` with Vercel DATABASE_URL
- [ ] Ran `npx prisma db seed` (optional but recommended)
- [ ] Committed and pushed code
- [ ] Redeployed on Vercel
- [ ] Tested `/api/health` endpoint
- [ ] Tested `/api/videos` endpoint
- [ ] Confirmed videos load in browser

Need help? Check the logs or let me know! 🚀

