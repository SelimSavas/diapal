import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  createPasswordResetToken,
  isPasswordResetEmailConfigured,
  peekValidPasswordResetEmail,
  removePasswordResetToken,
  sendPasswordResetEmail,
} from '../lib/passwordReset'

export type UserRole = 'hasta' | 'doktor' | 'admin'

export type User = {
  id: string
  email: string
  name: string
  role: UserRole
  diabetesType?: string
  branch?: string
  city?: string
}

/** Yok / süresi dolmuş: giriş serbest. ISO: geçici engel bitişi. 'permanent': kalıcı engel. */
type StoredUser = User & { password: string; bannedUntil?: string | null }

export const BAN_PERMANENT = 'permanent' as const

function getBanStatus(u: Pick<StoredUser, 'bannedUntil'>): { active: boolean; isPermanent?: boolean; until?: Date } {
  const b = u.bannedUntil
  if (b == null || b === '') return { active: false }
  if (b === BAN_PERMANENT) return { active: true, isPermanent: true }
  const until = new Date(b)
  if (Number.isNaN(until.getTime())) return { active: false }
  if (Date.now() >= until.getTime()) return { active: false }
  return { active: true, until }
}

function clearExpiredBanInPlace(users: StoredUser[]): boolean {
  let changed = false
  const next = users.map((u) => {
    if (u.bannedUntil == null || u.bannedUntil === '' || u.bannedUntil === BAN_PERMANENT) return u
    const until = new Date(u.bannedUntil)
    if (Number.isNaN(until.getTime())) {
      changed = true
      const { bannedUntil: _, ...rest } = u
      return rest as StoredUser
    }
    if (Date.now() >= until.getTime()) {
      changed = true
      const { bannedUntil: _, ...rest } = u
      return rest as StoredUser
    }
    return u
  })
  if (changed) {
    saveUsers(next)
    return true
  }
  return false
}

const STORAGE_KEY = 'diapal_user'
const USERS_KEY = 'diapal_users'

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const user = JSON.parse(raw) as User
    return user.id && user.email ? user : null
  } catch {
    return null
  }
}

