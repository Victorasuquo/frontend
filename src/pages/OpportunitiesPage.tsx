import { useEffect, useMemo, useState } from 'react'
import { getDashboardSummary, getOpportunities } from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { DashboardSummary, Opportunity } from '../types'

type Filter = 'all' | 'scheme' | 'simple' | 'ghost' | 'doac'

export function OpportunitiesPage() {
  const { selectedRole } = useAuth()
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [oppsRes, summaryRes] = await Promise.all([
          getOpportunities(100),
          getDashboardSummary(),
        ])
        setOpportunities(oppsRes.items)
        setSummary(summaryRes)
      } catch {
        setError('Unable to load live opportunities data. Please verify backend connectivity and try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'scheme') {
      return opportunities.filter((o) => ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(o.status.toUpperCase()))
    }
    if (filter === 'simple') {
      return opportunities.filter((o) => normalizeEaseScore(o.effort_reward_score) >= 4)
    }
    if (filter === 'ghost') {
      return opportunities.filter((o) => {
        const text = `${o.workstream} ${o.description}`.toLowerCase()
        return text.includes('ghost') || text.includes('generic')
      })
    }
    if (filter === 'doac') {
      return opportunities.filter((o) => {
        const text = `${o.workstream} ${o.therapeutic_area ?? ''} ${o.description}`.toLowerCase()
        return text.includes('doac') || text.includes('apixaban') || text.includes('rivaroxaban') || text.includes('edoxaban')
      })
    }
    return opportunities
  }, [filter, opportunities])

  const total = opportunities.reduce((s, o) => s + o.estimated_annual_savings, 0)
  const included = opportunities.filter((o) => ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(o.status.toUpperCase())).length
  const title = selectedRole === 'pcn' ? 'Sheffield East PCN' : selectedRole === 'gp' ? 'Darnall Health Centre' : 'South Yorkshire ICB'

  const easeColor = (ease: number) => (ease >= 4 ? 'var(--ok)' : ease >= 3 ? 'var(--am)' : 'var(--re)')

  return (
    <div className="pg">
      <div className="ph">
        <span className="tag tag-teal" style={{ marginBottom: 8 }}>Live tenant data · {summary?.data_as_of ?? 'latest sync'}</span>
        <h1>{title} — All {opportunities.length} opportunities</h1>
        <p>Complete ranked list · all BNF chapters · 5-gate validated · choose which to pursue</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Total opportunities</div><div className="mc-v">{opportunities.length}</div><div className="mc-s nu">all BNF chapters</div></div>
        <div className="mc"><div className="mc-l">Total annual saving</div><div className="mc-v">£{Math.round(total / 1000)}k</div><div className="mc-s nu">if all actioned</div></div>
        <div className="mc"><div className="mc-l">ICB scheme opportunities</div><div className="mc-v">{included}</div><div className="mc-s up">Selected by ICB pharmacist</div></div>
        <div className="mc"><div className="mc-l">YTD saving (verified)</div><div className="mc-v">£{Math.round(summary?.realized_savings_ytd ?? 0).toLocaleString()}</div><div className="mc-s up">live dashboard summary</div></div>
      </div>

      {error ? <div className="err" style={{ marginBottom: '1rem' }}>{error}</div> : null}

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">All opportunities — ranked by annual saving</div>
            <div className="ch-s">Full list · click rows for intervention actioning</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className={`btn bs bsm ${filter === 'all' ? 'af' : ''}`} onClick={() => setFilter('all')}>All ({opportunities.length})</button>
            <button className={`btn bs bsm ${filter === 'scheme' ? 'af' : ''}`} onClick={() => setFilter('scheme')}>ICB scheme ({included})</button>
            <button className={`btn bs bsm ${filter === 'simple' ? 'af' : ''}`} onClick={() => setFilter('simple')}>Simple (ease ≥4)</button>
            <button className={`btn bs bsm ${filter === 'ghost' ? 'af' : ''}`} onClick={() => setFilter('ghost')}>Ghost generics</button>
            <button className={`btn bs bsm ${filter === 'doac' ? 'af' : ''}`} onClick={() => setFilter('doac')}>DOACs</button>
          </div>
        </div>

        <table className="tc" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Category</th>
              <th>Annual saving</th>
              <th>Per patient</th>
              <th>Patients</th>
              <th>Price change</th>
              <th>Ease</th>
              <th>BNF</th>
              {selectedRole === 'icb' ? <th>Scheme</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={selectedRole === 'icb' ? 11 : 10} className="pad">Loading opportunities...</td></tr>
            ) : null}
            {!loading && filtered.map((o, i) => {
              const ease = normalizeEaseScore(o.effort_reward_score)
              const perPatient = o.patients_affected > 0 ? o.estimated_annual_savings / o.patients_affected : 0
              const displayFrom = o.current_expensive_bnf || clip(o.description, 30)
              const displayTo = o.target_cheap_bnf || 'Target switch'
              const bnf = o.current_expensive_bnf || '—'
              return (
                <tr key={o.id}>
                  <td><div className={`rn ${i === 0 ? 'rn1' : i === 1 ? 'rn2' : i === 2 ? 'rn3' : 'rnn'}`}>{o.priority_rank ?? i + 1}</div></td>
                  <td><span className="pf">{clip(displayFrom, 28)}</span></td>
                  <td><span className="pt">{clip(displayTo, 28)}</span></td>
                  <td><span className="tag tag-blue" style={{ fontSize: 9 }}>{o.workstream || o.therapeutic_area || 'General'}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800, color: 'var(--ok)' }}>£{Math.round(o.estimated_annual_savings).toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--mid)' }}>£{Math.round(perPatient).toLocaleString()}</td>
                  <td><div style={{ fontSize: 13, fontWeight: 700 }}>{o.patients_affected.toLocaleString()}</div></td>
                  <td style={{ fontSize: 11 }}>—</td>
                  <td>
                    <div className="ease-b"><div className="ease-f" style={{ width: `${ease * 20}%`, background: easeColor(ease) }} /></div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{ease >= 4 ? 'Simple' : ease >= 3 ? 'Moderate' : 'Complex'}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{bnf}</td>
                  {selectedRole === 'icb' ? (
                    <td><div className={`tog ${['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(o.status.toUpperCase()) ? 'on' : ''}`} /></td>
                  ) : null}
                </tr>
              )
            })}
            {!loading && !filtered.length ? (
              <tr><td colSpan={selectedRole === 'icb' ? 11 : 10} className="pad">No opportunities found for this filter.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function normalizeEaseScore(score?: number | null) {
  if (!score && score !== 0) {
    return 3
  }
  if (score <= 1) {
    return Math.max(1, Math.min(5, Math.round(score * 5)))
  }
  if (score <= 5) {
    return Math.round(score)
  }
  return Math.max(1, Math.min(5, Math.round(score / 20)))
}

function clip(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}
