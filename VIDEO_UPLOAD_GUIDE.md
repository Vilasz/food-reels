# Video Upload System Guide

## How It Works

The video upload system automatically adapts based on your environment:

### 🔧 Development (Local)

**Storage**: Local filesystem (`/public/videos/uploads/`)
**URL**: `/videos/uploads/filename.mp4`
**Size Limit**: 100MB
**Setup**: No configuration needed!

Videos are saved to:
```
public/
  videos/
    uploads/
      1234567890-abc123.mp4
      1234567891-def456.mp4
```

### 🚀 Production (Vercel)

**Storage**: Vercel Blob Storage (CDN)
**URL**: `https://xxxxx.public.blob.vercel-storage.com/videos/...`
**Size Limit**: 100MB (configurable up to 500MB with Vercel Pro)
**Setup**: Automatic when you deploy to Vercel

---

## Local Development Setup

### No configuration needed!

1. ✅ Videos save to `/public/videos/uploads/`
2. ✅ Accessible at `/videos/uploads/filename.mp4`
3. ✅ Works immediately after restart

### Testing Upload

1. Sign in as restaurant account
2. Go to Dashboard → Add New Video
3. Drag & drop or select a video file
4. See preview
5. Fill in details and submit
6. Video appears in feed

---

## Production Setup (Vercel)

### Step 1: Enable Vercel Blob Storage

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Blob**
5. Click **Create**

This automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables.

### Step 2: Environment Variables

Ensure these are set in Vercel:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx  # Auto-added by Vercel
NODE_ENV=production
```

### Step 3: Deploy

```bash
git push origin main
```

Vercel deploys automatically and videos will use Blob storage!

---

## Features

### ✅ Automatic Environment Detection

```javascript
// The system automatically detects:
if (BLOB_READ_WRITE_TOKEN && NODE_ENV === 'production') {
  // Use Vercel Blob Storage
} else {
  // Use local file storage
}
```

### ✅ File Validation

- **Type**: Only video files (video/*)
- **Size**: Maximum 100MB
- **Format**: MP4, MOV, AVI, WebM, etc.

### ✅ Security

- **Authentication**: Restaurant accounts only
- **Validation**: File type and size checked
- **Organization**: Videos organized by user ID in production

### ✅ Preview

- See video before uploading
- Remove and reselect if needed
- Real-time upload progress

---

## File Structure

### Development:
```
public/
  videos/
    uploads/           # Uploaded videos (gitignored)
      .gitkeep        # Keeps folder in git
```

### Production:
```
Vercel Blob Storage:
  videos/
    {userId}/
      timestamp-random.mp4
```

---

## API Endpoint

### POST /api/upload

**Authentication**: Required (Restaurant only)

**Request**:
```
Content-Type: multipart/form-data

video: [File] (required)
```

**Response**:
```json
{
  "url": "https://blob.vercel-storage.com/videos/...",
  "filename": "1234567890-abc123.mp4",
  "size": 15728640,
  "type": "video/mp4"
}
```

**Errors**:
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (not a restaurant account)
- `400`: Invalid file (not video or too large)
- `500`: Upload failed

---

## Troubleshooting

### Issue: "Failed to upload video" in development

**Solution**: 
- Ensure `/public/videos/uploads/` folder exists
- Check file permissions
- Restart dev server

### Issue: Upload works in dev but fails in production

**Solution**:
1. Check Vercel Blob is enabled in Vercel dashboard
2. Verify `BLOB_READ_WRITE_TOKEN` exists in environment variables
3. Check `NODE_ENV=production` is set
4. Redeploy

### Issue: Video uploaded but doesn't play

**Development**:
- Check video file is in `/public/videos/uploads/`
- Try accessing directly: `http://localhost:3001/videos/uploads/filename.mp4`

**Production**:
- Check Blob storage in Vercel dashboard
- Verify URL is publicly accessible
- Check video format is supported by browsers

---

## Size Limits

### Development:
- **File size**: 100MB (configurable in code)
- **Total storage**: Limited by disk space

### Production (Vercel):
- **File size**: 100MB (can increase to 500MB with Pro)
- **Total storage**: 
  - Hobby: 1GB free
  - Pro: 100GB ($0.15/GB after)

---

## Costs (Production)

### Vercel Blob Storage:
- **Storage**: $0.15/GB/month
- **Bandwidth**: $0.10/GB
- **Free tier**: 1GB storage, 100GB bandwidth/month

### Example:
- 50 videos × 20MB = 1GB storage = **Free**
- 1000 views/month × 20MB = 20GB bandwidth = **Free**

---

## Advanced Configuration

### Increase Size Limit

In `app/api/upload/route.ts`:

```javascript
const maxSize = 200 * 1024 * 1024 // 200MB
```

### Change Upload Directory (Development)

```javascript
const uploadDir = path.join(process.cwd(), 'public', 'videos', 'my-folder')
```

### Add Image Processing

Install Sharp:
```bash
npm install sharp
```

Generate thumbnails automatically in the upload handler.

---

## Best Practices

1. ✅ **Always validate** file type and size
2. ✅ **Show upload progress** to users
3. ✅ **Allow preview** before final upload
4. ✅ **Provide clear error messages**
5. ✅ **Compress videos** before upload (client-side)
6. ✅ **Use CDN** for delivery (automatic with Vercel Blob)

---

## Summary

| Feature | Development | Production |
|---------|-------------|------------|
| Storage | Local files | Vercel Blob |
| URL | `/videos/uploads/...` | `https://blob.vercel...` |
| Setup | None | Enable Blob in Vercel |
| Cost | Free | $0.15/GB |
| CDN | No | Yes (automatic) |
| Backup | Manual | Automatic |

---

## Quick Start

### Development:
1. ✅ Restart server
2. ✅ Upload works immediately

### Production:
1. ✅ Enable Vercel Blob
2. ✅ Deploy
3. ✅ Uploads to Blob automatically

**That's it!** 🚀



