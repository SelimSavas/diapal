import { useState } from 'react'
import { Link } from 'react-router-dom'

type FormType = 'iletisim' | 'randevu'

export default function Iletisim() {
  const [formType, setFormType] = useState<FormType>('iletisim')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    doctorName: '',
    preferredDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: sadece state ile "gönderildi" göster; gerçekte backend'e POST atılır
    setSubmitted(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <header className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900 tracking-tight">
          İletişim
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Sorularınız, önerileriniz veya randevu talebiniz için formu doldurun veya doğrudan arayın / yazın.
        </p>
      </header>

      {/* Form seçimi */}
      <div className="flex rounded-xl border border-slate-200 p-1 mb-8 bg-slate-50">
        <button
          type="button"
          onClick={() => { setFormType('iletisim'); setSubmitted(false) }}
          className={`flex-1 py-3 min-h-[44px] rounded-lg text-sm font-600 transition-colors touch-manipulation ${
            formType === 'iletisim' ? 'bg-white text-diapal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Genel iletişim
        </button>
        <button
          type="button"
          onClick={() => { setFormType('randevu'); setSubmitted(false) }}
          className={`flex-1 py-3 min-h-[44px] rounded-lg text-sm font-600 transition-colors touch-manipulation ${
            formType === 'randevu' ? 'bg-white text-diapal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Randevu talebi
        </button>
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-diapal-200 bg-diapal-50 p-6 text-center">
          <p className="text-diapal-800 font-600">Mesajınız alındı.</p>
          <p className="mt-2 text-sm text-diapal-700">
            En kısa sürede dönüş yapacağız.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-500 text-diapal-600 hover:underline"
          >
            Yeni mesaj gönder
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-500 text-slate-700 mb-1.5">Ad soyad *</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none"
                placeholder="Adınız soyadınız"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-500 text-slate-700 mb-1.5">E-posta *</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none"
                placeholder="ornek@email.com"
              />
            </div>
            {formType === 'iletisim' && (
              <div>
                <label htmlFor="subject" className="block text-sm font-500 text-slate-700 mb-1.5">Konu</label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none"
                  placeholder="Örn: Hesap sorunu, öneri"
                />
              </div>
            )}
            {formType === 'randevu' && (
              <>
                <div>
                  <label htmlFor="doctorName" className="block text-sm font-500 text-slate-700 mb-1.5">İlgilendiğiniz doktor (isteğe bağlı)</label>
                  <input
                    id="doctorName"
                    type="text"
                    value={form.doctorName}
                    onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none"
                    placeholder="Doktor Bul sayfasından seçtiğiniz isim"
                  />
                </div>
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-500 text-slate-700 mb-1.5">Tercih ettiğiniz tarih / not</label>
                  <input
                    id="preferredDate"
                    type="text"
                    value={form.preferredDate}
                    onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none"
                    placeholder="Örn: Önümüzdeki hafta, sabah"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="message" className="block text-sm font-500 text-slate-700 mb-1.5">Mesajınız *</label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-diapal-500 focus:border-diapal-500 outline-none resize-y"
                placeholder={formType === 'randevu' ? 'Randevu talebinizi kısaca yazın...' : 'Sorunuzu veya önerinizi yazın...'}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 min-h-[48px] rounded-xl bg-diapal-600 text-white font-600 hover:bg-diapal-700 active:bg-diapal-800 transition-colors touch-manipulation"
            >
              {formType === 'randevu' ? 'Randevu talebini gönder' : 'Gönder'}
            </button>
          </div>
        </form>
      )}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-diapal-50 to-diapal-100/50 px-6 py-6 border-b border-diapal-100">
          <h2 className="text-lg font-700 text-slate-900">Destek hattı</h2>
          <p className="mt-1 text-sm text-slate-600">Doğrudan arayıp yazabilirsiniz.</p>
        </div>
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-diapal-100 text-diapal-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-500 text-slate-500">Telefon</p>
              <a href="tel:0850000000" className="mt-1 text-xl font-700 text-slate-900 hover:text-diapal-600 transition-colors">
                0850 000 00 00
              </a>
              <p className="mt-1 text-sm text-slate-600">Hafta içi 09:00 – 18:00</p>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-diapal-100 text-diapal-700">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-500 text-slate-500">E-posta</p>
                <a href="mailto:diapal@gmail.com" className="mt-1 text-xl font-700 text-slate-900 hover:text-diapal-600 transition-colors break-all">
                  diapal@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <p className="font-600">Önemli</p>
        <p className="mt-1 text-amber-800/90">
          Destek hattı tıbbi acil veya ilaç dozu yerine geçmez. Acil durumda 112; tedavi için hekiminize danışın.
        </p>
      </div>

      <p className="mt-10 text-center text-slate-500 text-sm">
        <Link to="/sss" className="text-diapal-600 font-500 hover:underline">SSS</Link>
        {' · '}
        <Link to="/" className="text-diapal-600 font-500 hover:underline">Ana sayfa</Link>
      </p>
    </div>
  )
}
