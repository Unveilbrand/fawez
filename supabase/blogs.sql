-- Blogs table + storage bucket for the Fawez site.
-- Run in Supabase SQL Editor.

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text not null default '',
  image_path text,              -- path inside the blog-images bucket
  image_url text,               -- public URL for the featured image
  content jsonb not null default '[]'::jsonb, -- [{ subtitle, paragraphs[] }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on edits
create or replace function public.set_blogs_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_updated_at on public.blogs;
create trigger blogs_updated_at
  before update on public.blogs
  for each row execute function public.set_blogs_updated_at();

-- Public read access; writes happen only through the service role (server API routes)
alter table public.blogs enable row level security;

drop policy if exists "blogs are publicly readable" on public.blogs;
create policy "blogs are publicly readable"
  on public.blogs for select
  using (true);

-- Public storage bucket for featured images.
-- Inserts/updates/deletes are done server-side with the service role key,
-- which bypasses storage RLS, so no write policies are needed.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Public read of images in the bucket (public buckets already expose
-- /storage/v1/object/public/... URLs; this policy covers direct object reads)
drop policy if exists "blog images are publicly readable" on storage.objects;
create policy "blog images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'blog-images');
