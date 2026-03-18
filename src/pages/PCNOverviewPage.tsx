import { useEffect, useMemo, useState } from 'react'
import { getDashboardSummary, getOpportunities, getPractices } from '../api/client'
import type { DashboardSummary, Opportunity, PracticeItem } from '../types'

export function PCNOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [practices, setPractices] = useState<PracticeItem[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [summaryRes, practicesRes, opportunitiesRes] = await Promise.all([
          getDashboardSummary(),
          getPractices(200),
          getOpportunities(100),
        ])
        setSummary(summaryRes)
        setPractices(practicesRes.items)
        setOpportunities(opportunitiesRes.items)
      } catch {
        setError('Unable to load PCN overview from live API endpoints.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const metricsByPractice = useMemo(() => {
    const grouped = new Map<string, { potential: number; opportunities: number; completed: number; patients: number }>()
    for (const o of opportunities) {
      const code = o.practice_ods_code || 'UNASSIGNED'
      const existing = grouped.get(code) ?? { potential: 0, opportunities: 0, completed: 0, patients: 0 }
      existing.potential += o.estimated_annual_savings || 0
      existing.opportunities += 1
      existing.patients += o.patients_affected || 0
      if (o.status.toUpperCase() === 'COMPLETED') existing.completed += 1
      grouped.set(code, existing)
    }
    return grouped
  }, [opportunities])

  const totals = useMemo(() => {
    let potential = 0
    let completed = 0
    let total = 0
    for (const metrics of metricsByPractice.values()) {
      potential += metrics.potential
      completed += metrics.completed
      total += metrics.opportunities
    }
    return { potential, completed, total }
  }, [metricsByPractice])

  return (
    <div className="pg">
      <div className="ph">
        <h1>PCN overview</h1>
        <p>Network level · {practices.length} practices · data as of {summary?.data_as_of ?? 'latest sync'}</p>
      </div>

      {error ? <div className="err" style={{ marginBottom: '1rem' }}>{error}</div> : null}

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Savings YTD</div><div className="mc-v">£{Math.round(summary?.realized_savings_ytd ?? 0).toLocaleString()}</div><div className="mc-s up">live summary</div></div>
        <div className="mc"><div className="mc-l">Remaining potential</div><div className="mc-v">£{Math.round(Math.max(0, totals.potential - (summary?.realized_savings_ytd ?? 0))).toLocaleString()}</div><div className="mc-s nu">estimated from opportunities</div></div>
        <div className="mc"><div className="mc-l">Switches complete</div><div className="mc-v">{totals.completed}/{totals.total}</div><div className="mc-s up">from live statuses</div></div>
        <div className="mc"><div className="mc-l">Active opportunities</div><div className="mc-v">{summary?.active_opportunities ?? opportunities.length}</div><div className="mc-s dn">Require action</div></div>
      </div>

      <div className="card">
        <div className="ch"><div className="ch-t">Practices</div></div>
        {loading ? <div className="pad">Loading practices...</div> : null}
        {!loading && practices.map((p) => {
          const metrics = metricsByPractice.get(p.ods_code) ?? { potential: 0, opportunities: 0, completed: 0, patients: 0 }
          const progress = metrics.opportunities ? Math.round((metrics.completed / metrics.opportunities) * 100) : 0
          const rag = progress >= 70 ? 'g' : progress >= 35 ? 'a' : 'r'
          return (
            <div className="pr" key={p.ods_code}>
              <div className={`rag rag-${rag}`} />
              <div style={{ flex: 1 }}>
                <div className="pr-n">{p.name}</div>
                <div className="pr-s">{metrics.completed}/{metrics.opportunities} switches · {metrics.patients.toLocaleString()} patients</div>
                <div className="pr-bar" style={{ marginTop: 4, width: 140 }}><div className="pr-bf" style={{ width: `${progress}%` }} /></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pr-v">£{Math.round(metrics.potential).toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{progress}%</div>
              </div>
            </div>
          )
        })}
        {!loading && !practices.length ? <div className="pad">No practices returned for this tenant.</div> : null}
      </div>
    </div>
  )
}
