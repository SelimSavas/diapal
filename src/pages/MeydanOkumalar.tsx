import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  DAILY_CHALLENGES,
  BADGES,
  toggleChallenge,
  getCurrentStreak,
  getTotalPoints,
  ensureProgressLoaded,
  type UserChallengeProgress,
} from '../lib/challenges'

const TODAY = new Date().toISOString().slice(0, 10)

export default function MeydanOkumalar() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserChallengeProgress | null>(null)

  useEffect(() => {
    if (!user) {
      setProgress(null)
      return
    }
    ensureProgressLoaded(user.id).then((p) => setProgress(p))
  }, [user])

  const streak = useMemo(() => (progress ? getCurrentStreak(progress.history) : 0), [progress])
  const totalPoints = useMemo(() => (progress ? getTotalPoints(progress) : 0), [progress])

  const handleToggle = (challengeId: string) => {
    if (!user) return
    const next = toggleChallenge(user.id, challengeId)
    setProgress(next)
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-800 text-slate-900 mb-4">Meydan okumalar</h1>
        <p className="text-slate-600 mb-6">İlerlemeni kaydetmek için giriş yapmalısın.</p>
        <Link to="/giris" className="inline-block rounded-xl bg-diapal-600 px-5 py-2.5 text-white font-600 hover:bg-diapal-700">
          Giriş yap
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Meydan okumalar
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Günlük küçük hedeflerle kan şekeri ve yaşam kaliteni destekle. Tamamladıkça puan ve rozet kazan.
        </p>
      </header>

      {/* Özet */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-2xl bg-diapal-50 border border-diapal-100 p-5">
          <p className="text-sm font-600 text-diapal-700">Bugün tamamlanan</p>
          <p className="text-2xl font-800 text-diapal-900 mt-1">{progress?.completedToday.length ?? 0} / {DAILY_CHALLENGES.length}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
          <p className="text-sm font-600 text-amber-700">Günlük seri</p>
          <p className="text-2xl font-800 text-amber-900 mt-1">{streak} gün</p>
        </div>
        <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5 col-span-2 sm:col-span-1">
          <p className="text-sm font-600 text-slate-700">Toplam puan</p>
          <p className="text-2xl font-800 text-slate-900 mt-1">{totalPoints}</p>
        </div>
      </div>

      {/* Bugünkü meydan okumalar */}
      <section className="mb-12">
        <h2 className="text-xl font-700 text-slate-900 mb-4">Bugünkü hedefler ({TODAY})</h2>
        <ul className="space-y-3">
          {DAILY_CHALLENGES.map((c) => {
            const done = progress?.completedToday.includes(c.id) ?? false
            return (
              <li
                key={c.id}
                className={`rounded-2xl border p-4 flex items-center gap-4 ${
                  done ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-600 text-slate-900">{c.title}</h3>
                  <p className="text-sm text-slate-600">{c.description}</p>
                  <span className="text-xs text-slate-500">{c.points} puan</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(c.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-500 transition-colors ${
                    done
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {done ? 'Tamamlandı ✓' : 'Tamamla'}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Rozetler */}
      <section>
        <h2 className="text-xl font-700 text-slate-900 mb-4">Rozetler</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b) => {
            const earned = progress?.earnedBadges.includes(b.id) ?? false
            return (
              <div
                key={b.id}
                className={`rounded-2xl border p-4 flex items-center gap-4 ${
                  earned ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <span className="text-3xl">{b.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-600 text-slate-900">{b.name}</h3>
                  <p className="text-sm text-slate-600">{b.description}</p>
                  <p className="text-xs text-slate-500">{b.requirement}</p>
                </div>
                {earned && <span className="shrink-0 text-amber-600 font-600 text-sm">✓</span>}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
