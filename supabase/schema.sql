-- =============================================
-- J&D Cartas Pokémon - Esquema de base de datos
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. CARDS (cartas gestionadas por el admin)
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text not null,
  price numeric(10,2) not null default 0,
  description text,
  condition text not null default 'new'
    check (condition in ('new', 'used', 'mint', 'good', 'poor')),
  availability text not null default 'in_stock'
    check (availability in ('in_stock', 'low_stock', 'out_of_stock')),
  category text not null default 'pokemon',
  rarity text,
  set_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cards enable row level security;

create policy "Todos pueden leer cartas"
  on public.cards for select using (true);

-- Los admins se gestionan con un rol en la tabla profiles

-- 2. PROFILES (datos de usuario extendidos)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Perfiles públicos de solo lectura"
  on public.profiles for select using (true);

create policy "Usuarios editan su propio perfil"
  on public.profiles for update using (auth.uid() = id);

-- 3. ORDERS (pedidos)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  user_id uuid references auth.users(id) on delete cascade,
  user_email text not null,
  user_name text not null,
  total numeric(10,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  paypal_order_id text,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Usuarios ven sus propios pedidos"
  on public.orders for select using (auth.uid() = user_id);

-- Los admins pueden gestionar todos los pedidos (se habilita en el backend con service role)

-- 4. ORDER_ITEMS (líneas de cada pedido)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  card_id text not null,
  card_name text not null,
  card_image text,
  unit_price numeric(10,2) not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "Usuarios ven los items de sus pedidos"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  ));

-- =============================================
-- STORAGE para subir imágenes de cartas
-- =============================================
-- Crear bucket 'cards' manualmente en Storage con acceso público:
--  - name: cards
--  - public: true
--  - Policy "Public read" para SELECT
--  - Policy "Admins can upload" con el rol service (o autenticado)

-- =============================================
-- Scholar admin por defecto (opcional)
-- Inserta tu usuario admin después de crear su cuenta en el registro:
--   update public.profiles set role = 'admin'
--   where email = 'tucorreo-admin@gmail.com';
-- =============================================
