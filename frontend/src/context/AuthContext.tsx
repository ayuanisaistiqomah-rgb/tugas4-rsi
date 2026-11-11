import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../lib/api'
import { clearToken, getToken, setToken } from '../lib/token'
import type { LoginInput, RegisterInput, User } from '../types/api'

interface AuthContextValue {
  user: User | null
  isReady: boolean
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      setIsReady(true)
      return
    }

    authApi
      .me()
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setIsReady(true))
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  async function login(input: LoginInput) {
    const result = await authApi.login(input)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }

  async function register(input: RegisterInput) {
    await authApi.register(input)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return context
}