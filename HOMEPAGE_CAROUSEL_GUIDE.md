# Homepage Carousel Management Guide

This guide explains how to use the homepage carousel management system to control which artwork appears in the Graphics and Tattoos sections on your homepage.

## Overview

The homepage features two carousel sections:

- **Graphics Carousel** - Displays featured graphics and illustrations
- **Tattoos Carousel** - Displays featured tattoo designs

Each carousel can display multiple images that automatically rotate, and you can manage these through the dashboard.

## Database Setup

### 1. Run the Database Migration

First, you need to create the `homepage_carousel` table in your Supabase database:

```sql
-- Run the contents of: database/schema_homepage_carousel.sql
```

This will:

- Create the `homepage_carousel` table
- Set up proper indexes for performance
- Configure Row Level Security (RLS) policies
- Create triggers for automatic timestamp updates

### 2. Verify the Migration

After running the migration, verify the table was created:

```sql
SELECT * FROM homepage_carousel;
```

## Using the Dashboard

### Accessing the Homepage Manager

1. Log in to your dashboard at `/dashboard`
2. Click on the **"Manage Homepage"** button
3. Or navigate directly to `/dashboard/homepage`

### Managing Carousels

#### Graphics Carousel

1. Click on the **"Graphics Carousel"** tab
2. Click **"Add Artwork to Carousel"** to see available graphics
3. Click on any artwork thumbnail to add it to the carousel
4. Use the **up/down arrows** to reorder items
5. Use the **X button** to remove items from the carousel

#### Tattoos Carousel

1. Click on the **"Tattoos Carousel"** tab
2. Click **"Add Artwork to Carousel"** to see available tattoos
3. Click on any artwork thumbnail to add it to the carousel
4. Use the **up/down arrows** to reorder items
5. Use the **X button** to remove items from the carousel

### Features

- **Automatic Saving**: All changes are saved immediately
- **Order Management**: Drag items up or down to change their display order
- **Section Filtering**: Only artwork from the correct section appears in each carousel
- **Visual Preview**: See thumbnails of all artwork before adding
- **Real-time Updates**: Changes appear on the homepage immediately

## Technical Details

### Database Schema

```sql
CREATE TABLE homepage_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(50) NOT NULL CHECK (section IN ('graphics', 'tattoos')),
  artwork_id UUID NOT NULL REFERENCES artwork_images(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section, display_order),
  UNIQUE(section, artwork_id)
);
```

### API Endpoints

#### GET `/api/homepage-carousel`

Fetch carousel images, optionally filtered by section.

**Query Parameters:**

- `section` (optional): `graphics` or `tattoos`

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "section": "graphics",
      "artwork_id": "uuid",
      "display_order": 0,
      "is_active": true,
      "artwork": {
        "id": "uuid",
        "title": "Artwork Title",
        "storage_path": "/path/to/image.jpg",
        ...
      }
    }
  ]
}
```

#### POST `/api/homepage-carousel`

Add artwork to a carousel.

**Request Body:**

```json
{
  "section": "graphics",
  "artwork_id": "uuid",
  "display_order": 0
}
```

#### PUT `/api/homepage-carousel`

Bulk update display order.

**Request Body:**

```json
{
  "items": [
    { "id": "uuid", "display_order": 0 },
    { "id": "uuid", "display_order": 1 }
  ]
}
```

#### DELETE `/api/homepage-carousel/[id]`

Remove an item from the carousel.

#### PATCH `/api/homepage-carousel/[id]`

Update a single carousel item.

**Request Body:**

```json
{
  "display_order": 1,
  "is_active": true
}
```

### Components

#### GraphicsSection

- Location: `src/components/GraphicsSection.js`
- Fetches graphics carousel on page load
- Displays images in a carousel component
- Falls back to placeholder if no images are configured

#### TattoosSection

- Location: `src/components/TattoosSection.js`
- Fetches tattoos carousel on page load
- Displays images in a carousel component
- Falls back to placeholder if no images are configured

#### HomepageCarouselManager

- Location: `src/app/dashboard/homepage/page.js`
- Full-featured management interface
- Separate tabs for graphics and tattoos
- Drag-and-drop style ordering with arrows
- Real-time preview of changes

## Best Practices

### Image Selection

1. **Choose High-Quality Images**: Select your best artwork for the homepage
2. **Variety**: Mix different styles and subjects to showcase your range
3. **Quantity**: 3-5 images per carousel is ideal for user experience
4. **Update Regularly**: Keep content fresh by rotating featured artwork

### Organization

1. **Seasonal Updates**: Change carousel images for holidays or seasons
2. **Featured Work**: Highlight recent or important projects
3. **Client Work**: Showcase commercial work to attract similar clients
4. **Personal Projects**: Balance with personal artistic expression

### Performance

- Carousels load asynchronously to prevent blocking page load
- Images are cached by the browser
- API responses are optimized with proper indexes

## Troubleshooting

### No Images Appear

1. Check that you've added artwork to the carousel in the dashboard
2. Verify the `homepage_carousel` table exists in your database
3. Verify the `artwork_images` table exists and has data
4. Check browser console for API errors
5. Ensure RLS policies are properly configured

### Images Not Updating

1. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Check that changes were saved in the dashboard
4. Verify artwork still exists in the artwork table

### Cannot Add Artwork

1. Verify you're logged in as an authenticated user
2. Check that the artwork belongs to the correct section (graphics or tattoos)
3. Ensure you haven't already added this artwork to the carousel
4. Check for duplicate display_order values
5. Verify the artwork exists in the `artwork_images` table

## Support

For additional help or to report issues:

1. Check the browser console for error messages
2. Verify database connection is working
3. Ensure Supabase authentication is configured
4. Review API logs for detailed error information
