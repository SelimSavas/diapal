-- Admin: makaleler (Makaleler sayfası)
create table if not exists admin_articles (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  category text not null,
  content text not null,
  date text not null,
  read_minutes integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Admin: haberler ve duyurular
create table if not exists admin_news (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null,
  date text not null,
  type text not null check (type in ('haber', 'duyuru')),
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Admin: yemek tarifleri
create table if not exists admin_recipes (
  id text primary key,
  name text not null,
  category text not null,
  short_desc text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site ayarları (key-value)
create table if not exists site_settings (
  key text primary key,
  value text
);

create index if not exists idx_admin_articles_date on admin_articles(date desc);
create index if not exists idx_admin_articles_slug on admin_articles(slug);
create index if not exists idx_admin_news_date on admin_news(date desc);
create index if not exists idx_admin_news_slug on admin_news(slug);
create index if not exists idx_admin_news_type on admin_news(type);
create index if not exists idx_admin_recipes_category on admin_recipes(category);
