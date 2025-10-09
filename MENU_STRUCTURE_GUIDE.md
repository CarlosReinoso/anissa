# Hierarchical Menu Structure Guide

## Overview

This guide explains the new hierarchical menu system for organizing artworks in the Graphics and Tattoos sections.

## Architecture

### Three-Level Hierarchy

```
Section (Graphics/Tattoos)
  └── Menu Items (e.g., "Illustrations", "Sketches", "Line Art")
      └── Subcategories (e.g., "Abstract", "Portrait", "Landscape")
          └── Artworks
```

### Database Schema

#### 1. `menu_items` Table

- **Purpose**: Main navigation items within each section
- **Fields**:
  - `id` (uuid): Primary key
  - `name` (text): Display name (e.g., "Illustrations")
  - `slug` (text): URL-friendly version
  - `section` (text): 'graphics' or 'tattoos'
  - `description` (text): Optional description
  - `sort_order` (int): Display order
  - `is_visible` (boolean): Show/hide in menu
  - `created_at`, `updated_at` (timestamptz): Timestamps

#### 2. `subcategories` Table (Updated)

- **Purpose**: Categories within each menu item
- **Fields**:
  - `id` (uuid): Primary key
  - `name` (text): Display name (e.g., "Abstract")
  - `section` (text): 'graphics' or 'tattoos'
  - `menu_item_id` (uuid): **NEW** - Links to menu_items
  - `sort_order` (int): Display order
  - `created_at` (timestamptz): Timestamp

#### 3. `artwork_images` Table (Updated)

- **Purpose**: Individual artworks
- **Fields**:
  - `id` (uuid): Primary key
  - `subcategory_id` (uuid): **NEW** - Links to subcategories (replaces text field)
  - `sub_category` (text): **DEPRECATED** - Keep for migration, remove later
  - ... (other existing fields)

### Views

#### `artwork_hierarchy` View

A convenient view that joins all three levels for easy querying:

```sql
SELECT * FROM artwork_hierarchy
WHERE section = 'graphics'
  AND menu_item_visible = true
ORDER BY menu_item_sort_order, subcategory_sort_order, artwork_sort_order;
```

## Migration Steps

### 1. Run the Database Migration

Execute the migration script:

```bash
# Connect to your Supabase database
psql YOUR_DATABASE_URL

# Run the migration
\i database/schema_update_menu.sql
```

### 2. Verify Migration

The migration automatically:

- Creates `menu_items` table
- Adds `menu_item_id` to `subcategories`
- Adds `subcategory_id` to `artwork_images`
- Creates default menu items ("All Graphics", "All Tattoos")
- Links existing subcategories to default menu items
- Migrates artwork from text `sub_category` to `subcategory_id` relationships

### 3. Organize Your Menu Structure

After migration, organize your content in the dashboard:

1. **Create Menu Items**:

   - Go to Graphics Dashboard → "Add New Menu Item"
   - Examples: "Digital Illustrations", "Line Art", "Sketches"

2. **Add Subcategories**:

   - Expand each menu item
   - Add subcategories (e.g., "Abstract", "Portrait", "Nature")

3. **Reorder Items**:

   - Drag and drop menu items to reorder
   - Drag and drop subcategories within each menu item

4. **Show/Hide Menu Items**:
   - Use the eye icon to toggle visibility
   - Hidden items won't appear in the public menu

## API Endpoints

### Menu Items

#### GET `/api/menu-items`

Query parameters:

- `section` - Filter by section (graphics/tattoos)
- `includeSubcategories` - Include nested subcategories (true/false)

#### POST `/api/menu-items`

Create new menu item:

```json
{
  "name": "Illustrations",
  "section": "graphics",
  "description": "Digital illustrations and artwork"
}
```

#### PUT `/api/menu-items`

Bulk update sort orders:

```json
{
  "updates": [
    { "id": "uuid1", "sort_order": 0 },
    { "id": "uuid2", "sort_order": 1 }
  ]
}
```

#### PUT `/api/menu-items/:id`

