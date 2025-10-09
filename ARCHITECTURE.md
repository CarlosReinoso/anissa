# System Architecture - Hierarchical Menu System

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │  Public Pages       │         │  Dashboard Pages     │       │
│  │  ───────────────    │         │  ────────────────    │       │
│  │  • /graphics        │         │  • /dashboard/       │       │
│  │  • /tattoos         │         │    graphics          │       │
│  │                     │         │  • /dashboard/       │       │
│  │  Components:        │         │    tattoos           │       │
│  │  • ArtworkGrid      │         │                      │       │
│  │  • ImageModal       │         │  Components:         │       │
│  │                     │         │  • MenuManager       │       │
│  └─────────────────────┘         │  • CategoryTabs      │       │
│                                   └─────────────────────┘       │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/menu-items                                          │  │
│  │  ────────────────                                         │  │
│  │  GET    /api/menu-items                List all          │  │
│  │  POST   /api/menu-items                Create new        │  │
│  │  PUT    /api/menu-items                Bulk reorder      │  │
│  │  GET    /api/menu-items/:id            Get one           │  │
│  │  PUT    /api/menu-items/:id            Update one        │  │
│  │  DELETE /api/menu-items/:id            Delete one        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/subcategories                                       │  │
│  │  ───────────────────                                      │  │
│  │  GET    /api/subcategories             List all          │  │
│  │  POST   /api/subcategories             Create new        │  │
│  │  PUT    /api/subcategories             Bulk reorder      │  │
│  │  GET    /api/subcategories/:id         Get one           │  │
│  │  PUT    /api/subcategories/:id         Update one        │  │
│  │  DELETE /api/subcategories/:id         Delete one        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/artworks                                            │  │
│  │  ──────────────                                           │  │
│  │  GET    /api/artworks                  List all          │  │
│  │  POST   /api/artworks                  Create new        │  │
│  │  PUT    /api/artworks/:id              Update one        │  │
│  │  DELETE /api/artworks/:id              Delete one        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database Layer (Supabase/PostgreSQL)          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐       ┌──────────────────┐               │
│  │  menu_items      │       │  subcategories   │               │
│  │  ──────────────  │       │  ──────────────  │               │
│  │  • id (PK)       │◄──────│  • id (PK)       │               │
│  │  • name          │   1:N │  • name          │               │
│  │  • slug          │       │  • section       │               │
│  │  • section       │       │  • menu_item_id  │               │
│  │  • description   │       │    (FK)          │               │
│  │  • sort_order    │       │  • sort_order    │               │
│  │  • is_visible    │       └──────────────────┘               │
│  │  • created_at    │                │                          │
│  │  • updated_at    │                │                          │
│  └──────────────────┘                │ 1:N                      │
│                                       ▼                          │
│                            ┌──────────────────┐                 │
│                            │  artwork_images  │                 │
│                            │  ──────────────  │                 │
│                            │  • id (PK)       │                 │
│                            │  • title         │                 │
│                            │  • slug          │                 │
│                            │  • storage_path  │                 │
│                            │  • section       │                 │
│                            │  • subcategory_id│                 │
│                            │    (FK)          │                 │
│                            │  • sort_order    │                 │
│                            │  • published     │                 │
│                            │  • created_at    │                 │
│                            └──────────────────┘                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  View: artwork_hierarchy                                  │  │
│  │  ────────────────────────                                 │  │
│  │  Joins all three tables for easy hierarchical queries     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### Creating a Menu Structure

```
User Action (Dashboard)
      │
      ├─1─► Create Menu Item
      │     POST /api/menu-items
      │     {name, section, description}
      │           │
      │           ▼
      │     INSERT INTO menu_items
      │     RETURNS {id, name, slug, ...}
      │           │
      │           ▼
      │     UI Updates
      │
      ├─2─► Add Subcategory
      │     POST /api/subcategories
      │     {name, section, menu_item_id}
      │           │
      │           ▼
      │     INSERT INTO subcategories
      │     RETURNS {id, name, ...}
      │           │
      │           ▼
      │     UI Updates
      │
      └─3─► Add Artwork
            POST /api/artworks
            {title, subcategory_id, ...}
                  │
                  ▼
            INSERT INTO artwork_images
            RETURNS {id, title, ...}
                  │
                  ▼
            UI Updates
```

### Displaying Menu Structure

