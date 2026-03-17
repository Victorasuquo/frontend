import { api } from '../lib/http'
import type {
  ClinicalQueryResponse,
  DashboardSummary,
  FindOpportunitiesResponse,
  GeneratedDocumentResponse,
  InterventionItem,
  LoginResponse,
  OpportunityListResponse,
  PracticesResponse,
  SavingsSummaryResponse,
  UserProfile,
} from '../types'

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

export async function getAISuggestions(): Promise<string[]> {
  const response = await api.get<{ suggestions: string[] }>('/ai-search/suggestions')
  return response.data.suggestions ?? []
}

export async function runClinicalQuery(queryText: string, targetSystem: 'emis' | 'systmone' | 'both' = 'both'): Promise<ClinicalQueryResponse> {
  const response = await api.post<ClinicalQueryResponse>('/ai-search/clinical-query', {
    query_text: queryText,
    target_system: targetSystem,
  })
  return response.data
}

export async function findOpportunities(queryText: string, maxResults = 6): Promise<FindOpportunitiesResponse> {
  const response = await api.post<FindOpportunitiesResponse>('/ai-search/find-opportunities', {
    query_text: queryText,
    max_results: maxResults,
  })
  return response.data
}

export async function generateActionSheet(payload: {
  opportunity_title: string
  practice_name: string
  patient_count: number
  current_drug?: string
  target_drug?: string
  clinical_notes?: string
}): Promise<GeneratedDocumentResponse> {
  const response = await api.post<GeneratedDocumentResponse>('/documents/action-sheet', payload)
  return response.data
}

export async function generatePatientLetter(payload: {
  patient_name: string
  opportunity_title: string
  current_drug: string
  target_drug: string
  practice_name: string
  additional_advice?: string
}): Promise<GeneratedDocumentResponse> {
  const response = await api.post<GeneratedDocumentResponse>('/documents/patient-letter', payload)
  return response.data
}

export async function generateSMS(payload: {
  patient_name: string
  practice_name: string
  current_drug: string
  target_drug: string
}): Promise<GeneratedDocumentResponse> {
  const response = await api.post<GeneratedDocumentResponse>('/documents/sms', payload)
  return response.data
}

export async function getInterventions(): Promise<InterventionItem[]> {
  const response = await api.get<InterventionItem[]>('/interventions/')
  return response.data
}

export async function getSavingsSummary(): Promise<SavingsSummaryResponse> {
  const response = await api.get<SavingsSummaryResponse>('/savings/summary')
  return response.data
}
