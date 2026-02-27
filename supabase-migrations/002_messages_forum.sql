-- Mesajlar: sohbetler ve mesajlar
create table if not exists conversations (
  id text primary key,
  user1_id text not null,
  user2_id text not null,
  user1_name text not null,
  user2_name text not null,
  updated_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references conversations(id) on delete cascade,
  from_user_id text not null,
  to_user_id text not null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation on messages(conversation_id);
create index if not exists idx_conversations_user1 on conversations(user1_id);
create index if not exists idx_conversations_user2 on conversations(user2_id);

-- Forum: konular ve yanıtlar
create table if not exists forum_topics (
  id text primary key,
  title text not null,
  category text not null,
  author_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists forum_replies (
  id text primary key,
  topic_id text not null references forum_topics(id) on delete cascade,
  author_id text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists idx_forum_replies_topic on forum_replies(topic_id);
create index if not exists idx_forum_topics_created on forum_topics(created_at desc);
