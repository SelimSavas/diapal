import { supabase } from './supabaseClient'

export type Message = {
  id: string
  conversationId: string
  fromUserId: string
  toUserId: string
  body: string
  createdAt: string
}

export type Conversation = {
  id: string
  participants: { userId: string; userName: string }[]
  updatedAt: string
}

function makeConvId(id1: string, id2: string): string {
  return [id1, id2].sort().join('_')
}

function rowToConversation(r: {
  id: string
  user1_id: string
  user2_id: string
  user1_name: string
  user2_name: string
  updated_at: string
}): Conversation {
  return {
    id: r.id,
    participants: [
      { userId: r.user1_id, userName: r.user1_name },
      { userId: r.user2_id, userName: r.user2_name },
    ],
    updatedAt: r.updated_at,
  }
}

export async function getOrCreateConversation(
  userId1: string,
  userName1: string,
  userId2: string,
  userName2: string
): Promise<Conversation> {
  const convId = makeConvId(userId1, userId2)
  const [u1, u2] = [userId1, userId2].sort()
  const u1Name = u1 === userId1 ? userName1 : userName2
  const u2Name = u2 === userId2 ? userName2 : userName1

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', convId)
    .maybeSingle()

  if (existing) return rowToConversation(existing)

  await supabase.from('conversations').insert({
    id: convId,
    user1_id: u1,
    user2_id: u2,
    user1_name: u1Name,
    user2_name: u2Name,
    updated_at: new Date().toISOString(),
  })

  const { data: created } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', convId)
    .single()

  return rowToConversation(created!)
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }
  return (data ?? []).map(rowToConversation)
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, from_user_id, to_user_id, body, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    conversationId: r.conversation_id,
    fromUserId: r.from_user_id,
    toUserId: r.to_user_id,
    body: r.body,
    createdAt: r.created_at,
  }))
}

export async function sendMessage(
  conversationId: string,
  fromUserId: string,
  toUserId: string,
  body: string
): Promise<Message> {
  const { data: inserted, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      body: body.trim(),
    })
    .select('id, conversation_id, from_user_id, to_user_id, body, created_at')
    .single()

  if (error) throw error

  await supabase
    .from('conversations')
    .update({ updated_at: inserted!.created_at })
    .eq('id', conversationId)

  return {
    id: inserted!.id,
    conversationId: inserted!.conversation_id,
    fromUserId: inserted!.from_user_id,
    toUserId: inserted!.to_user_id,
    body: inserted!.body,
    createdAt: inserted!.created_at,
  }
}

export function getOtherParticipant(
  conv: Conversation,
  currentUserId: string
): { userId: string; userName: string } | null {
  return conv.participants.find((p) => p.userId !== currentUserId) ?? null
}
