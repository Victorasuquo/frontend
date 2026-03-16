export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export const ROLE_LABELS = {
  senior: 'Senior Leadership',
  icb: 'ICB Pharmacist',
  pcn: 'PCN Pharmacist',
  gp: 'Practice Team',
} as const
