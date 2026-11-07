-- Admins table: controls which users get redirected to the admin dashboard.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- No public read/write policies: the table is only readable via the
-- service-role key on the server (see src/app/api/auth/admin-check).

insert into public.admins (email, role)
values ('unveilbrand@gmail.com', 'super admin')
on conflict (email) do update set role = excluded.role;
