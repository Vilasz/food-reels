# 🚀 Deployment Guide - Food Reels with NeonDB

## Overview

This guide walks you through deploying Food Reels to production using Vercel and NeonDB.

## Prerequisites

- NeonDB account (already have one ✅)
- Vercel account (free tier works)
- GitHub repository (to connect with Vercel)

---

## Step 1: Prepare NeonDB for Production

### 1.1 Get Your Production Database URL

1. Go to [NeonDB Console](https://console.neon.tech)
2. Select your project
3. Go to **Dashboard** → **Connection Details**
4. Copy your **Connection String** (looks like):
   ```
   postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

### 1.2 Run Production Migrations

```bash
# Set your production database URL temporarily
export DATABASE_URL="your-neon-production-url"

# Apply migrations
npx prisma migrate deploy

# Or if that doesn't work, use db push
npx prisma db push
```

---

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 2.3 Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables:

```env
# Database (from NeonDB)
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# NextAuth Secret (generate new one for production)
NEXTAUTH_SECRET=your-new-production-secret-here

# NextAuth URL (IMPORTANT - use your Vercel domain)
NEXTAUTH_URL=https://your-app-name.vercel.app

# Environment
NODE_ENV=production
```

#### How to Generate Production Secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET`.

### 2.4 Update NEXTAUTH_URL After First Deploy

**Important**: After your first deployment:

1. Vercel will give you a URL like: `https://food-reels.vercel.app`
2. Go back to **Vercel Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual Vercel URL:
   ```env
   NEXTAUTH_URL=https://food-reels.vercel.app
   ```
4. **Redeploy** for changes to take effect

---

## Step 3: Configure NeonDB Connection Pooling

### 3.1 Update Prisma Schema for Production

Your `prisma/schema.prisma` is already configured correctly:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3.2 Connection Pool Settings (Optional)

For better performance, use NeonDB's connection pooling URL:

1. In NeonDB Console, copy the **Pooled Connection** string
2. It should end with `-pooler.region.aws.neon.tech`
3. Use this as your `DATABASE_URL` in Vercel

---

## Step 4: Post-Deployment Setup

### 4.1 Verify Deployment

Visit your Vercel URL:
```
https://your-app-name.vercel.app
```

### 4.2 Test Authentication

1. Click **Sign Up**
2. Create a test restaurant account
3. Verify dashboard works
4. Add a test video

### 4.3 Monitor Logs

In Vercel Dashboard:
- Go to **Deployments** → **Functions**
- Check for any errors in the logs

---

## Environment Variables Checklist

Make sure these are set in Vercel:

```env
✅ DATABASE_URL          # From NeonDB (use pooled connection)
✅ NEXTAUTH_SECRET       # Generated with openssl rand -base64 32
✅ NEXTAUTH_URL          # https://your-domain.vercel.app
✅ NODE_ENV              # production
```

---

## Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel: **Settings** → **Domains**
2. Add your domain (e.g., `foodreels.com`)
3. Update DNS records as instructed
4. **Update `NEXTAUTH_URL`**:
   ```env
   NEXTAUTH_URL=https://foodreels.com
   ```
5. Redeploy

---

## Troubleshooting

### Issue: "Invalid callback URL"

**Solution**: 
- Ensure `NEXTAUTH_URL` matches your actual domain
- Redeploy after changing environment variables

### Issue: "Database connection failed"

**Solution**:
- Verify `DATABASE_URL` is correct
- Use the **pooled connection** string from NeonDB
- Ensure it includes `?sslmode=require`

### Issue: "NEXTAUTH_SECRET missing"

**Solution**:
- Generate secret: `openssl rand -base64 32`
- Add to Vercel environment variables
- Redeploy

---

## Production Checklist

Before going live:

- [ ] Database migrations applied to production NeonDB
- [ ] All environment variables set in Vercel
- [ ] `NEXTAUTH_URL` points to production domain
- [ ] Test user signup/login
- [ ] Test restaurant dashboard
- [ ] Test video upload
- [ ] Check mobile responsiveness
- [ ] Monitor error logs

---

## Quick Deploy Commands

```bash
# Local to Production Flow
git add .
git commit -m "Production updates"
git push origin main

# Vercel will auto-deploy!
```

---

## NeonDB Configuration Summary

### Development (.env):
```env
DATABASE_URL="postgresql://...@...neon.tech/neondb"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel):
```env
DATABASE_URL="postgresql://...@...-pooler.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="https://your-app.vercel.app"
```

---

## Video Storage for Production

Currently, videos are served from `/public/videos/`. For production, you should:

### Option 1: Vercel Blob Storage (Recommended)

```bash
npm install @vercel/blob
```

Benefits:
- Integrated with Vercel
- CDN included
- Simple setup

### Option 2: AWS S3

Benefits:
- More storage space
- Lower cost at scale
- Full control

### Option 3: Cloudinary

Benefits:
- Video optimization
- Automatic transcoding
- Free tier available

**Note**: Video upload functionality is being implemented to handle this automatically.

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **NeonDB Docs**: https://neon.tech/docs
- **NextAuth Docs**: https://next-auth.js.org

---

## Summary

1. ✅ Get NeonDB production URL
2. ✅ Deploy to Vercel (connect GitHub repo)
3. ✅ Set environment variables in Vercel
4. ✅ Update `NEXTAUTH_URL` with actual domain
5. ✅ Test authentication and features

**Your app will be live at**: `https://your-app.vercel.app` 🚀

