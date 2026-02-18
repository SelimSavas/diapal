import { useState, useRef, useEffect } from 'react'
import { getAssistantReply } from '../lib/assistant'

type Message = { role: 'user' | 'bot'; text: string }

function formatBotMessage(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**')
    if (boldStart === -1) {
      parts.push(
        <span key={key++}>
          {remaining.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < remaining.split('\n').length - 1 && <br />}
            </span>
          ))}
        </span>
      )
      break
    }
    if (boldStart > 0) {
      const before = remaining.slice(0, boldStart)
      parts.push(
        <span key={key++}>
          {before.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </span>
      )
    }
    remaining = remaining.slice(boldStart + 2)
    const boldEnd = remaining.indexOf('**')
    if (boldEnd === -1) {
      parts.push(remaining)
      break
    }
    parts.push(<strong key={key++}>{remaining.slice(0, boldEnd)}</strong>)
    remaining = remaining.slice(boldEnd + 2)
  }
  return <>{parts}</>
}

export default function DiapalAsistan() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => {
    if (open && messages.length) scrollToBottom()
  }, [open, messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    const reply = getAssistantReply(text)
    setMessages((prev) => [...prev, { role: 'bot', text: reply }])
  }

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          className="fixed left-4 right-4 sm:left-auto sm:right-4 sm:w-[calc(100vw-2rem)] z-[100] max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden"
          style={{
            height: 'min(70vh, 520px)',
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-diapal-600 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>💬</span>
              <span className="font-700">Diapal Asistan</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Asistanı kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
            Beslenme ve yaşam kalitesiyle ilgili sorularınızı yanıtlar; tıbbi tavsiye vermez.
          </p>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-6">
                Merhaba! Ara öğün, kahvaltı veya yemek fikirleri için bir şey yazın.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-diapal-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {msg.role === 'bot' ? formatBotMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Örn: Ara öğünde ne yiyebilirim?"
                className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-diapal-400 focus:border-diapal-400"
                aria-label="Mesaj yazın"
              />
              <button
                type="submit"
                className="rounded-xl bg-diapal-600 text-white px-4 py-2.5 text-sm font-600 hover:bg-diapal-700 transition-colors disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-4 z-[99] flex items-center gap-2 rounded-full bg-diapal-600 text-white px-4 py-3 min-h-[48px] shadow-lg hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label={open ? 'Asistanı kapat' : 'Diapal Asistanı aç'}
      >
        <span className="text-xl" aria-hidden>💬</span>
        <span className="font-600 text-sm hidden sm:inline">Diapal Asistan</span>
      </button>
    </>
  )
}
