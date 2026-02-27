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
import { ensureDoctorPatient } from '../lib/doctorProfiles'

export default function Mesajlar() {
  const { user, getUsersPublicWithRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    doctorId?: string | number
    doctorName?: string
    patientId?: string
    patientName?: string
  } | null

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [initOpen, setInitOpen] = useState(false)
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/giris', { replace: true })
      return
    }
    let cancelled = false
    setLoadingConv(true)
    getConversationsForUser(user.id).then((list) => {
      if (!cancelled) {
        setConversations(list)
        setLoadingConv(false)
      }
    })
    return () => { cancelled = true }
  }, [user, navigate])

  useEffect(() => {
    const fromDoctor = state?.doctorId && user
    const fromPatient = state?.patientId && user?.role === 'doktor'
    if (!user || (!fromDoctor && !fromPatient) || initOpen) return
    let cancelled = false
    const [id1, name1, id2, name2] = fromDoctor
      ? [user.id, user.name, String(state.doctorId), state.doctorName || 'Doktor']
      : [user.id, user.name, state!.patientId!, state!.patientName || 'Üye']
    getOrCreateConversation(id1, name1, id2, name2).then((conv) => {
      if (cancelled) return
      if (fromDoctor) ensureDoctorPatient(String(state!.doctorId), user.id, user.name).catch(() => {})
      setSelectedConv(conv)
      setConversations((prev) => {
        const has = prev.some((c) => c.id === conv.id)
        if (has) return prev
        return [conv, ...prev]
      })
      setInitOpen(true)
      window.history.replaceState({}, '', '/mesajlar')
      return getMessages(conv.id)
    }).then((msgs) => {
      if (msgs && !cancelled) setMessages(msgs)
    }).catch(() => {})
    getConversationsForUser(user.id).then((list) => { if (!cancelled) setConversations(list) })
    return () => { cancelled = true }
  }, [user, state?.doctorId, state?.doctorName, state?.patientId, state?.patientName, initOpen])

  useEffect(() => {
    if (!selectedConv) {
      setMessages([])
      return
    }
    let cancelled = false
    setLoadingMsg(true)
    getMessages(selectedConv.id).then((msgs) => {
      if (!cancelled) {
        setMessages(msgs)
        setLoadingMsg(false)
      }
    })
    return () => { cancelled = true }
  }, [selectedConv?.id])

  useEffect(() => {
    if (!user || user.role !== 'doktor' || !selectedConv) return
    const other = getOtherParticipant(selectedConv, user.id)
    if (!other) return
    const byRole = getUsersPublicWithRole().find((u) => u.id === other.userId)
    if (byRole?.role === 'hasta') {
      ensureDoctorPatient(user.id, other.userId, other.userName).catch(() => {})
    }
  }, [user, selectedConv, getUsersPublicWithRole])

  const handleSelectConv = (c: Conversation) => {
    setSelectedConv(c)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedConv || !input.trim()) return
    const other = getOtherParticipant(selectedConv, user.id)
    if (!other) return
    const text = input
    setInput('')
    setSending(true)
    try {
      const msg = await sendMessage(selectedConv.id, user.id, other.userId, text)
      setMessages((prev) => [...prev, msg])
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConv.id ? { ...c, updatedAt: msg.createdAt } : c)).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      )
    } catch (err) {
      setInput(text)
      console.error(err)
    } finally {
      setSending(false)
    }
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
            {loadingConv ? (
              <li className="p-4 text-slate-500 text-sm">Yükleniyor...</li>
            ) : conversations.length === 0 ? (
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
                      onClick={() => handleSelectConv(c)}
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
                {loadingMsg ? (
                  <p className="text-slate-500 text-sm">Yükleniyor...</p>
                ) : (
                  messages.map((m) => {
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
                  })
                )}
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
                  disabled={!input.trim() || sending}
                  className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 disabled:opacity-50"
                >
                  {sending ? 'Gönderiliyor…' : 'Gönder'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
