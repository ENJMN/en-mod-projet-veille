-- WAYS Formations — Schéma Phase 1
-- À exécuter dans Supabase SQL Editor

-- Extension UUID
create extension if not exists "uuid-ossp";

-- Profils utilisateurs (complète auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  country text default 'CI',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Formations
create table public.formations (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  content text, -- description longue MDX
  category text not null, -- IA & Digital, Stratégie, BTP, Formation
  level text default 'Débutant', -- Débutant, Intermédiaire, Avancé
  price_xof integer not null default 0, -- prix en FCFA
  price_eur numeric(10,2) default 0,
  duration_hours integer default 0,
  lessons_count integer default 0,
  thumbnail_url text,
  preview_video_url text,
  instructor_name text default 'N''Guessan Jacques EBAKA',
  instructor_bio text,
  objectives text[], -- tableau d'objectifs
  requirements text[], -- prérequis
  is_published boolean default false,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Modules d'une formation
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  formation_id uuid references public.formations(id) on delete cascade not null,
  title text not null,
  description text,
  position integer not null default 0,
  created_at timestamptz default now()
);

-- Leçons d'un module
create table public.lecons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  formation_id uuid references public.formations(id) on delete cascade not null,
  title text not null,
  type text default 'video', -- video, texte, quiz
  video_url text, -- Bunny.net (Phase 3)
  content text, -- contenu texte/MDX
  duration_minutes integer default 0,
  position integer not null default 0,
  is_free_preview boolean default false,
  created_at timestamptz default now()
);

-- Inscriptions
create table public.inscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  formation_id uuid references public.formations(id) on delete cascade not null,
  status text default 'pending', -- pending, active, completed, cancelled
  payment_status text default 'unpaid', -- unpaid, paid, refunded
  payment_reference text, -- référence CinetPay (Phase 2)
  amount_paid integer default 0,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, formation_id)
);

-- Progression des leçons
create table public.progression (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lecon_id uuid references public.lecons(id) on delete cascade not null,
  formation_id uuid references public.formations(id) on delete cascade not null,
  completed boolean default false,
  watch_time_seconds integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, lecon_id)
);

-- Certificats
create table public.certificats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  formation_id uuid references public.formations(id) on delete cascade not null,
  certificate_number text unique not null,
  issued_at timestamptz default now(),
  pdf_url text,
  unique(user_id, formation_id)
);

-- Vue: progression globale par formation
create or replace view public.formation_progress as
select
  i.user_id,
  i.formation_id,
  f.title as formation_title,
  count(l.id) as total_lessons,
  count(p.id) filter (where p.completed = true) as completed_lessons,
  case
    when count(l.id) = 0 then 0
    else round((count(p.id) filter (where p.completed = true)::numeric / count(l.id)) * 100)
  end as progress_percent
from public.inscriptions i
join public.formations f on f.id = i.formation_id
left join public.lecons l on l.formation_id = i.formation_id
left join public.progression p on p.lecon_id = l.id and p.user_id = i.user_id
group by i.user_id, i.formation_id, f.title;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.formations enable row level security;
alter table public.modules enable row level security;
alter table public.lecons enable row level security;
alter table public.inscriptions enable row level security;
alter table public.progression enable row level security;
alter table public.certificats enable row level security;

-- Politiques profiles
create policy "Profil visible par le propriétaire" on public.profiles
  for select using (auth.uid() = id);
create policy "Profil modifiable par le propriétaire" on public.profiles
  for update using (auth.uid() = id);
create policy "Profil créé à l'inscription" on public.profiles
  for insert with check (auth.uid() = id);

-- Politiques formations (publiques en lecture)
create policy "Formations publiées visibles par tous" on public.formations
  for select using (is_published = true);

-- Politiques modules et leçons (publics en lecture)
create policy "Modules visibles par tous" on public.modules
  for select using (true);
create policy "Leçons visibles par tous" on public.lecons
  for select using (true);

-- Politiques inscriptions
create policy "Inscriptions visibles par le propriétaire" on public.inscriptions
  for select using (auth.uid() = user_id);
create policy "Inscription créée par l'utilisateur" on public.inscriptions
  for insert with check (auth.uid() = user_id);

-- Politiques progression
create policy "Progression visible par le propriétaire" on public.progression
  for select using (auth.uid() = user_id);
create policy "Progression modifiable par le propriétaire" on public.progression
  for all using (auth.uid() = user_id);

-- Politiques certificats
create policy "Certificats visibles par le propriétaire" on public.certificats
  for select using (auth.uid() = user_id);

-- Trigger: créer profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
