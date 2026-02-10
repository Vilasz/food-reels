# URGENT: Environment Setup Required

## Critical Issues Found

1. **NEXTAUTH_SECRET is missing** - This is causing authentication errors
2. **Database schema is out of sync** - The password column doesn't exist yet

## Quick Fix (2 minutes)

### Step 1: Update your `.env` file

Add these lines to your `.env` file:

```env
NEXTAUTH_SECRET="qF2UzqVYChmFuOjKP8l0ftzWVwNQjgjfLXx6oof0DPw="
NEXTAUTH_URL="http://localhost:3001"
```

**Important**: Replace the entire content or add these if missing.

### Step 2: Fix the Database

You have two options:

#### Option A: Apply SQL Fix (Preserves existing data)

Run this command in your terminal:

```bash
psql -d your_database_name -f fix-database.sql
```

Or copy the contents of `fix-database.sql` and run it in your database tool (pgAdmin, DBeaver, etc.)

#### Option B: Reset Database (Loses existing data - RECOMMENDED for dev)

```bash
npx prisma migrate reset --force
```

Then:

```bash
npx prisma db push
```

### Step 3: Restart the Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## What These Errors Mean

### Error 1: NO_SECRET
```
[next-auth][error][NO_SECRET]
```
**Cause**: NEXTAUTH_SECRET environment variable is not set  
**Fix**: Add `NEXTAUTH_SECRET` to your `.env` file (see Step 1)

### Error 2: Column doesn't exist
```
The column `User.password` does not exist in the current database.
```
**Cause**: Database schema hasn't been updated with new authentication fields  
**Fix**: Run the database migration (see Step 2)

## Complete `.env` File Example

Your `.env` file should look like this:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth (REQUIRED)
NEXTAUTH_SECRET="qF2UzqVYChmFuOjKP8l0ftzWVwNQjgjfLXx6oof0DPw="
NEXTAUTH_URL="http://localhost:3001"

# Environment
NODE_ENV="development"
```

## After Fixing

Once you've completed these steps:

1. ✅ Server should start without warnings
2. ✅ Authentication pages will work
3. ✅ You can create accounts
4. ✅ Database operations will succeed

## Still Having Issues?

If you still see errors:

1. **Check your `.env` file** - Make sure it's in the root directory
2. **Restart your terminal** - Environment variables need a fresh shell
3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Performance Improvements

The slow loading is due to:
1. **First-time compilation** - Next.js compiles routes on first access (normal)
2. **Missing environment variables** - Causes retry loops

After fixing the above issues, subsequent loads will be much faster (< 1 second).

---

**Need Help?** Check the terminal output after making these changes. The errors should disappear!

