# Quick Start Guide - Hierarchical Menu System

## 🚀 What You Got

A complete hierarchical menu system for organizing your artwork with:

- **3-level hierarchy**: Section → Menu Items → Subcategories → Artworks
- **Drag-and-drop reordering** at all levels
- **Visibility controls** for menu items
- **Automatic data migration** from old structure

## 📋 Quick Setup (3 Steps)

### 1️⃣ Run Database Migration

**Option A: Supabase Dashboard (Recommended)**

```
1. Go to Supabase Dashboard
2. Click "SQL Editor" in the sidebar
3. Copy and paste the contents of: database/schema_update_menu.sql
4. Click "Run"
5. Then copy and paste: database/migration_helper.sql
6. Click "Run" again
```

**Option B: Command Line**

```bash
psql YOUR_DATABASE_URL -f database/schema_update_menu.sql
psql YOUR_DATABASE_URL -f database/migration_helper.sql
```

### 2️⃣ Access Your Dashboard

Navigate to:

- Graphics: `http://localhost:3000/dashboard/graphics`
- Tattoos: `http://localhost:3000/dashboard/tattoos`

### 3️⃣ Organize Your Menu

1. **Create Menu Items** (main categories)

   ```
   Example for Graphics:
   - "Digital Illustrations"
   - "Line Art"
   - "Sketches"
   ```

2. **Add Subcategories** (click to expand each menu item)

   ```
   Under "Digital Illustrations":
   - Abstract
   - Portrait
   - Nature
   ```

3. **Reorder** (drag and drop to rearrange)

4. **Toggle Visibility** (eye icon to show/hide)

## 📊 Visual Structure

```
Before:
Graphics/Tattoos
  └── Subcategories (flat list)
      └── Artworks

After:
Graphics/Tattoos
  ├── Menu Item: "Illustrations" ← NEW!
  │   ├── Subcategory: "Abstract"
  │   ├── Subcategory: "Portrait"
  │   └── Subcategory: "Nature"
  ├── Menu Item: "Line Art" ← NEW!
  │   ├── Subcategory: "Minimal"
  │   └── Subcategory: "Geometric"
  └── Menu Item: "Sketches" ← NEW!
      └── Subcategory: "Studies"
```

## 🎯 Key Features

### ✨ Dashboard Features

| Feature               | Description                                |
| --------------------- | ------------------------------------------ |
| **Drag & Drop**       | Reorder menu items and subcategories       |
| **Nested Management** | Manage subcategories within each menu item |
| **Visibility Toggle** | Show/hide menu items from public view      |
| **Live Preview**      | See your menu structure in real-time       |
| **Smart Deletion**    | Warns about cascading deletes              |
| **Auto Sorting**      | New items automatically get correct order  |

### 🛠️ Technical Features

| Feature               | Description                         |
| --------------------- | ----------------------------------- |
| **Foreign Keys**      | Proper relationships between tables |
| **Cascading Deletes** | Clean up related data automatically |
| **Indexes**           | Fast queries even with lots of data |
| **Migration Safe**    | Old data preserved during migration |
| **API Endpoints**     | RESTful API for all operations      |

## 🗂️ Files Modified/Created

### Database

```
✅ database/schema_update_menu.sql     (NEW - main migration)
✅ database/migration_helper.sql       (NEW - data migration helpers)
```

### API Routes

```
✅ src/app/api/menu-items/route.js            (NEW - CRUD operations)
✅ src/app/api/menu-items/[id]/route.js       (NEW - single item ops)
✅ src/app/api/subcategories/route.js         (UPDATED - added menu_item_id)
```

### Components

```
✅ src/components/dashboard/MenuManager.js    (NEW - main management UI)
```

### Pages

```
✅ src/app/dashboard/graphics/page.js         (UPDATED - uses MenuManager)
✅ src/app/dashboard/tattoos/page.js          (UPDATED - uses MenuManager)
```

### Documentation

