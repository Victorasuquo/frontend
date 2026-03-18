import { useEffect, useMemo, useState } from 'react'
import { getOpportunities, getPractices } from '../api/client'
import type { Opportunity, PracticeItem } from '../types'

export function PracticesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [practices, setPractices] = useState<PracticeItem[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [practicesRes, opportunitiesRes] = await Promise.all([
          getPractices(200),
          getOpportunities(100),
        ])
        setPractices(practicesRes.items)
        setOpportunities(opportunitiesRes.items)
      } catch {
        setError('Unable to load practices from live API endpoints.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const metricsByPractice = useMemo(() => {
    const grouped = new Map<string, {
      potential: number
      opportunities: number
      completed: number
      active: number
      patients: number
    }>()

    for (const o of opportunities) {
      const code = o.practice_ods_code || 'UNASSIGNED'
      const existing = grouped.get(code) ?? { potential: 0, opportunities: 0, completed: 0, active: 0, patients: 0 }
      existing.potential += o.estimated_annual_savings || 0
      existing.opportunities += 1
      existing.patients += o.patients_affected || 0
      if (o.status.toUpperCase() === 'COMPLETED') existing.completed += 1
      if (['APPROVED', 'IN_PROGRESS'].includes(o.status.toUpperCase())) existing.active += 1
      grouped.set(code, existing)
    }

    return grouped
  }, [opportunities])

  return (
    <div className="pg">
      <div className="ph">
        <h1>Practice performance</h1>
        <p>All South Yorkshire ICB practices · live opportunities tracking</p>
      </div>

      {error ? <div className="err" style={{ marginBottom: '1rem' }}>{error}</div> : null}

      <div className="card">
        <div className="ch"><div className="ch-t">All practices — savings tracker</div></div>
        <table className="tc">
          <thead>
            <tr>
              <th>RAG</th>
              <th>Practice</th>
              <th>PCN</th>
              <th>Savings YTD</th>
              <th>% of potential</th>
              <th>Switches</th>
              <th>Patients</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="pad">Loading practices...</td></tr>
            ) : null}
            {!loading && practices.map((p) => {
              const metrics = metricsByPractice.get(p.ods_code) ?? { potential: 0, opportunities: 0, completed: 0, active: 0, patients: 0 }
              const progress = metrics.opportunities ? Math.round((metrics.completed / metrics.opportunities) * 100) : 0
              const status = metrics.opportunities === 0 ? 'No opportunities' : metrics.completed === metrics.opportunities ? 'Complete' : metrics.active > 0 ? 'Active' : 'Not started'
              const sb = status === 'Complete' ? 'sb-ok' : status === 'Active' ? 'sb-w' : 'sb-b'
              const rag = progress >= 70 ? 'g' : progress >= 35 ? 'a' : 'r'
              return (
                <tr key={p.ods_code}>
                  <td><div className={`rag rag-${rag}`} style={{ margin: '0 auto' }} /></td>
                  <td><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 10, color: 'var(--muted)' }}>{p.ods_code}</div></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{p.parent_ods_code || '—'}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>£{Math.round(metrics.potential).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="pr-bar"><div className="pr-bf" style={{ width: `${progress}%` }} /></div>
                      <span style={{ fontSize: 11 }}>{progress}%</span>
                    </div>
                  </td>
                  <td>{metrics.completed}/{metrics.opportunities}</td>
                  <td style={{ fontSize: 11.5, color: 'var(--muted)' }}>{metrics.patients.toLocaleString()}</td>
                  <td><span className={`sb ${sb}`}><span className="sd" />{status}</span></td>
                </tr>
              )
            })}
            {!loading && !practices.length ? (
              <tr><td colSpan={8} className="pad">No practices returned for this tenant.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
