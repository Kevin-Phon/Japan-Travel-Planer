-- Create the table for itinerary items
create table public.itinerary_items (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid null, -- Allow null for now, can perform RLS later
  title text not null,
  date date null,
  end_date date null,
  day text null, -- keeping for legacy support
  time text null,
  cost text null,
  location_name text null, -- stores mapQuery
  image_url text null,
  description text null,
  metadata jsonb null, -- details object
  constraint itinerary_items_pkey primary key (id)
);

-- Enable Row Level Security (RLS) - Optional for now but recommended
alter table public.itinerary_items enable row level security;

-- Create a policy to allow anyone to read/write for this demo (UNSECURE - for dev only)
-- Ideally you want to restrict this to authenticated users matching user_id
create policy "Enable all access for all users"
on public.itinerary_items
for all
using (true)
with check (true);
