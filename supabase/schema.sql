-- =========================================================
-- ANIME LUXE — Supabase Database Schema
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  price numeric not null,
  compare_at_price numeric,
  category text not null,
  anime text not null,
  images text[] not null default '{}',
  stock integer not null default 100,
  is_limited boolean default false,
  is_new boolean default false,
  is_trending boolean default false,
  rating numeric not null default 5.0,
  review_count integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. ORDERS TABLE
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  payment_reference text,
  stripe_session_id text, -- legacy column fallback
  status text default 'pending', -- 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  items jsonb not null default '[]',
  total numeric not null,
  customer_email text,
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- 3. REVIEWS TABLE
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  is_verified boolean default false,
  status text default 'approved', -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz default now()
);

alter table reviews enable row level security;

create policy "Public can read approved reviews"
  on reviews for select
  using (status = 'approved');

create policy "Authenticated users can submit reviews"
  on reviews for insert
  with check (auth.uid() = user_id);
