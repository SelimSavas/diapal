import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  DAILY_CHALLENGES,
  BADGES,
  toggleChallenge,
  getProgressForDisplay,
  type UserChallengeProgress,
} from '../lib/challenges'

export default function GunlukGorevler() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [progress, setProgress] = useState<UserChallengeProgress | null>(null)

  useEffect(() => {
    if (!user) navigate('/kayit', { replace: true })
    else setProgress(getProgressForDisplay(user.id))
  }, [user, navigate])

  const handleToggle = (challengeId: string) => {
    if (!user) return
    const next = toggleChallenge(user.id, challengeId)
    setProgress(next)
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-700 text-slate-900">Üyelere özel</h1>
          <p className="mt-3 text-slate-600">Günlük görevler ve rozetler için kayıt olmanız gerekiyor.</p>
          <Link to="/kayit" className="mt-6 inline-block rounded-xl bg-diapal-600 px-6 py-3 text-white font-600 hover:bg-diapal-700">
            Kayıt ol
          </Link>
        </div>
      </div>
    )
  }

  if (progress === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-500">
        Yükleniyor...
      </div>
    )
  }

  const completedCount = progress.completedToday.length
  const totalPoints = progress.completedToday.reduce((sum, id) => {
    const c = DAILY_CHALLENGES.find((x) => x.id === id)
    return sum + (c?.points ?? 0)
  }, 0)
  const earnedBadgeList = BADGES.filter((b) => progress.earnedBadges.includes(b.id))
  const lockedBadgeList = BADGES.filter((b) => !progress.earnedBadges.includes(b.id))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-diapal-100 text-diapal-800 px-3 py-1 text-xs font-600 mb-4">
          Üyelere özel
        </div>
        <h1 className="text-3xl md:text-4xl font-800 text-slate-900">
          Günlük görevler
        </h1>
        <p className="mt-2 text-slate-600">
          Her gün küçük hedeflerle ilerle, rozet kazan. Diyabet yönetiminde motivasyon seninle.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-500 text-slate-500">Bugünkü ilerleme</p>
            <p className="text-2xl font-800 text-slate-900 mt-0.5">
              {completedCount} / {DAILY_CHALLENGES.length} görev
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-500 text-slate-500">Bugünkü puan</p>
            <p className="text-2xl font-800 text-diapal-600">{totalPoints}</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-diapal-500 transition-all duration-300"
            style={{ width: `${(completedCount / DAILY_CHALLENGES.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-700 text-slate-900 mb-4">Bugünün meydan okumaları</h2>
        <ul className="space-y-3">
          {DAILY_CHALLENGES.map((challenge) => {
            const done = progress.completedToday.includes(challenge.id)
            return (
              <li
                key={challenge.id}
                className={`rounded-2xl border-2 p-4 transition-all ${
                  done ? 'border-diapal-200 bg-diapal-50' : 'border-slate-200 bg-white hover:border-diapal-100'
                }`}
              >
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => handleToggle(challenge.id)}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-diapal-600 focus:ring-diapal-500"
                  />
                  <span className="text-2xl shrink-0">{challenge.icon}</span>
                  <div className="min-w-0">
                    <p className={`font-600 ${done ? 'text-diapal-800 line-through' : 'text-slate-900'}`}>
                      {challenge.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">{challenge.description}</p>
                    <p className="mt-1 text-xs font-500 text-diapal-600">+{challenge.points} puan</p>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-700 text-slate-900 mb-4">Rozetlerim</h2>
        <p className="text-sm text-slate-600 mb-6">
          Görevleri tamamladıkça yeni rozetler açılır. {earnedBadgeList.length} / {BADGES.length} rozet kazandın.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {earnedBadgeList.map((badge) => (
            <div
              key={badge.id}
              className="rounded-2xl border-2 border-diapal-200 bg-diapal-50 p-4 text-center"
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="mt-2 text-sm font-700 text-slate-900">{badge.name}</p>
              <p className="mt-0.5 text-xs text-slate-600">{badge.description}</p>
            </div>
          ))}
          {lockedBadgeList.map((badge) => (
            <div
              key={badge.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center opacity-70"
            >
              <span className="text-3xl grayscale">{badge.icon}</span>
              <p className="mt-2 text-sm font-600 text-slate-500">{badge.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{badge.requirement}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-slate-500 text-sm">
        <Link to="/profil" className="text-diapal-600 font-500 hover:underline">
          Profile dön
        </Link>
      </p>
    </div>
  )
}
