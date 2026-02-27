import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  DAILY_CHALLENGES,
  BADGES,
  toggleChallenge,
  ensureProgressLoaded,
  type UserChallengeProgress,
} from '../lib/challenges'

export default function GunlukGorevler() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [progress, setProgress] = useState<UserChallengeProgress | null>(null)

  useEffect(() => {
    if (!user) navigate('/kayit', { replace: true })
    else {
      ensureProgressLoaded(user.id).then((p) => setProgress(p))
    }
  }, [user, navigate])

  const handleToggle = (challengeId: string) => {
    if (!user) return
    const next = toggleChallenge(user.id, challengeId)
    setProgress(next)
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-diapal-100 flex items-center justify-center text-3xl mb-6">
            ✅
          </div>
          <h1 className="text-2xl font-800 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Günlük görevler ve rozetler için kayıt olmanız gerekiyor.
          </p>
          <Link
            to="/kayit"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-diapal-600 px-6 py-3.5 text-white font-600 hover:bg-diapal-700 shadow-lg shadow-diapal-600/25 transition-all"
          >
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  if (progress === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="w-10 h-10 rounded-full border-2 border-diapal-300 border-t-diapal-600 animate-spin" />
        Yükleniyor...
      </div>
    )
  }

  const completedCount = progress.completedToday.length
  const totalPoints = progress.completedToday.reduce((sum, id) => {
    const c = DAILY_CHALLENGES.find((x) => x.id === id)
    return sum + (c?.points ?? 0)
  }, 0)
  const progressPercent = (completedCount / DAILY_CHALLENGES.length) * 100
  const earnedBadgeList = BADGES.filter((b) => progress.earnedBadges.includes(b.id))
  const lockedBadgeList = BADGES.filter((b) => !progress.earnedBadges.includes(b.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-diapal-600 via-diapal-500 to-emerald-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.2),transparent)]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-600 mb-6">
            Üyelere özel
          </div>
          <h1 className="text-3xl md:text-4xl font-800 tracking-tight">
            Günlük görevler
          </h1>
          <p className="mt-3 text-diapal-50 text-lg max-w-xl">
            Her gün küçük hedeflerle ilerle, rozet kazan. Diyabet yönetiminde motivasyon seninle.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-16">
        {/* İlerleme kartı */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-600 text-slate-500 uppercase tracking-wider">Bugünkü ilerleme</p>
              <p className="text-3xl font-800 text-slate-900 mt-1">
                {completedCount} <span className="text-slate-400 font-600">/ {DAILY_CHALLENGES.length}</span> görev
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-600 text-slate-500 uppercase tracking-wider">Puan</p>
                <p className="text-2xl font-800 text-diapal-600">{totalPoints}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-diapal-100 flex items-center justify-center text-diapal-700 font-800 text-lg">
                {progressPercent >= 100 ? '✓' : `${Math.round(progressPercent)}%`}
              </div>
            </div>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-diapal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Görevler */}
        <section className="mb-12">
          <h2 className="text-xl font-800 text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Bugünün meydan okumaları
          </h2>
          <ul className="space-y-3">
            {DAILY_CHALLENGES.map((challenge) => {
              const done = progress.completedToday.includes(challenge.id)
              return (
                <li
                  key={challenge.id}
                  className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                    done
                      ? 'border-diapal-200 bg-diapal-50/80 shadow-inner'
                      : 'border-slate-200 bg-white hover:border-diapal-100 hover:shadow-md shadow-sm'
                  }`}
                >
                  <label className="flex cursor-pointer items-start gap-4">
                    <span
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${
                        done ? 'bg-diapal-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {done ? '✓' : challenge.icon}
                    </span>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => handleToggle(challenge.id)}
                      className="sr-only"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-700 text-base ${done ? 'text-diapal-800 line-through' : 'text-slate-900'}`}>
                        {challenge.title}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">{challenge.description}</p>
                      <p className="mt-2 text-xs font-600 text-diapal-600">+{challenge.points} puan</p>
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Rozetler */}
        <section>
          <h2 className="text-xl font-800 text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🏅</span>
            Rozetlerim
          </h2>
          <p className="text-slate-600 mb-6">
            Görevleri tamamladıkça yeni rozetler açılır. <strong>{earnedBadgeList.length} / {BADGES.length}</strong> rozet kazandın.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadgeList.map((badge) => (
              <div
                key={badge.id}
                className="rounded-2xl border-2 border-diapal-200 bg-gradient-to-br from-diapal-50 to-white p-4 text-center shadow-sm"
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="mt-2 text-sm font-700 text-slate-900">{badge.name}</p>
                <p className="mt-0.5 text-xs text-slate-600 leading-snug">{badge.description}</p>
              </div>
            ))}
            {lockedBadgeList.map((badge) => (
              <div
                key={badge.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center opacity-80"
              >
                <span className="text-3xl grayscale opacity-80">{badge.icon}</span>
                <p className="mt-2 text-sm font-600 text-slate-500">{badge.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{badge.requirement}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-center">
          <Link
            to="/profil"
            className="inline-flex items-center gap-2 text-diapal-600 font-600 hover:text-diapal-700 hover:underline"
          >
            ← Profile dön
          </Link>
        </p>
      </div>
    </div>
  )
}
