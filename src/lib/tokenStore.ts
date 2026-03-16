const ACCESS = 'qipp_access_token'
const REFRESH = 'qipp_refresh_token'
const ROLE = 'qipp_role'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH)
}

export function getStoredRole(): string | null {
  return localStorage.getItem(ROLE)
}

export function setTokens(accessToken: string, refreshToken: string, role: string): void {
  localStorage.setItem(ACCESS, accessToken)
  localStorage.setItem(REFRESH, refreshToken)
  localStorage.setItem(ROLE, role)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
  localStorage.removeItem(ROLE)
}
