import { createContext, useCallback, useContext, useEffect, useState } from 'react'

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

type StoredUser = User & { password: string }

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
  getUsersPublic: () => { id: string; name: string }[]
  getUsersPublicWithRole: () => { id: string; name: string; role: UserRole }[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser())

  const login = useCallback((email: string, password: string) => {
    const users = loadUsers()
    const normalized = email.trim().toLowerCase()
    const found = users.find((u) => u.email.toLowerCase() === normalized)
    if (!found) {
      return { ok: false, error: 'Bu e-posta adresiyle kayıtlı hesap bulunamadı.' }
    }
    if (found.password !== password) {
      return { ok: false, error: 'Şifre hatalı.' }
    }
    const { password: _, ...safeUser } = found
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
      if (data.role === 'admin') return { ok: false, error: 'Admin hesabı kayıt ile oluşturulamaz.' }
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

  useEffect(() => {
    const stored = loadStoredUser()
    if (stored && !user) setUser(stored)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, deleteAccount, getUsersPublic, getUsersPublicWithRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
