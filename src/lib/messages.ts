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

const CONVERSATIONS_KEY = 'diapal_conversations'
const MESSAGES_KEY = 'diapal_messages'

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveConversations(c: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(c))
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveMessages(m: Message[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(m))
}

function makeConvId(id1: string, id2: string): string {
  return [id1, id2].sort().join('_')
}

export function getOrCreateConversation(
  userId1: string,
  userName1: string,
  userId2: string,
  userName2: string
): Conversation {
  const convId = makeConvId(userId1, userId2)
  const convs = loadConversations()
  let conv = convs.find(
    (c) =>
      c.participants.some((p) => p.userId === userId1) && c.participants.some((p) => p.userId === userId2)
  )
  if (conv) return conv
  conv = {
    id: convId,
    participants: [
      { userId: userId1, userName: userName1 },
      { userId: userId2, userName: userName2 },
    ],
    updatedAt: new Date().toISOString(),
  }
  convs.push(conv)
  saveConversations(convs)
  return conv
}

export function getConversationsForUser(userId: string): Conversation[] {
  return loadConversations()
    .filter((c) => c.participants.some((p) => p.userId === userId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function getMessages(conversationId: string): Message[] {
  return loadMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function sendMessage(
  conversationId: string,
  fromUserId: string,
  toUserId: string,
  body: string
): Message {
  const messages = loadMessages()
  const msg: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    conversationId,
    fromUserId,
    toUserId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  }
  messages.push(msg)
  saveMessages(messages)
  const convs = loadConversations()
  const conv = convs.find((c) => c.id === conversationId)
  if (conv) {
    conv.updatedAt = msg.createdAt
    saveConversations(convs)
  }
  return msg
}

export function getOtherParticipant(conv: Conversation, currentUserId: string): { userId: string; userName: string } | null {
  return conv.participants.find((p) => p.userId !== currentUserId) ?? null
}
