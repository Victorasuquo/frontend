export type Role = 'senior' | 'icb' | 'pcn' | 'gp'

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  tenant_id: string
  is_active: boolean
}

export interface DashboardSummary {
  total_saving_potential: number
  active_opportunities: number
  total_practices: number
  completed_switches: number
  realized_savings_ytd: number
  data_as_of: string
}

export interface Opportunity {
  id: string
  workstream: string
  description: string
  estimated_annual_savings: number
  patients_affected: number
  status: string
  org_level: string
  practice_ods_code?: string | null
  pcn_ods_code?: string | null
  sub_icb_ods_code?: string | null
  therapeutic_area?: string | null
  effort_reward_score?: number | null
  priority_rank?: number | null
  current_expensive_bnf?: string | null
  target_cheap_bnf?: string | null
}

export interface OpportunityListResponse {
  total: number
  page: number
  page_size: number
  items: Opportunity[]
}

export interface PracticeItem {
  ods_code: string
  name: string
  address?: string | null
  postcode?: string | null
  parent_ods_code?: string | null
  status?: string
}

export interface PracticesResponse {
  total: number
  page: number
  page_size: number
  items: PracticeItem[]
}

export interface ClinicalQueryResponse {
  query_text: string
  target_system: string
  emis_query: string
  systmone_query: string
  inclusion_criteria: string[]
  exclusion_criteria: string[]
  safety_notes: string[]
}

export interface OpportunityIdea {
  title: string
  rationale: string
  current_drug?: string | null
  target_drug?: string | null
  estimated_annual_savings: number
  affected_patients: number
  bnf_codes: string[]
  exclusions: string[]
}

export interface FindOpportunitiesResponse {
  query_text: string
  opportunities: OpportunityIdea[]
}

export interface GeneratedDocumentResponse {
  document_id: string
  document_type: string
  title: string
  content: string
  generated_at: string
}

export interface InterventionItem {
  id: string
  name: string
  therapeutic_area?: string | null
  workstream_code?: string | null
  current_drug: string
  target_drug: string
  status: string
  forecast_annual_savings?: number | null
  realized_savings: number
  total_eligible_patients: number
  patients_switched: number
}

export interface SavingsSummaryResponse {
  ytd_total: number
  total_forecast: number
  by_workstream: Record<string, number>
}
