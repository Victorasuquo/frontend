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
  therapeutic_area?: string | null
  effort_reward_score?: number | null
  priority_rank?: number | null
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
