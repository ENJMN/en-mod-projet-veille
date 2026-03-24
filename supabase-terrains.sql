-- WAYS Build — Table Terrains
-- À exécuter dans Supabase SQL Editor

create table public.terrains (
  id uuid default uuid_generate_v4() primary key,
  titre text not null,
  zone text not null,
  commune text not null,
  localisation text not null,
  surface integer not null,
  prix bigint not null,
  prix_negociable boolean default false,
  description text,
  notes_libres text,
  titre_propriete text not null default 'CF',
  type_zone text not null default 'intérieur',
  viabilisation text[] default '{}',
  caracteristiques text[] default '{}',
  images text[] default '{}',
  gps text,
  disponible boolean default true,
  statut text not null default 'disponible',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pas de RLS pour cette table (contenu géré uniquement par l'admin via service_role)
-- Les opérations publiques (lecture) sont faites depuis le serveur avec service_role également

-- Index utiles pour les filtres
create index terrains_commune_idx on public.terrains(commune);
create index terrains_zone_idx on public.terrains(zone);
create index terrains_statut_idx on public.terrains(statut);
create index terrains_disponible_idx on public.terrains(disponible);

-- Trigger updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger terrains_updated_at
  before update on public.terrains
  for each row execute procedure public.handle_updated_at();

-- Données initiales (migration depuis terrains.json)
insert into public.terrains (titre, zone, commune, localisation, surface, prix, prix_negociable, description, notes_libres, titre_propriete, type_zone, viabilisation, caracteristiques, images, gps, disponible, statut)
values
  (
    'Terrain résidentiel — Cocody Riviera 3', 'Abidjan', 'Cocody',
    'Riviera 3, près du carrefour Akwaba, Abidjan', 600, 45000000, false,
    'Beau terrain plat, entièrement viabilisé, dans un quartier résidentiel calme et sécurisé. Idéal pour la construction d''une villa ou d''un petit immeuble R+2. Accès par voie bitumée. Voisinage de standing.',
    'Dossier complet disponible sur demande. Possibilité de visite sur rendez-vous du lundi au samedi.',
    'CF', 'intérieur', ARRAY['eau','électricité','voirie'], ARRAY['Terrain plat','Quartier résidentiel','Accès bitumé','Bornage effectué'],
    '{}', '', true, 'disponible'
  ),
  (
    'Terrain commercial — Yopougon Selmer', 'Abidjan', 'Yopougon',
    'Yopougon Selmer, bord de la voie principale, Abidjan', 1200, 35000000, true,
    'Grand terrain en bordure de route principale à fort passage journalier. Idéal pour activité commerciale, entrepôt, station-service ou immeuble de rapport.',
    'Prix négociable pour acquisition rapide. Possibilité de paiement échelonné à discuter.',
    'ACD', 'intérieur', ARRAY['eau','électricité','voirie'], ARRAY['Bord de route','Fort passage','Usage commercial possible','Grande surface'],
    '{}', '', true, 'disponible'
  ),
  (
    'Terrain balnéaire — Grand-Bassam Quartier France', 'Grand-Bassam', 'Grand-Bassam',
    'Quartier France, à 300 m de la plage, Grand-Bassam', 800, 28000000, false,
    'Terrain en zone balnéaire classée UNESCO, à quelques minutes à pied de la plage. Environnement verdoyant, idéal pour villa de vacances, maison d''hôtes ou projet touristique.',
    'Zone à fort potentiel touristique. Possibilité de construire jusqu''en R+1 selon le PLU local.',
    'CF', 'balnéaire', ARRAY['eau','électricité'], ARRAY['Zone UNESCO','Proche plage','Potentiel touristique','Environnement calme'],
    '{}', '', true, 'disponible'
  ),
  (
    'Lotissement en préfinancement — Bingerville Est', 'Abidjan', 'Bingerville',
    'Bingerville Est, zone en cours d''aménagement', 500, 18000000, false,
    'Parcelles disponibles dans un nouveau lotissement en cours de viabilisation. Prix attractifs de préfinancement. Infrastructure eau et électricité prévue à livraison.',
    'Livraison viabilisée estimée : T4 2026. Plans de masse disponibles sur demande. Réservation possible avec acompte de 30%.',
    'CPF', 'intérieur', '{}', ARRAY['Nouveau lotissement','20 min du Plateau','Parcelles bornées','Plan de masse disponible'],
    '{}', '', true, 'préfinancement'
  );
