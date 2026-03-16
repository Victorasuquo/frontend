import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

interface Tab {
  id: string
  label: string
  badge?: string
}

const ROLE_TABS: Record<Role, Tab[]> = {
  senior: [
    { id: 'sl-exec', label: 'Executive summary' },
    { id: 'sl-subicb', label: 'Sub-ICB performance' },
    { id: 'sl-financial', label: 'Financial performance' },
    { id: 'sl-ppu', label: 'Price per unit tool', badge: 'NEW' },
    { id: 'sl-concessions', label: 'Price concessions', badge: 'LIVE' },
    { id: 'sl-patent', label: 'Patent watch', badge: '8' },
    { id: 'sl-expenditure', label: 'Drug expenditure' },
    { id: 'sl-impact', label: 'Switch impact' },
    { id: 'sl-bench', label: 'ICB benchmarking', badge: 'LIVE' },
  ],
  icb: [
    { id: 'opportunities', label: 'All opportunities', badge: '35' },
    { id: 'scheme', label: 'Scheme builder' },
    { id: 'alerts', label: 'Price alerts', badge: '4' },
    { id: 'benchmark', label: 'ICB benchmarking', badge: 'LIVE' },
    { id: 'practices', label: 'Practices' },
  ],
  pcn: [
    { id: 'overview', label: 'PCN overview' },
    { id: 'opportunities', label: 'All opportunities', badge: '35' },
    { id: 'ai-search', label: 'AI search', badge: 'AI' },
    { id: 'find-own', label: 'Find my own' },
    { id: 'documents', label: 'Action sheets & letters' },
    { id: 'switch-log', label: 'Switch log' },
  ],
  gp: [
    { id: 'opportunities', label: 'All opportunities', badge: '35' },
    { id: 'ai-search', label: 'AI search', badge: 'AI' },
    { id: 'find-own', label: 'Find my own' },
    { id: 'documents', label: 'Action sheets & letters' },
    { id: 'switch-log', label: 'Switch log' },
  ],
}

interface AppShellProps {
  activeTab: string
  onTabChange: (tab: string) => void
  children: ReactNode
}

export function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  const { roleLabel, selectedRole, user, logout } = useAuth()
  const tabs = ROLE_TABS[selectedRole]
  const initials = (user?.full_name ?? 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div id="shell">
      <header className="top">
        <div className="top-l">
          <div className="top-ic">◈</div>
          <div className="top-n">MedSave</div>
          <span className="top-ctx">- {roleLabel}</span>
        </div>
        <div className="top-r">
          <span className="top-org">South Yorkshire ICB</span>
          <div className="top-av">{initials || 'SY'}</div>
          <span className="top-nm">{user?.full_name ?? 'South Yorkshire user'}</span>
          <button className="top-so" onClick={logout}>Sign out</button>
        </div>
      </header>

      <nav className="nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nt ${activeTab === tab.id ? 'act' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.badge ? <span className={`nb ${tab.badge === 'AI' || tab.badge === 'LIVE' ? 'ai' : ''}`}>{tab.badge}</span> : null}
          </button>
        ))}
      </nav>

      <main className="ma">{children}</main>
    </div>
  )
}
