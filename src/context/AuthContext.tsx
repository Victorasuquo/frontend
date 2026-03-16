import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getMe, login as loginRequest } from '../api/client'
import type { Role, UserProfile } from '../types'
import { clearTokens, getAccessToken, getStoredRole, setTokens } from '../lib/tokenStore'
import { ROLE_LABELS } from '../config'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserProfile | null
  selectedRole: Role
  setSelectedRole: (role: Role) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  roleLabel: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeRole(role: string): Role {
  const value = role.toLowerCase()
  if (value.includes('senior') || value.includes('lead')) return 'senior'
  if (value.includes('icb')) return 'icb'
  if (value.includes('gp') || value.includes('practice')) return 'gp'
  return 'pcn'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>('pcn')

  useEffect(() => {
    const boot = async () => {
      const token = getAccessToken()
      const storedRole = getStoredRole()
      if (storedRole === 'senior' || storedRole === 'icb' || storedRole === 'pcn' || storedRole === 'gp') {
        setSelectedRole(storedRole)
      }
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const me = await getMe()
        setUser(me)
          // Keep stored role (user's login choice) rather than overriding with backend role
          if (!storedRole) {
            setSelectedRole(normalizeRole(me.role))
          }
      } catch {
        clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    void boot()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginRequest(email, password)
    setTokens(tokens.access_token, tokens.refresh_token, selectedRole)
    const me = await getMe()
    setUser(me)
    // Keep the role the user selected on the login page — do not override with backend role
    setTokens(tokens.access_token, tokens.refresh_token, selectedRole)
  }, [selectedRole])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      selectedRole,
      setSelectedRole,
      login,
      logout,
      roleLabel: ROLE_LABELS[selectedRole],
    }),
    [isLoading, user, selectedRole, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
