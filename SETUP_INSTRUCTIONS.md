# Homepage Carousel - Setup Instructions

## Quick Setup Steps

### 1. Database Migration

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the entire contents of: database/schema_homepage_carousel.sql
```

Or run directly:

```bash
# If using Supabase CLI
supabase db reset
# Or apply the specific migration file
```

### 2. Access the Dashboard

1. Navigate to: `http://localhost:3000/dashboard` (or your domain)
2. Log in with your admin credentials
3. Click **"Manage Homepage"** in the Quick Actions section
4. Or go directly to: `/dashboard/homepage`

### 3. Add Artwork to Carousels

**For Graphics:**

1. Click the "Graphics Carousel" tab
2. Click "Add Artwork to Carousel"
3. Select artwork from your graphics collection
4. Reorder using the arrow buttons
5. Changes save automatically

**For Tattoos:**

1. Click the "Tattoos Carousel" tab
2. Click "Add Artwork to Carousel"
3. Select artwork from your tattoos collection
4. Reorder using the arrow buttons
5. Changes save automatically

### 4. View on Homepage

Visit your homepage at `/` to see the carousels in action!

## What Was Created

### Database

- ✅ `database/schema_homepage_carousel.sql` - Complete database schema with RLS policies

### API Routes

- ✅ `/api/homepage-carousel` - GET, POST, PUT for carousel management
- ✅ `/api/homepage-carousel/[id]` - DELETE, PATCH for individual items

### Dashboard

- ✅ `/dashboard/homepage` - Full carousel management interface
- ✅ Updated `/dashboard` main page with "Manage Homepage" button

### Frontend Components

- ✅ Updated `GraphicsSection.js` - Now fetches from API
- ✅ Updated `TattoosSection.js` - Now fetches from API

### Documentation

- ✅ `HOMEPAGE_CAROUSEL_GUIDE.md` - Complete usage guide
- ✅ `SETUP_INSTRUCTIONS.md` - This file

## Features Implemented

✨ **Visual Management**

- Thumbnail previews of all artwork
- Click to add artwork to carousel
- Visual ordering with up/down arrows
- Remove items with confirmation

✨ **Smart Filtering**

- Only graphics appear in graphics carousel
- Only tattoos appear in tattoos carousel
- Already-added artwork is filtered out

✨ **Real-time Updates**

- Automatic saving on all changes
- Immediate preview on homepage
- Loading states for better UX

✨ **Security**

- Authentication required for management
- Public read access for homepage
- Row Level Security policies in place

## Testing Checklist

- [ ] Run database migration
- [ ] Log in to dashboard
- [ ] Add 3-5 graphics to graphics carousel
- [ ] Reorder graphics carousel items
- [ ] Add 3-5 tattoos to tattoos carousel
- [ ] Reorder tattoos carousel items
- [ ] Visit homepage and verify both carousels display
- [ ] Test carousel rotation on homepage
- [ ] Remove an item from carousel
- [ ] Verify it updates on homepage

## Need Help?

See `HOMEPAGE_CAROUSEL_GUIDE.md` for detailed documentation including:

- API endpoint specifications
- Troubleshooting guide
- Best practices
- Component details
