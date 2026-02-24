# Paired Progress - Couples Habit Tracker

A habit tracking app designed for couples to keep each other accountable through shared goals, tiered progress, and friendly competition.

## Features

- **Tiered Habits**: Bronze/Silver/Gold levels for non-binary habits
- **Partner Accountability**: Share progress and review each other's habits
- **Photo Proof**: Upload photos to verify habit completion
- **Emotion Tracking**: Track how habits make you feel
- **Points & Competition**: Weekly point tallies to keep motivation high
- **Forgiveness Days**: Configurable grace periods for missed habits

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **Project Settings** > **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual Supabase values.

### 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste it into the SQL editor and click **Run**

This will create:
- `profiles` table for user data
- `habits` table for habit definitions
- `habit_logs` table for daily habit tracking
- Row Level Security policies
- Automatic triggers for profile creation on signup

### 5. Set Up Storage (for photo uploads)

1. In Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it `habit-photos`
4. Set it to **Public** (or configure RLS policies)
5. Click **Save**

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React hooks + Context

## Project Structure

```
paired-progress/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard components
│   ├── onboarding/       # Onboarding flow
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase client utilities
│   └── hooks/            # Custom React hooks
├── supabase/
│   └── schema.sql        # Database schema
└── public/               # Static assets
```

## Development Phases

### ✅ Phase 1: Single User MVP (COMPLETED)
- ✅ Project setup
- ✅ Supabase configuration
- ✅ Authentication implementation (login/signup)
- ✅ Habit CRUD operations (create, read, update, delete)
- ✅ Habit logging with photo upload
- ✅ Profile settings
- ✅ Edit/delete functionality for habits and logs
- ✅ Log history view (past 7 days)
- ✅ Notification system with bell icon
- ✅ Collapsible partner section

**Status: READY FOR PRODUCTION** 🚀

### 🔄 Phase 2: Partner Features (IN PROGRESS - 40% Complete)
- ✅ Partner invitations (6-character codes)
- ✅ Partnership management (accept/unlink)
- ✅ Shared vs private habits
- ✅ Partner habit visibility
- 🔄 Review/approve workflow (Next)
- 🔄 Monthly points system (Next)
- ⏸️ Real-time updates (Planned)

**Current Status:** Database migration required. See `PHASE_2_STATUS.md` for details.

### Phase 3: Enhanced Features
- Weekly summaries
- Habit analytics and insights
- Streak tracking with forgiveness days
- Point calculations and leaderboards

### Phase 4: PWA & Notifications
- Web push notifications
- Offline support
- Install as app
- Location-based reminders

## Contributing

This is a personal project built for couples habit tracking. Contributions are welcome!

## License

MIT