```
✅ MENU_STRUCTURE_GUIDE.md       (Complete technical guide)
✅ IMPLEMENTATION_SUMMARY.md     (What was built)
✅ QUICK_START.md               (This file - quick reference)
```

## 💡 Common Tasks

### Create a New Menu Structure

```javascript
// 1. Create Menu Item
POST /api/menu-items
{
  "name": "Illustrations",
  "section": "graphics",
  "description": "Digital artwork"
}

// 2. Add Subcategories
POST /api/subcategories
{
  "name": "abstract",
  "section": "graphics",
  "menu_item_id": "uuid-from-step-1"
}
```

### Reorder Items

Just drag and drop in the dashboard! The API is called automatically.

### Hide a Menu Item

Click the eye icon in the dashboard, or:

```javascript
PUT /api/menu-items/:id
{
  "is_visible": false
}
```

## 🔍 Verify Migration

After running the migration, check your data:

```sql
-- Check menu items
SELECT section, name, sort_order, is_visible
FROM menu_items
ORDER BY section, sort_order;

-- Check subcategories are linked
SELECT
  s.name as subcategory,
  m.name as menu_item,
  s.section
FROM subcategories s
LEFT JOIN menu_items m ON s.menu_item_id = m.id
ORDER BY s.section, m.sort_order, s.sort_order;

-- Check artworks are linked
SELECT
  section,
  COUNT(*) as total,
  COUNT(subcategory_id) as linked
FROM artwork_images
GROUP BY section;
```

## 📱 Dashboard Preview

The dashboard now shows:

1. **Header** with counts (menu items & subcategories)
2. **Add Menu Item** form at top
3. **Menu Items List** with:
   - Drag handles (⋮⋮)
   - Expand/collapse arrows
   - Edit/Delete/Visibility buttons
   - Nested subcategory management
4. **Menu Preview** showing the structure
5. **Info Section** explaining the hierarchy

## 🎨 Example Menu Structures

### For Graphics

```
📁 Digital Illustrations
  ├─ abstract
  ├─ portrait
  ├─ nature
  └─ geometric

📁 Line Art
  ├─ continuous-line
  ├─ minimal
  └─ geometric

📁 Sketches & Studies
  ├─ character-studies
  └─ quick-sketches
```

### For Tattoos

```
📁 Traditional
  ├─ american-traditional
  ├─ japanese
  └─ tribal

📁 Minimalist
  ├─ line-work
  ├─ dot-work
  └─ single-needle

📁 Custom Designs
  ├─ commissioned
  └─ flash-sheets
```

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Test in Dev**: Test the migration in a development environment first
3. **Old Fields**: The old `sub_category` text field is preserved - don't delete it until you verify everything works
4. **Cascading Deletes**: Deleting a menu item deletes its subcategories and unlinks artworks

## 🆘 Troubleshooting

### Problem: "No menu items found"

Run the migration helper script - it creates default menu items.

### Problem: Artworks not showing

Check if they're linked to subcategories. The migration helper links them automatically.

### Problem: Can't reorder items

Make sure you're dragging by the drag handle (⋮⋮).

### Problem: Changes not saving

Check browser console for errors. Verify API routes are accessible.

## 📚 More Information

- **Full Guide**: See `MENU_STRUCTURE_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Database Schema**: See `database/schema_update_menu.sql`

## ✅ Checklist

Use this to track your setup:

- [ ] Run schema_update_menu.sql migration
- [ ] Run migration_helper.sql
- [ ] Verify data migration (check SQL queries above)
- [ ] Access dashboard (/dashboard/graphics or /dashboard/tattoos)
- [ ] Create first menu item
- [ ] Add subcategories to menu item
- [ ] Test drag-and-drop reordering
- [ ] Test visibility toggle
- [ ] Test delete (with confirmation)
- [ ] Check that artworks still display correctly
- [ ] Review menu preview structure

## 🎉 You're Done!

Once you've completed the checklist, you have a fully functional hierarchical menu system. Start organizing your artwork and enjoy the improved structure!

Need help? Check the other documentation files or review the code comments.
