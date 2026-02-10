# Testing Guide - Food Reels

## Quick Test Scenarios

This guide helps you test all the new authentication and management features.

## Prerequisites

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Ensure database is set up**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Open browser**: Navigate to `http://localhost:3000`

## Test Scenario 1: Guest User Experience

### Steps:
1. ✅ Visit `http://localhost:3000`
2. ✅ Should auto-redirect to `/feed`
3. ✅ Click hamburger menu (☰) in top-left
4. ✅ Sidebar opens with "Sign In" and "Sign Up" buttons
5. ✅ Browse videos in feed (should work without login)

**Expected Result**: Can view feed but cannot like/comment without authentication.

---

## Test Scenario 2: User Sign Up & Sign In

### Sign Up as User:

1. ✅ Click "Sign Up" in sidebar
2. ✅ Select "User" account type (left card)
3. ✅ Fill in form:
   - Email: `testuser@example.com`
   - Username: `testuser`
   - Full Name: `Test User`
   - Password: `password123`
   - Confirm Password: `password123`
4. ✅ Check "I agree to Terms" checkbox
5. ✅ Click "Create Account"

**Expected Result**: 
- Account created successfully
- Auto-logged in
- Redirected to `/feed`
- Sidebar shows user info and "User" badge

### Sign Out & Sign In:

1. ✅ Click "Sign Out" in sidebar
2. ✅ Redirected to `/feed` (as guest)
3. ✅ Click "Sign In" in sidebar
4. ✅ Enter credentials:
   - Email: `testuser@example.com`
   - Password: `password123`
5. ✅ Click "Sign In"

**Expected Result**: Successfully logged in, redirected to `/feed`

---

## Test Scenario 3: Restaurant Sign Up & Dashboard

### Sign Up as Restaurant:

1. ✅ Sign out if logged in
2. ✅ Click "Sign Up" in sidebar
3. ✅ Select "Restaurant" account type (right card)
4. ✅ Fill in form:
   - Email: `restaurant@example.com`
   - Username: `myrestaurant`
   - Business Name: `Sushi Paradise`
   - Description: `Best sushi in town`
   - Password: `password123`
   - Confirm Password: `password123`
5. ✅ Check "I agree to Terms" checkbox
6. ✅ Click "Create Account"

**Expected Result**:
- Account created successfully
- Auto-logged in
- Redirected to `/dashboard/restaurant`
- Sidebar shows "Restaurant" badge
- Dashboard shows stats (0 videos, 0 views, 0 likes)

---

## Test Scenario 4: Add Video (Restaurant)

### Prerequisites: Logged in as restaurant account

### Steps:

1. ✅ From dashboard, click "Add New Video"
2. ✅ Fill in Video Information:
   - **Video Title**: `Amazing Salmon Sushi`
   - **Description**: `Fresh salmon with premium rice`
   - **Video URL**: `/videos/Salmao.mp4`
   - **Thumbnail URL**: (leave empty or add URL)

3. ✅ Fill in Food Item Details:
   - **Food Item Name**: `Salmon Nigiri Set`
   - **Food Description**: `8 pieces of fresh salmon nigiri`
   - **Price**: `39.90`
   - **Category**: `Japanese`
   - **iFood URL**: `https://www.ifood.com.br/delivery/sao-paulo-sp/sushi-paradise`
   - **Store URL**: `https://myrestaurant.com`

4. ✅ Click "Create Video"

**Expected Result**:
- Redirected to dashboard
- New video appears in list
- Stats updated (1 video)
- Video visible in feed

---

## Test Scenario 5: Edit & Delete Video

### Edit Video:

1. ✅ From dashboard, find your video
2. ✅ Click edit icon (pencil)
3. ✅ Modify title or description
4. ✅ Click "Save Changes"

**Expected Result**: Video updated successfully

### Delete Video:

1. ✅ From dashboard, find your video
2. ✅ Click delete icon (trash)
3. ✅ Confirm deletion in popup
4. ✅ Video removed from list

**Expected Result**: Video deleted, stats updated

---

## Test Scenario 6: Profile Management

### User Profile:

1. ✅ Log in as user account
2. ✅ Click "Profile" in sidebar
3. ✅ Update fields:
   - Name: `Updated Name`
   - Bio: `Food lover and explorer`
4. ✅ Click "Save Changes"

**Expected Result**: Profile updated, success message shown

### Restaurant Profile:

1. ✅ Log in as restaurant account
2. ✅ Click "Profile" in sidebar
3. ✅ Update fields:
   - Business Name: `Sushi Paradise Premium`
   - Phone: `(11) 99999-9999`
   - Address: `123 Main St, São Paulo`
   - Cuisine Type: `Japanese, Fusion`
   - iFood URL: `https://ifood.com.br/...`
4. ✅ Click "Save Changes"

**Expected Result**: Profile updated successfully

---

## Test Scenario 7: Forgot Password Flow

### Steps:

1. ✅ Sign out
2. ✅ Click "Sign In"
3. ✅ Click "Forgot password?"
4. ✅ Enter email: `testuser@example.com`
5. ✅ Click "Send Reset Link"

**Expected Result**: 
- Success message shown
- Reset token logged to console (check terminal)
- In production, email would be sent

### Password Reset:

1. ✅ Copy reset token from console
2. ✅ Navigate to: `http://localhost:3000/auth/reset-password?token=YOUR_TOKEN`
3. ✅ Enter new password
4. ✅ Confirm new password
5. ✅ Click "Reset Password"