Update single menu item:

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_visible": true
}
```

#### DELETE `/api/menu-items/:id`

Delete menu item (cascades to subcategories)

### Subcategories (Updated)

#### GET `/api/subcategories`

Query parameters:

- `section` - Filter by section
- `menu_item_id` - Filter by menu item
- `name` - Find by name

#### POST `/api/subcategories`

Create new subcategory:

```json
{
  "name": "abstract",
  "section": "graphics",
  "menu_item_id": "uuid-of-menu-item"
}
```

## Component Usage

### Dashboard - MenuManager

```jsx
import MenuManager from "@/components/dashboard/MenuManager";

<MenuManager
  section="graphics"
  onMenuChange={() => {
    // Refresh callback
  }}
/>;
```

Features:

- Create/edit/delete menu items
- Drag-and-drop reordering
- Toggle visibility
- Nested subcategory management
- Drag-and-drop subcategory reordering

### Frontend - Hierarchical Navigation (Coming Soon)

The frontend will be updated to show the menu hierarchy in the navigation.

## Best Practices

### Menu Organization

1. **Menu Items**: Broad categories (3-7 items is ideal)

   - ✅ Good: "Illustrations", "Sketches", "Line Art"
   - ❌ Too specific: "Blue Portraits", "Red Landscapes"

2. **Subcategories**: Specific themes within menu items

   - ✅ Good: "Abstract", "Portrait", "Nature", "Geometric"
   - ❌ Too broad: "Art", "Stuff"

3. **Ordering**: Most important/popular first
   - Featured work → Regular work → Experimental work

### Performance

- The system uses proper indexes for fast querying
- Foreign key relationships maintain data integrity
- Cascade deletes prevent orphaned records

### Data Migration

- Old `sub_category` text field is preserved during migration
- Can be safely removed after verifying all artworks are linked via `subcategory_id`
- Migration SQL has commented-out DROP statements for when you're ready

## Example Structure

### Graphics Section

```
Graphics
├── Digital Illustrations (Menu Item)
│   ├── Abstract (Subcategory)
│   ├── Portrait (Subcategory)
│   └── Nature (Subcategory)
├── Line Art (Menu Item)
│   ├── Continuous Line (Subcategory)
│   ├── Minimal (Subcategory)
│   └── Geometric (Subcategory)
└── Sketches (Menu Item)
    ├── Character Studies (Subcategory)
    └── Quick Sketches (Subcategory)
```

### Tattoos Section

```
Tattoos
├── Traditional (Menu Item)
│   ├── American Traditional (Subcategory)
│   └── Japanese (Subcategory)
├── Minimalist (Menu Item)
│   ├── Line Work (Subcategory)
│   └── Dot Work (Subcategory)
└── Custom Designs (Menu Item)
    └── Commissioned (Subcategory)
```

## Troubleshooting

### Issue: Existing artworks not showing

**Solution**: Run the migration SQL to link artworks to subcategories:

```sql
UPDATE artwork_images ai
SET subcategory_id = (
  SELECT s.id
  FROM subcategories s
  WHERE LOWER(s.name) = LOWER(ai.sub_category)
  AND s.section = ai.section
  LIMIT 1
)
WHERE ai.sub_category IS NOT NULL
AND ai.subcategory_id IS NULL;
```

### Issue: Subcategories not appearing in menu items

**Solution**: Link them to a menu item:

```sql
-- Get the menu item ID first
SELECT id, name FROM menu_items WHERE section = 'graphics';

-- Then update the subcategories
UPDATE subcategories
SET menu_item_id = 'YOUR_MENU_ITEM_ID'
WHERE section = 'graphics' AND menu_item_id IS NULL;
```

### Issue: Duplicate menu item names

**Solution**: Each menu item must have a unique slug within its section. Rename one of them.

## Future Enhancements

- [ ] Frontend hierarchical navigation menu
- [ ] Bulk move artworks between subcategories
- [ ] Menu item templates
- [ ] Analytics per menu item/subcategory
- [ ] Menu item featured images
- [ ] Breadcrumb navigation
- [ ] Dynamic routing based on menu structure

## Support

For issues or questions, refer to:

- Database schema: `database/schema_update_menu.sql`
- API routes: `src/app/api/menu-items/` and `src/app/api/subcategories/`
- Components: `src/components/dashboard/MenuManager.js`
