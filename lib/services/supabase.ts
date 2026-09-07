import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client — safe to use in Client Components.
 * Uses the public anon key only.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server client — use only inside Server Components, Server Actions,
 * or Route Handlers. Uses the service role key, which must NEVER be
 * exposed to the browser bundle.
 */
export function getSupabaseServerClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/**
 * Example schema you'd create in Supabase (SQL editor):
 *
 * create table products (
 *   id uuid primary key default gen_random_uuid(),
 *   slug text unique not null,
 *   title text not null,
 *   description text,
 *   price numeric not null,
 *   compare_at_price numeric,
 *   category text not null,
 *   anime text not null,
 *   images text[] not null default '{}',
 *   rating numeric default 0,
 *   review_count integer default 0,
 *   is_limited boolean default false,
 *   is_new boolean default false,
 *   is_trending boolean default false,
 *   created_at timestamptz default now()
 * );
 *
 * create table orders (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users(id),
 *   payment_reference text,
 *   status text default 'pending', -- 'pending' | 'paid' | 'cancelled' | 'refunded'
 *   items jsonb not null default '[]', -- snapshot of CartItem[] at checkout time
 *   total numeric not null,
 *   created_at timestamptz default now()
 * );
 *
 * -- Row Level Security: users can only read their own orders.
 * alter table orders enable row level security;
 * create policy "Users can view their own orders"
 *   on orders for select using (auth.uid() = user_id);
 *
 * -- Admin-managed product catalog (see lib/actions/admin/products.ts).
 * -- NOTE: the public storefront still reads from the static mock catalog
 * -- in lib/data/products.ts — this table is a starting point for admin
 * -- CRUD, not yet wired into /shop or /product/[slug]. See README.
 * create table products (
 *   id uuid primary key default gen_random_uuid(),
 *   slug text unique not null,
 *   title text not null,
 *   description text,
 *   price numeric not null,
 *   compare_at_price numeric,
 *   category text not null,
 *   anime text not null,
 *   images text[] not null default '{}',
 *   stock integer not null default 0,
 *   is_limited boolean default false,
 *   is_new boolean default false,
 *   is_trending boolean default false,
 *   rating numeric not null default 0, -- not admin-editable; would come from
 *   review_count integer not null default 0, -- real review aggregation later
 *   created_at timestamptz default now(),
 *   updated_at timestamptz default now()
 * );
 *
 * -- If you created this table before rating/review_count existed, add them with:
 * -- alter table products add column if not exists rating numeric not null default 0;
 * -- alter table products add column if not exists review_count integer not null default 0;
 */