const ADMIN_SEED: StoredUser = {
  id: 'admin_1',
  email: 'admin@diapal.com',
  name: 'Admin',
  password: 'D1apal#Admin!2025',
  role: 'admin',
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    let users: StoredUser[] = raw ? JSON.parse(raw) : []

    const adminEmail = 'admin@diapal.com'
    const adminIndex = users.findIndex((u) => u.email.toLowerCase() === adminEmail)

    if (adminIndex === -1) {
      users = [ADMIN_SEED, ...users]
    } else {
      users[adminIndex] = ADMIN_SEED
    }

    saveUsers(users)
    return users
  } catch {
    saveUsers([ADMIN_SEED])
    return [ADMIN_SEED]
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export type UserForAdmin = {
  id: string
  email: string
  name: string
  role: UserRole
  branch?: string
  city?: string
  bannedUntil?: string | null
  /** Görüntüleme: "Yok" | "Kalıcı" | tarih metni */
  banDisplay: string
}

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (data: {
    email: string
    password: string
    name: string
    role: UserRole
    diabetesType?: string
    branch?: string
    city?: string
  }) => { ok: boolean; error?: string }
  logout: () => void
  deleteAccount: (userId: string) => { ok: boolean; error?: string }
  addDoctor: (data: { email: string; name: string; password: string; branch?: string; city?: string }) => { ok: boolean; error?: string }
  getUsersForAdmin: () => UserForAdmin[]
  banUser: (
    targetUserId: string,
    duration: '1h' | '24h' | '7d' | '30d' | 'permanent'
  ) => { ok: boolean; error?: string }
  unbanUser: (targetUserId: string) => { ok: boolean; error?: string }
  getUsersPublic: () => { id: string; name: string }[]
  getUsersPublicWithRole: () => { id: string; name: string; role: UserRole }[]
  /** E-posta kayıtlıysa sıfırlama bağlantısı gönderir (adres yoksa da başarı döner). */
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>
  completePasswordReset: (token: string, newPassword: string) => { ok: boolean; error?: string }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser())

  const login = useCallback((email: string, password: string) => {
    let users = loadUsers()
    clearExpiredBanInPlace(users)
    users = loadUsers()
    const normalized = email.trim().toLowerCase()
    const found = users.find((u) => u.email.toLowerCase() === normalized)
    if (!found) {
      return { ok: false, error: 'Bu e-posta adresiyle kayıtlı hesap bulunamadı.' }
    }
    if (found.password !== password) {
      return { ok: false, error: 'Şifre hatalı.' }
    }
    const ban = getBanStatus(found)
    if (ban.active) {
      if (ban.isPermanent) {
        return { ok: false, error: 'Hesabınız yönetici tarafından kalıcı olarak engellendi.' }
      }
      const when = ban.until
        ? ban.until.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
        : ''
      return {
        ok: false,
        error: when
          ? `Hesabınız geçici olarak engellendi. Engel kalkış: ${when}`
          : 'Hesabınız geçici olarak engellendi.',
      }
    }
    const { password: _, bannedUntil: __, ...safeUser } = found
    setUser(safeUser)
    saveCurrentUser(safeUser)
    return { ok: true }
  }, [])

  const register = useCallback(
    (data: {
      email: string
      password: string
      name: string
      role: UserRole
      diabetesType?: string
      branch?: string
      city?: string
    }) => {
      if (data.role !== 'hasta') return { ok: false, error: 'Sadece üye kaydı yapılabilir. Doktor hesapları yönetici tarafından oluşturulur.' }
      const users = loadUsers()
      const normalized = data.email.trim().toLowerCase()
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'Bu e-posta adresi zaten kullanılıyor.' }
      }
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        email: data.email.trim(),
        name: data.name.trim(),
        password: data.password,
        role: data.role,
        diabetesType: data.diabetesType,
        branch: data.branch?.trim(),
        city: data.city?.trim(),
      }
      users.push(newUser)
      saveUsers(users)
      const { password: _, ...safeUser } = newUser
      setUser(safeUser)
      saveCurrentUser(safeUser)
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    saveCurrentUser(null)
  }, [])

  const deleteAccount = useCallback((userId: string) => {
    const users = loadUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' }
    users.splice(idx, 1)
    saveUsers(users)
    if (user?.id === userId) {
      setUser(null)
      saveCurrentUser(null)
    }
    return { ok: true }
  }, [user?.id])

  const getUsersPublic = useCallback(() => {
    return loadUsers().map((u) => ({ id: u.id, name: u.name }))
  }, [])

  const getUsersPublicWithRole = useCallback(() => {
    return loadUsers().map((u) => ({ id: u.id, name: u.name, role: u.role }))
  }, [])

  const addDoctor = useCallback((data: { email: string; name: string; password: string; branch?: string; city?: string }) => {
    const users = loadUsers()
    const current = users.find((u) => u.id === user?.id)
    if (!current || current.role !== 'admin') return { ok: false, error: 'Yetkiniz yok.' }
    const normalized = data.email.trim().toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { ok: false, error: 'Bu e-posta adresi zaten kullanılıyor.' }
    }
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      email: data.email.trim(),
      name: data.name.trim(),
      password: data.password,
      role: 'doktor',
      branch: data.branch?.trim(),
      city: data.city?.trim(),
    }
    users.push(newUser)
    saveUsers(users)
    return { ok: true }
  }, [user?.id])

  const getUsersForAdmin = useCallback((): UserForAdmin[] => {
    const users = loadUsers()
    const current = users.find((u) => u.id === user?.id)
    if (!current || current.role !== 'admin') return []
    return users.map((u) => {
      const st = getBanStatus(u)
      let banDisplay = 'Yok'
      if (st.active) {
        banDisplay = st.isPermanent ? 'Kalıcı' : st.until ? st.until.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : 'Evet'
      } else if (u.bannedUntil && u.bannedUntil !== BAN_PERMANENT) {
        const d = new Date(u.bannedUntil)
        banDisplay = Number.isNaN(d.getTime()) ? 'Yok' : 'Süresi dolmuş'
      }
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        branch: u.branch,
        city: u.city,
        bannedUntil: u.bannedUntil,
        banDisplay,
      }
    })
  }, [user?.id])

  const banUser = useCallback(
    (targetUserId: string, duration: '1h' | '24h' | '7d' | '30d' | 'permanent') => {
      const users = loadUsers()
      const admin = users.find((x) => x.id === user?.id)
      if (!admin || admin.role !== 'admin') return { ok: false, error: 'Yetkiniz yok.' }
      const idx = users.findIndex((x) => x.id === targetUserId)
      if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' }
      if (users[idx].role === 'admin') return { ok: false, error: 'Admin hesabı engellenemez.' }
      if (duration === 'permanent') {
        users[idx] = { ...users[idx], bannedUntil: BAN_PERMANENT }
      } else {
        const until = new Date()
        if (duration === '1h') until.setHours(until.getHours() + 1)
        else if (duration === '24h') until.setDate(until.getDate() + 1)
        else if (duration === '7d') until.setDate(until.getDate() + 7)
        else until.setDate(until.getDate() + 30)
        users[idx] = { ...users[idx], bannedUntil: until.toISOString() }
      }
      saveUsers(users)
      if (user?.id === targetUserId) {
        setUser(null)
        saveCurrentUser(null)
      }
      return { ok: true }
    },
    [user?.id]
  )

  const requestPasswordReset = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized) return { ok: false, error: 'E-posta adresini girin.' }
    if (!isPasswordResetEmailConfigured()) {
      return {
        ok: false,
        error:
          'Şifre sıfırlama e-postası için .env içinde VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID ve VITE_EMAILJS_TEMPLATE_ID_RESET tanımlanmalıdır.',
      }
    }
    clearExpiredBanInPlace(loadUsers())
    const users = loadUsers()
    const found = users.find((u) => u.email.toLowerCase() === normalized)
    if (!found) {
      return { ok: true }
    }
    try {
      const token = createPasswordResetToken(found.email)
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      const resetLink = `${window.location.origin}${base}/sifre-yenile?token=${encodeURIComponent(token)}`
      await sendPasswordResetEmail(found.email, resetLink)
      return { ok: true }
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.',
      }
    }
  }, [])

  const completePasswordReset = useCallback((token: string, newPassword: string) => {
    if (newPassword.length < 6) {
      return { ok: false, error: 'Şifre en az 6 karakter olmalıdır.' }
    }
    const email = peekValidPasswordResetEmail(token)
    if (!email) {
      return { ok: false, error: 'Bağlantı geçersiz veya süresi dolmuş. Yeni sıfırlama isteyin.' }
    }
    const users = loadUsers()
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
    if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' }
    users[idx] = { ...users[idx], password: newPassword }
    saveUsers(users)
    removePasswordResetToken(token)
    return { ok: true }
  }, [])

  const unbanUser = useCallback(
    (targetUserId: string) => {
      const users = loadUsers()
      const admin = users.find((x) => x.id === user?.id)
      if (!admin || admin.role !== 'admin') return { ok: false, error: 'Yetkiniz yok.' }
      const idx = users.findIndex((x) => x.id === targetUserId)
      if (idx === -1) return { ok: false, error: 'Kullanıcı bulunamadı.' }
      if (users[idx].role === 'admin') return { ok: false, error: 'Admin için gerekmez.' }
      const { bannedUntil: _, ...rest } = users[idx]
      users[idx] = rest as StoredUser
      saveUsers(users)
      return { ok: true }
    },
    [user?.id]
  )

  useEffect(() => {
    const stored = loadStoredUser()
    if (stored && !user) setUser(stored)
  }, [user])

  /** Oturum açıkken engel (admin tarafından) eklenirse çıkış */
  useEffect(() => {
    if (!user?.id) return
    const tick = () => {
      clearExpiredBanInPlace(loadUsers())
      const users = loadUsers()
      const full = users.find((u) => u.id === user.id)
      if (!full || getBanStatus(full).active) {
        setUser(null)
        saveCurrentUser(null)
      }
    }
    tick()
    const id = window.setInterval(tick, 40000)
    const onFocus = () => tick()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [user?.id])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        deleteAccount,
        addDoctor,
        getUsersForAdmin,
        banUser,
        unbanUser,
        getUsersPublic,
        getUsersPublicWithRole,
        requestPasswordReset,
        completePasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
