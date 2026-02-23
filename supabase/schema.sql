-- Phase 1: Profiles table
create table profiles (
  id uuid references auth.users primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  forgiveness_days_per_week integer default 1,
  notification_daily_reminders boolean default true,
  notification_partner_activity boolean default true,
  notification_weekly_summary boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
  
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Phase 2: Habits table
create type habit_type as enum ('binary', 'tiered');
create type priority_level as enum ('low', 'medium', 'high');

create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  type habit_type not null default 'binary',
  
  -- Tiered habit config (null for binary habits)
  bronze_target integer,
  silver_target integer,
  gold_target integer,
  unit text,
  
  -- Settings
  priority priority_level default 'medium',
  requires_photo boolean default false,
  is_shared boolean default true,
  
  -- Motivation
  why_statement text,
  why_photo_url text,
  
  -- Schedule
  active_days boolean[] default array[true,true,true,true,true,true,true],
  reminder_time time,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table habits enable row level security;

create policy "Users can manage own habits" on habits
  for all using (auth.uid() = user_id);

-- Phase 3: Habit logs table
create type emotion_type as enum ('struggled', 'fine', 'good', 'amazing');
create type tier_achieved as enum ('none', 'bronze', 'silver', 'gold');

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  
  -- Log data
  logged_at timestamptz default now(),
  log_date date not null default current_date,
  
  -- For tiered habits
  value integer,
  tier_achieved tier_achieved,
  
  -- For binary habits
  completed boolean default false,
  
  -- Photo proof
  photo_url text,
  
  -- Emotion tracking
  emotion emotion_type,
  note text,
  
  -- Partner review (for future phases)
  requires_review boolean default false,
  reviewed_by uuid references profiles(id),
  approved boolean,
  rejection_reason text,
  reviewed_at timestamptz,
  
  created_at timestamptz default now(),
  unique(habit_id, log_date)
);

alter table habit_logs enable row level security;

create policy "Users can manage own logs" on habit_logs
  for all using (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_habits_updated_at before update on habits
  for each row execute procedure update_updated_at_column();

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