```
User Visits /graphics
      │
      ▼
GET /api/menu-items?section=graphics&includeSubcategories=true
      │
      ├─► SELECT * FROM menu_items WHERE section='graphics'
      │   ORDER BY sort_order
      │
      └─► For each menu_item:
          SELECT * FROM subcategories
          WHERE menu_item_id = menu_item.id
          ORDER BY sort_order
                │
                ▼
          Returns nested structure:
          [
            {
              id: "...",
              name: "Illustrations",
              subcategories: [
                {id: "...", name: "abstract"},
                {id: "...", name: "portrait"}
              ]
            },
            ...
          ]
                │
                ▼
          Component renders hierarchy
```

### Reordering Items

```
User drags menu item from position 2 to position 0
      │
      ▼
Optimistic UI update (instant feedback)
      │
      ▼
PUT /api/menu-items
{
  updates: [
    {id: "item1", sort_order: 0},  // moved here
    {id: "item2", sort_order: 1},
    {id: "item3", sort_order: 2}
  ]
}
      │
      ▼
For each update:
  UPDATE menu_items
  SET sort_order = ?
  WHERE id = ?
      │
      ▼
Response: success
      │
      ▼
UI confirms update
```

## 🗄️ Database Schema Details

### Table: `menu_items`

| Column      | Type        | Description                          |
| ----------- | ----------- | ------------------------------------ |
| id          | uuid        | Primary key (auto-generated)         |
| name        | text        | Display name (e.g., "Illustrations") |
| slug        | text        | URL-friendly (e.g., "illustrations") |
| section     | text        | 'graphics' or 'tattoos'              |
| description | text        | Optional description                 |
| sort_order  | int         | Display order (0-indexed)            |
| is_visible  | boolean     | Show in public menu                  |
| created_at  | timestamptz | Creation timestamp                   |
| updated_at  | timestamptz | Last update timestamp                |

**Constraints:**

- UNIQUE(slug, section) - No duplicate slugs per section
- CHECK(section IN ('graphics', 'tattoos'))

**Indexes:**

- (section, sort_order) - Fast menu loading
- (is_visible, section) - Fast visible items query

### Table: `subcategories`

| Column       | Type        | Description                     |
| ------------ | ----------- | ------------------------------- |
| id           | uuid        | Primary key (auto-generated)    |
| name         | text        | Display name (e.g., "abstract") |
| section      | text        | 'graphics' or 'tattoos'         |
| menu_item_id | uuid        | Foreign key to menu_items       |
| sort_order   | int         | Display order within menu item  |
| created_at   | timestamptz | Creation timestamp              |

**Constraints:**

