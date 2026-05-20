'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    }, error => {
      console.error('Auth error:', error)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  // Render children immediately, don't wait for auth to fully load
  // Auth state will be available via context once loaded
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {mounted ? children : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)