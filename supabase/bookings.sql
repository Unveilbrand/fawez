-- Bookings table for the Contact + Consultation forms.
-- Run in Supabase SQL Editor.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,                 -- reserved for a future email field
  date date not null,
  time text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- No public policies: form submissions are inserted server-side via the
-- service role (/api/bookings), and admin reads/deletes go through
-- /api/admin/bookings — so anon users can never read or write directly.
alter table public.bookings enable row level security;
