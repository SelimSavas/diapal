-- Forum: konu beğenileri, yanıt beğenileri, abonelikler, en iyi yanıt

-- Konu beğenileri (topic_id, user_id)
create table if not exists forum_topic_likes (
  topic_id text not null references forum_topics(id) on delete cascade,
  user_id text not null,
  primary key (topic_id, user_id)
);

-- Yanıt beğenileri (reply_id, user_id)
create table if not exists forum_reply_likes (
  reply_id text not null references forum_replies(id) on delete cascade,
  user_id text not null,
  primary key (reply_id, user_id)
);

-- Konu abonelikleri (takip)
create table if not exists forum_topic_subscriptions (
  topic_id text not null references forum_topics(id) on delete cascade,
  user_id text not null,
  primary key (topic_id, user_id)
);

-- En iyi yanıt: forum_topics tablosuna sütun ekle
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'forum_topics' and column_name = 'best_reply_id'
  ) then
    alter table forum_topics add column best_reply_id text references forum_replies(id) on delete set null;
  end if;
end $$;

create index if not exists idx_forum_topic_likes_topic on forum_topic_likes(topic_id);
create index if not exists idx_forum_topic_likes_user on forum_topic_likes(user_id);
create index if not exists idx_forum_reply_likes_reply on forum_reply_likes(reply_id);
create index if not exists idx_forum_reply_likes_user on forum_reply_likes(user_id);
create index if not exists idx_forum_subscriptions_topic on forum_topic_subscriptions(topic_id);
create index if not exists idx_forum_subscriptions_user on forum_topic_subscriptions(user_id);
