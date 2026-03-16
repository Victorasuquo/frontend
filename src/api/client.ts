import { api } from '../lib/http'
import type { DashboardSummary, LoginResponse, OpportunityListResponse, PracticesResponse, UserProfile } from '../types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', { email, password })
  return response.data
}

export async function getMe(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/auth/me')
  return response.data
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>('/dashboard/summary')
  return response.data
}

export async function getOpportunities(pageSize = 50): Promise<OpportunityListResponse> {
  const response = await api.get<OpportunityListResponse>('/opportunities/', {
    params: { page: 1, page_size: pageSize, sort_by: 'estimated_annual_savings' },
  })
  return response.data
}

export async function getPractices(pageSize = 200): Promise<PracticesResponse> {
  const response = await api.get<PracticesResponse>('/practices/', {
    params: { page: 1, page_size: pageSize },
  })
  return response.data
}
