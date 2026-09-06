import type { UserProfile } from '../types/api'
import { apiRequest, resetCsrfToken } from './client'

export const authApi = {
  login: (
    credentials: { email: string; password: string },
    signal?: AbortSignal
  ) =>
    apiRequest<UserProfile>('/api/auth/login', {
      method: 'POST',
      body: credentials,
      signal,
    }),
  me: (signal?: AbortSignal) =>
    apiRequest<UserProfile>('/api/auth/me', { signal }),
  logout: async () => {
    await apiRequest<void>('/api/auth/logout', { method: 'POST' })
    resetCsrfToken()
  },
}