**Expected Result**: Password updated, can sign in with new password

---

## Test Scenario 8: Protected Routes

### Test Route Protection:

1. ✅ Sign out completely
2. ✅ Try to access: `http://localhost:3000/dashboard/restaurant`

**Expected Result**: Redirected to `/auth/signin`

3. ✅ Try to access: `http://localhost:3000/profile`

**Expected Result**: Redirected to `/auth/signin`

4. ✅ Sign in as user (not restaurant)
5. ✅ Try to access: `http://localhost:3000/dashboard/restaurant`

**Expected Result**: Redirected to `/feed` (wrong role)

---

## Test Scenario 9: Video Feed Interaction

### Steps:

1. ✅ Ensure at least one video exists (create as restaurant)
2. ✅ Sign in as user
3. ✅ Go to `/feed`
4. ✅ Watch video
5. ✅ Click like button (heart icon)
6. ✅ Click food item card
7. ✅ Verify marketplace links work

**Expected Result**: 
- Video plays smoothly
- Like button toggles
- Food item shows details
- Links open correctly

---

## Test Scenario 10: Sidebar Navigation

### Test All Navigation Items:

**As Guest**:
- ✅ Feed → Works
- ✅ Sign In → Opens auth page
- ✅ Sign Up → Opens signup page

**As User**:
- ✅ Feed → Shows feed
- ✅ Liked → Shows liked videos page
- ✅ Profile → Shows profile settings
- ✅ Sign Out → Logs out

**As Restaurant**:
- ✅ Feed → Shows feed
- ✅ Dashboard → Shows restaurant dashboard
- ✅ Analytics → (Future feature)
- ✅ Profile → Shows profile settings
- ✅ Sign Out → Logs out

---

## Test Scenario 11: Mobile Responsiveness

### Steps:

1. ✅ Open browser DevTools (F12)
2. ✅ Toggle device toolbar (Ctrl+Shift+M)
3. ✅ Select "iPhone 12 Pro" or similar
4. ✅ Test:
   - Hamburger menu appears
   - Sidebar slides in/out
   - Forms are usable
   - Videos play correctly
   - Dashboard is responsive

**Expected Result**: All features work on mobile

---

## Test Scenario 12: Error Handling

### Test Invalid Credentials:

1. ✅ Go to sign in
2. ✅ Enter wrong password
3. ✅ Click "Sign In"

**Expected Result**: Error message "Invalid email or password"

### Test Duplicate Account:

1. ✅ Try to sign up with existing email
2. ✅ Click "Create Account"

**Expected Result**: Error message "User with this email or username already exists"

### Test Password Mismatch:

1. ✅ Go to sign up
2. ✅ Enter different passwords in password fields
3. ✅ Click "Create Account"

**Expected Result**: Error message "Passwords do not match"

---

## API Testing (Optional)

### Test with cURL or Postman:

**Sign Up**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "username": "apitest",
    "password": "password123",
    "role": "USER"
  }'
```

**Get Videos**:
```bash
curl http://localhost:3000/api/videos
```

**Create Video (requires auth)**:
```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "title": "Test Video",
    "videoUrl": "/videos/test.mp4",
    "description": "Test description"
  }'
```

---

## Performance Testing

### Check Page Load Times:

1. ✅ Open DevTools → Network tab
2. ✅ Navigate to different pages
3. ✅ Check load times:
   - Feed: < 2s
   - Dashboard: < 1s
   - Profile: < 1s

### Check Video Performance:

1. ✅ Open DevTools → Performance tab
2. ✅ Record while scrolling feed
3. ✅ Check FPS (should be 60fps)
4. ✅ Check memory usage (should be stable)

---

## Checklist Summary

### Authentication ✅
- [x] User sign up
- [x] Restaurant sign up
- [x] Sign in
- [x] Sign out
- [x] Forgot password
- [x] Password reset
- [x] Protected routes

### Restaurant Features ✅
- [x] Dashboard access
- [x] View stats
- [x] Add video
- [x] Edit video
- [x] Delete video
- [x] Profile management

### User Features ✅
- [x] Browse feed
- [x] Profile management
- [x] Liked videos page

### UI/UX ✅
- [x] Responsive sidebar
- [x] Mobile support
- [x] Smooth animations
- [x] Error handling
- [x] Loading states

### Security ✅
- [x] Password hashing
- [x] Session management
- [x] Route protection
- [x] Owner verification

---

## Troubleshooting Common Issues

### Issue: Can't sign in after signup
**Solution**: Check browser console for errors, verify database connection

### Issue: Videos don't play
**Solution**: Ensure video files exist in `public/videos/` folder

### Issue: Sidebar doesn't open on mobile
**Solution**: Check window width, try refreshing page

### Issue: Database errors
**Solution**: Run `npm run db:push` to sync schema

### Issue: Session not persisting
**Solution**: Check NEXTAUTH_SECRET is set in .env

---

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Smooth user experience
- ✅ Fast page loads
- ✅ Proper error messages
- ✅ Data persists correctly
- ✅ Mobile-friendly
- ✅ Secure authentication

---

## Next Steps After Testing

1. **Fix any issues found**
2. **Optimize performance** if needed
3. **Add more test videos** for better demo
4. **Configure email service** for password resets
5. **Deploy to production**

Happy testing! 🚀

