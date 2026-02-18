import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getConversationsForUser,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  getOtherParticipant,
  type Conversation,
  type Message,
} from '../lib/messages'

export default function Mesajlar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { doctorId?: number; doctorName?: string } | null

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [initOpen, setInitOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/giris', { replace: true })
      return
    }
    setConversations(getConversationsForUser(user.id))
  }, [user, navigate])

  useEffect(() => {
    if (!user || !state?.doctorId || initOpen) return
    const conv = getOrCreateConversation(user.id, user.name, String(state.doctorId), state.doctorName || 'Doktor')
    setConversations(getConversationsForUser(user.id))
    setSelectedConv(conv)
    setMessages(getMessages(conv.id))
    setInitOpen(true)
    window.history.replaceState({}, '', '/mesajlar')
  }, [user, state, initOpen])

  useEffect(() => {
    if (selectedConv) setMessages(getMessages(selectedConv.id))
  }, [selectedConv])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedConv || !input.trim()) return
    const other = getOtherParticipant(selectedConv, user.id)
    if (!other) return
    sendMessage(selectedConv.id, user.id, other.userId, input)
    setMessages(getMessages(selectedConv.id))
    setInput('')
    setConversations(getConversationsForUser(user.id))
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Giriş yapılıyor...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl font-800 text-slate-900 mb-6">Mesajlar</h1>

      <div className="flex flex-col sm:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[400px]">
        <div className="w-full sm:w-72 shrink-0 rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm font-600 text-slate-700">Sohbetler</p>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <li className="p-4 text-slate-500 text-sm">Henüz mesajlaşma yok. Bir doktordan veya kullanıcıdan mesaj başlatın.</li>
            ) : (
              conversations.map((c) => {
                const other = getOtherParticipant(c, user.id)
                if (!other) return null
                const isSelected = selectedConv?.id === c.id
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => { setSelectedConv(c); setMessages(getMessages(c.id)) }}
                      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-diapal-50 border-l-4 border-l-diapal-500' : ''}`}
                    >
                      <p className="font-600 text-slate-900 truncate">{other.userName}</p>
                      <p className="text-xs text-slate-500 truncate">{new Date(c.updatedAt).toLocaleString('tr-TR')}</p>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Sohbet seçin veya bir doktor profilinden &quot;Mesaj at&quot; ile başlatın.
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <p className="font-600 text-slate-900">
                  {getOtherParticipant(selectedConv, user.id)?.userName ?? 'Sohbet'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMe = m.fromUserId === user.id
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          isMe ? 'bg-diapal-600 text-white' : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-diapal-200' : 'text-slate-500'}`}>
                          {new Date(m.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesaj yazın..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-diapal-500 focus:ring-2 focus:ring-diapal-100 outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 disabled:opacity-50"
                >
                  Gönder
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