- UNIQUE(name, section) - No duplicate names per section
- FOREIGN KEY(menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE

**Indexes:**

- (menu_item_id, sort_order) - Fast subcategory loading
- (section, sort_order) - Section-wide queries

### Table: `artwork_images`

| Column         | Type        | Description                           |
| -------------- | ----------- | ------------------------------------- |
| id             | uuid        | Primary key (auto-generated)          |
| title          | text        | Artwork title                         |
| slug           | text        | URL-friendly identifier               |
| storage_path   | text        | Supabase storage path                 |
| section        | text        | Generated: 'graphics' or 'tattoos'    |
| subcategory_id | uuid        | Foreign key to subcategories          |
| sort_order     | int         | Display order within subcategory      |
| published      | boolean     | Published status                      |
| created_at     | timestamptz | Creation timestamp                    |
| ...            | ...         | Other fields (description, alt, etc.) |

**Constraints:**

- UNIQUE(slug) - No duplicate slugs
- FOREIGN KEY(subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL

**Indexes:**

- (subcategory_id, sort_order) - Fast artwork loading
- (section, sort_order) - Section-wide queries
- (published, created_at DESC) - Published items query

### View: `artwork_hierarchy`

A convenient view that joins all three tables:

```sql
CREATE VIEW artwork_hierarchy AS
SELECT
  ai.id as artwork_id,
  ai.title,
  ai.section,
  s.id as subcategory_id,
  s.name as subcategory_name,
  m.id as menu_item_id,
  m.name as menu_item_name,
  m.slug as menu_item_slug,
  m.is_visible as menu_item_visible
FROM artwork_images ai
LEFT JOIN subcategories s ON ai.subcategory_id = s.id
LEFT JOIN menu_items m ON s.menu_item_id = m.id
ORDER BY m.sort_order, s.sort_order, ai.sort_order;
```

## 🔄 State Management

### Dashboard (React State)

```javascript
// MenuManager Component State
const [menuItems, setMenuItems] = useState([
  {
    id: "uuid1",
    name: "Illustrations",
    subcategories: [
      { id: "uuid2", name: "abstract" },
      { id: "uuid3", name: "portrait" },
    ],
  },
]);

const [expandedMenus, setExpandedMenus] = useState({
  uuid1: true, // expanded
  uuid2: false, // collapsed
});

const [editingMenu, setEditingMenu] = useState(null);
const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "" });
```

### Optimistic Updates

1. User performs action (e.g., drag-and-drop)
2. UI updates immediately (optimistic)
3. API call is made in background
4. If successful, UI stays as-is
5. If error, UI reverts and shows error message

## 🔒 Security & Validation

### API Level

- Input validation on all endpoints
- Type checking for parameters
- SQL injection protection (Supabase client handles this)
- Unique constraint enforcement

### Database Level

- Foreign key constraints
- Unique constraints
- Check constraints (e.g., section IN ('graphics', 'tattoos'))
- Cascading deletes for data integrity

### UI Level

- Confirmation dialogs for destructive actions
- Disabled states during operations
- Error boundaries for crash prevention
- Loading states for feedback

## 🚀 Performance Optimizations

### Database

- **Indexes**: All foreign keys and sort columns indexed
- **Efficient Queries**: Use of specific columns instead of SELECT \*
- **Batch Operations**: Bulk updates for reordering
- **Views**: Pre-joined data for complex queries

### API

- **Pagination**: Ready for large datasets (limit/offset)
- **Selective Loading**: Include subcategories only when needed
- **Caching**: Ready for Redis/CDN caching
- **Error Handling**: Graceful failures with meaningful messages

### UI

- **Optimistic Updates**: Immediate feedback
- **Lazy Loading**: Components load as needed
- **Debouncing**: Prevent excessive API calls
- **Virtual Scrolling**: Ready for large lists

## 📈 Scalability

The architecture supports:

- ✅ Thousands of menu items
- ✅ Thousands of subcategories
- ✅ Tens of thousands of artworks
- ✅ Multiple sections (easy to add more)
- ✅ Complex hierarchies (can extend to 4+ levels)
- ✅ Multi-tenant (can add user/tenant filtering)

## 🔮 Future Enhancements

### Short Term

- [ ] Frontend hierarchical navigation menu
- [ ] Breadcrumb component
- [ ] Bulk operations (move multiple items)
- [ ] Search and filter

### Long Term

- [ ] Nested menu items (sub-menus)
- [ ] Menu templates
- [ ] Analytics per menu/subcategory
- [ ] A/B testing different structures
- [ ] Multi-language support
- [ ] Menu versioning

## 📝 Code Organization

```
src/
├── app/
│   ├── api/
│   │   ├── menu-items/
│   │   │   ├── route.js          # CRUD for menu items
│   │   │   └── [id]/route.js     # Single menu item ops
│   │   ├── subcategories/
│   │   │   ├── route.js          # CRUD for subcategories
│   │   │   └── [id]/route.js     # Single subcategory ops
│   │   └── artworks/
│   │       └── ...               # Artwork operations
│   │
│   ├── dashboard/
│   │   ├── graphics/
│   │   │   └── page.js           # Graphics dashboard
│   │   └── tattoos/
│   │       └── page.js           # Tattoos dashboard
│   │
│   ├── graphics/
│   │   └── page.js               # Public graphics page
│   └── tattoos/
│       └── page.js               # Public tattoos page
│
├── components/
│   ├── dashboard/
│   │   ├── MenuManager.js        # Hierarchical menu management
│   │   ├── CategoryManager.js    # Old flat management
│   │   └── CategoryTabs.js       # Tab interface
│   ├── ArtworkGrid.js            # Display artworks
│   └── ImageModal.js             # Artwork modal
│
└── utils/
    └── slug.js                   # Slug generation

database/
├── schema.sql                    # Original schema
├── schema_update_menu.sql        # Menu system migration
└── migration_helper.sql          # Data migration helpers
```

## 🎯 Key Design Decisions

### Why Three Levels?

- **Section**: Natural top-level grouping (Graphics/Tattoos)
- **Menu Items**: User-facing navigation categories
- **Subcategories**: Detailed organization within categories
- **Artworks**: The actual content

### Why Foreign Keys?

- Data integrity
- Cascading deletes
- Relationship enforcement
- Query optimization

### Why Separate Tables?

- Flexibility to add fields
- Independent management
- Clear data model
- Better performance

### Why Sort Order?

- User control over display order
- Independent of creation time
- Efficient queries
- Easy reordering

## 📚 Related Documentation

- **Quick Start**: `QUICK_START.md`
- **Complete Guide**: `MENU_STRUCTURE_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Database Schema**: `database/schema_update_menu.sql`

---

This architecture provides a solid foundation for scalable, maintainable artwork organization with room for future growth and enhancements.
