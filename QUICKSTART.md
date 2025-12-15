# Quick Start Guide

## Setup Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your PostgreSQL connection string.

3. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Create database schema
   npm run db:push
   ```

4. **Seed database (optional)**
   ```bash
   # Install tsx if not already installed
   npm install -D tsx

   # Run seed script
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Testing the App

### With Seed Data

After running the seed script, you'll have:
- 2 demo users
- 3 food items (Pizza, Burger, Sushi)
- 3 videos linked to food items
- Sample analytics data

### Without Seed Data

You can create videos and food items via the API:

```bash
# Create a food item
curl -X POST http://localhost:3000/api/food-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Food",
    "price": 25.00,
    "currency": "BRL",
    "ifoodUrl": "https://www.ifood.com.br/test"
  }'

# Create a video
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Video",
    "videoUrl": "https://example.com/video.mp4",
    "creatorId": "your-user-id",
    "foodItemId": "your-food-item-id"
  }'
```

## Key Features to Test

1. **Video Scrolling**
   - Scroll with mouse wheel
   - Swipe on mobile
   - Use arrow keys

2. **Video Interactions**
   - Click to play/pause
   - Mute/unmute button
   - Like button
   - Share button

3. **Food Item Cards**
   - Click marketplace links
   - View food details
   - See price and restaurant info

4. **Analytics**
   - All interactions are tracked
   - View analytics at `/api/analytics`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists

### Video Not Playing
- Check video URL is accessible
- Ensure CORS is configured for video host
- Try a different video URL

### API Errors
- Check browser console for errors
- Verify database schema is up to date
- Run `npm run db:generate` if Prisma errors occur

## Next Steps

- Add authentication
- Configure video storage (S3, Cloudinary)
- Set up production database
- Configure environment variables for production

