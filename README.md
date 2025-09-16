# Carol - Web Agency Project

A Next.js web application for managing and displaying movement classes and therapy services.

## Features

### Class Management System

- **Dashboard**: Admin interface to manage classes
- **CRUD Operations**: Create, read, update, and delete classes
- **Image Management**: Upload and manage class images
- **Search & Filter**: Search classes by title, description, location, or day

### Class Properties

Each class includes:

- Title
- Description
- Class Type (In-Person or Online)
- Day of the week
- Time slot
- Location
- Booking URL
- Class image

### Public Display

- **Classes Page**: Public-facing timetable showing all active classes
- **Responsive Design**: Mobile-friendly layout with beautiful animations
- **Dynamic Content**: Classes are loaded from the database

## Database Schema

### Tables

1. **classes**: Stores class information

   - `id`: Unique identifier
   - `title`: Class name
   - `description`: Class description
   - `class_type`: 'in-person' or 'online'
   - `day`: Day of the week
   - `time`: Time slot
   - `location`: Physical location or 'Online'
   - `booking_url`: URL for booking
   - `is_active`: Soft delete flag
   - `created_at`, `updated_at`: Timestamps

2. **class_images**: Stores class images
   - `id`: Unique identifier
   - `class_id`: Reference to classes table
   - `image_url`: Image file path
   - `sort_order`: Image ordering
   - `created_at`: Timestamp

## Setup Instructions

### 1. Database Setup

Run the SQL files in order:

```bash
# Create tables
psql -d your_database -f database/schema.sql

# Apply policies
psql -d your_database -f database/policies.sql

# Seed initial data
psql -d your_database -f database/seed.sql
```

### 2. Environment Variables

Ensure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Storage Bucket

Create a storage bucket named 'images' in Supabase for class image uploads.

### 4. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 5. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

## File Structure

```
src/
├── app/
│   ├── classes/           # Public classes page
│   ├── dashboard/         # Admin dashboard
│   │   ├── class/         # Class management
│   │   │   ├── new/       # Add new class
│   │   │   └── [classId]/ # Edit existing class
│   │   └── page.js        # Main dashboard
│   └── hooks/
│       └── useClasses.js  # Classes data management
├── components/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── ClassesGrid.js    # Classes display grid
│   │   │   └── NoResults.js      # No results message
│   │   └── ClassFormInputs.js    # Class form component
│   └── ...                # Other components
└── config/
    └── supabase.js        # Supabase configuration
```

## Usage

### Adding a New Class

1. Navigate to `/dashboard`
2. Click "Add Class"
3. Fill in class details
4. Upload an image
5. Click "Save Class"

### Editing a Class

1. Navigate to `/dashboard`
2. Click "Edit" on any class
3. Modify the details
4. Click "Save Class"

### Deleting a Class

1. Navigate to `/dashboard`
2. Click "Delete" on any class
3. Confirm deletion

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Icons**: Heroicons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary and confidential.
