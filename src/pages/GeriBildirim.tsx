import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addFeedback, type FeedbackType } from '../lib/feedback'

export default function GeriBildirim() {
  const [type, setType] = useState<FeedbackType>('sorun')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    addFeedback(type, subject, message, email)
    setSent(true)
    setSubject('')
    setMessage('')
    setEmail('')
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="rounded-2xl border border-diapal-200 bg-diapal-50 p-8 text-center">
          <h1 className="text-xl font-700 text-slate-900">Gönderildi</h1>
          <p className="mt-3 text-slate-600 text-sm">
            Geri bildiriminiz alındı. İnceledikten sonra gerekirse dönüş yapacağız.
          </p>
          <Link to="/" className="mt-6 inline-block text-diapal-600 font-600 hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-800 text-slate-900">Geri bildirim</h1>
        <p className="mt-2 text-slate-600">
          Bir sorun mu yaşadınız veya öneriniz mi var? Bize yazın.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-500 text-slate-700 mb-2">Tür</label>
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setType('sorun')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-600 transition-colors ${
                type === 'sorun' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Sorun bildir
            </button>
            <button
              type="button"
              onClick={() => setType('oneri')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-600 transition-colors ${
                type === 'oneri' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Öneri gönder
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-500 text-slate-700 mb-1.5">Konu (isteğe bağlı)</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 outline-none"
            placeholder="Örn: Sayfa açılmıyor, özellik önerisi"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-500 text-slate-700 mb-1.5">Mesajınız *</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 outline-none resize-y"
            placeholder="Sorununuzu veya önerinizi kısaca yazın..."
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-500 text-slate-700 mb-1.5">E-posta (dönüş için, isteğe bağlı)</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 outline-none"
            placeholder="ornek@email.com"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700"
        >
          Gönder
        </button>
      </form>

      <p className="mt-6 text-center text-slate-500 text-sm">
        <Link to="/iletisim" className="text-diapal-600 font-500 hover:underline">İletişim sayfası</Link>
      </p>
    </div>
  )
}
