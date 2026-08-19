-- =========================================================
-- ThePinkShelf — schema Supabase
-- Esegui questo file in Supabase → SQL Editor → New query
-- =========================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  telegram_message_id bigint unique not null,
  title text not null,
  description text,
  amazon_url text not null,
  image_url text,
  price text,
  posted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists products_posted_at_idx on products (posted_at desc);

-- Row Level Security: chiunque può leggere, nessuno (tranne il webhook
-- che usa la service role key) può scrivere.
alter table products enable row level security;

create policy "Lettura pubblica dei prodotti"
  on products for select
  using (true);

-- Bucket pubblico per le immagini scaricate da Telegram
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Lettura pubblica delle immagini prodotto"
  on storage.objects for select
  using (bucket_id = 'product-images');
