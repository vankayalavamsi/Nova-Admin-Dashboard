import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'nova_users'
const SESSION_KEY = 'nova_session'

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// Demo-only hash — swap for a real backend (bcrypt/JWT) in production.
const hash = (str) => {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  return 'h' + h.toString(16)
}

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [] } catch { return [] }
}
const writeUsers = (users) => {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* ignore */ }
}
const toPublic = ({ id, name, email, role, createdAt }) => ({ id, name, email, role, createdAt })

const DEMO_ACCOUNT = {
  id: 'usr_demo',
  name: 'Demo Admin',
  email: 'demo@nova.io',
  passwordHash: hash('Demo@1234'),
  role: 'Administrator',
  createdAt: new Date().toISOString(),
}

export function AuthProvider({ children }) {
  // Runs ONCE, synchronously, on the very first render.
  // No useEffect, no "booting" flag → nothing can flip user between renders.
  const [user, setUser] = useState(() => {
    try {
      if (!localStorage.getItem(USERS_KEY)) writeUsers([DEMO_ACCOUNT])
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')
      if (!session?.email) return null
      const found = readUsers().find((u) => u.email === session.email)
      return found ? toPublic(found) : null
    } catch {
      return null
    }
  })

  const signup = useCallback(async ({ name, email, password }) => {
    await delay()
    const list = readUsers()
    if (list.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      throw new Error('An account with this email already exists.')
    const account = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hash(password),
      role: 'Administrator',
      createdAt: new Date().toISOString(),
    }
    writeUsers([...list, account])
  }, [])

  const login = useCallback(async ({ email, password }) => {
    await delay()
    const found = readUsers().find((u) => u.email === email.trim().toLowerCase())
    if (!found || found.passwordHash !== hash(password))
      throw new Error('Invalid email or password.')
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: found.email }))
    setUser(toPublic(found))
    return toPublic(found)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async ({ name, email }) => {
    await delay(400)
    const list = readUsers()
    const idx = list.findIndex((u) => u.email === user?.email)
    if (idx === -1) throw new Error('Account not found.')
    const cleanEmail = email.trim().toLowerCase()
    if (list.some((u, i) => i !== idx && u.email === cleanEmail))
      throw new Error('That email is already taken.')
    list[idx] = { ...list[idx], name: name.trim(), email: cleanEmail }
    writeUsers(list)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: cleanEmail }))
    setUser(toPublic(list[idx]))
  }, [user])

  const changePassword = useCallback(async (current, next) => {
    await delay(400)
    const list = readUsers()
    const idx = list.findIndex((u) => u.email === user?.email)
    if (idx === -1) throw new Error('Account not found.')
    if (list[idx].passwordHash !== hash(current)) throw new Error('Current password is incorrect.')
    if ((next || '').length < 8) throw new Error('New password must be at least 8 characters.')
    list[idx] = { ...list[idx], passwordHash: hash(next) }
    writeUsers(list)
  }, [user])

  const value = useMemo(
    () => ({ user, signup, login, logout, updateProfile, changePassword }),
    [user, signup, login, logout, updateProfile, changePassword]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}