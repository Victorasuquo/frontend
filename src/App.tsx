import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { Role } from './types'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { AppShell } from './components/AppShell'
import { PCNOverviewPage } from './pages/PCNOverviewPage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { PracticesPage } from './pages/PracticesPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import SeniorExecutivePage from './pages/SeniorExecutivePage'
import SubICBPerformancePage from './pages/SubICBPerformancePage'
import SLFinancialPage from './pages/SLFinancialPage'
import PricePerUnitPage from './pages/PricePerUnitPage'
import PriceConcessionsPage from './pages/PriceConcessionsPage'
import PatentWatchPage from './pages/PatentWatchPage'
import DrugExpenditurePage from './pages/DrugExpenditurePage'
import SwitchImpactPage from './pages/SwitchImpactPage'
import ICBSchemePage from './pages/ICBSchemePage'
import ICBAlertsPage from './pages/ICBAlertsPage'
import ICBBenchmarkingPage from './pages/ICBBenchmarkingPage'

const DEFAULT_TAB: Record<Role, string> = {
  senior: 'sl-exec',
  icb: 'opportunities',
  pcn: 'overview',
  gp: 'opportunities',
}
function ProtectedShell() {
  const { isAuthenticated, isLoading, selectedRole } = useAuth()
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB[selectedRole])

  useEffect(() => {
    setActiveTab(DEFAULT_TAB[selectedRole])
  }, [selectedRole])

  const content = useMemo(() => {
    switch (activeTab) {
      // ── Senior Leadership ──────────────────────
      case 'sl-exec':
        return <SeniorExecutivePage />
      case 'sl-subicb':
        return <SubICBPerformancePage />
      case 'sl-financial':
        return <SLFinancialPage />
      case 'sl-ppu':
        return <PricePerUnitPage />
      case 'sl-concessions':
        return <PriceConcessionsPage />
      case 'sl-patent':
        return <PatentWatchPage />
      case 'sl-expenditure':
        return <DrugExpenditurePage />
      case 'sl-impact':
        return <SwitchImpactPage />
      case 'sl-bench':
        return <ICBBenchmarkingPage />
      // ── ICB / PCN / GP ─────────────────────────
      case 'overview':
        return <PCNOverviewPage />
      case 'opportunities':
        return <OpportunitiesPage />
      case 'practices':
        return <PracticesPage />
      case 'benchmark':
        return <ICBBenchmarkingPage />
      case 'scheme':
        return <ICBSchemePage />
      case 'alerts':
        return <ICBAlertsPage />
      case 'ai-search':
        return <PlaceholderPage title="AI patient search" description="Gemini-powered query flow will be wired in this next sprint slice." />
      case 'find-own':
        return <PlaceholderPage title="Find my own" description="Free-text opportunity discovery integration is scaffolded." />
      case 'documents':
        return <PlaceholderPage title="Action sheets and letters" description="Document generation and preview wiring is in progress." />
      case 'switch-log':
        return <PlaceholderPage title="Switch log" description="Audit trail and EPD verification table is scaffolded." />
      default:
        return <PCNOverviewPage />
    }
  }, [activeTab])

  if (isLoading) {
    return <div className="loading">Loading MedSave...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppShell activeTab={activeTab} onTabChange={setActiveTab}>{content}</AppShell>
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
