import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  DAILY_CHALLENGES,
  toggleChallenge,
  getProgressForDisplay,
  type UserChallengeProgress,
} from '../lib/challenges'

export default function GunlukGorevlerWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<UserChallengeProgress | null>(null)

  useEffect(() => {
    if (user) setProgress(getProgressForDisplay(user.id))
  }, [user])

  const handleToggle = (challengeId: string) => {
    if (!user) return
    const next = toggleChallenge(user.id, challengeId)
    setProgress(next)
  }

  const completedCount = progress?.completedToday.length ?? 0
  const totalCount = DAILY_CHALLENGES.length
  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <>
      {open && (
        <div
          className="fixed left-4 z-[100] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-slate-200/80 bg-white shadow-xl flex flex-col overflow-hidden"
          style={{
            height: 'min(70vh, 420px)',
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-diapal-600 to-diapal-500 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>✅</span>
              <span className="font-700">Günlük Görevler</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-white/90 hover:bg-white/20 transition-colors"
              aria-label="Paneli kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            {!user ? (
              <div className="text-center py-6">
                <p className="text-slate-600 text-sm">Günlük görevlere erişmek için giriş yapın.</p>
                <Link
                  to="/kayit"
                  className="mt-4 inline-block rounded-xl bg-diapal-600 text-white px-4 py-2.5 text-sm font-600 hover:bg-diapal-700"
                  onClick={() => setOpen(false)}
                >
                  Kayıt ol / Giriş yap
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-xs font-600 text-slate-500 uppercase tracking-wider">Bugünkü ilerleme</p>
                  <p className="text-2xl font-800 text-slate-900 mt-0.5">{completedCount} / {totalCount} görev</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-diapal-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <ul className="space-y-2">
                  {DAILY_CHALLENGES.map((c) => {
                    const done = progress?.completedToday.includes(c.id) ?? false
                    return (
                      <li
                        key={c.id}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                          done ? 'bg-diapal-50 border border-diapal-100' : 'bg-white border border-slate-200 hover:border-diapal-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggle(c.id)}
                          className={`shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center text-sm font-700 transition-colors ${
                            done
                              ? 'bg-diapal-600 border-diapal-600 text-white'
                              : 'border-diapal-300 bg-white text-transparent hover:border-diapal-500'
                          }`}
                          aria-label={done ? `${c.title} tamamlandı` : c.title}
                        >
                          {done ? '✓' : ''}
                        </button>
                        <span className={`text-sm font-500 ${done ? 'text-diapal-700 line-through' : 'text-slate-800'}`}>
                          {c.icon} {c.title}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  to="/gunluk-gorevler"
                  className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-diapal-600 text-white py-3 text-sm font-600 hover:bg-diapal-700 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Tam sayfa ve rozetler
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed left-4 z-[99] flex items-center gap-2 rounded-full bg-white text-diapal-700 px-4 py-3 min-h-[48px] shadow-lg border border-diapal-200 hover:bg-diapal-50 hover:border-diapal-300 active:bg-diapal-100 transition-all touch-manipulation"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label={open ? 'Günlük görevleri kapat' : 'Günlük görevleri aç'}
      >
        <span className="text-xl" aria-hidden>✅</span>
        <span className="font-600 text-sm hidden sm:inline">Günlük Görevler</span>
      </button>
    </>
  )
}
