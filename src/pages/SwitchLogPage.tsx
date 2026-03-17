import { useEffect, useMemo, useState } from 'react'
import { getInterventions, getSavingsSummary } from '../api/client'
import { useSessionState } from '../hooks/useSessionState'
import type { InterventionItem, SavingsSummaryResponse } from '../types'

interface SwitchLogStoredState {
  interventions: InterventionItem[]
  savings: SavingsSummaryResponse | null
}

export default function SwitchLogPage() {
  const [storedState, setStoredState] = useSessionState<SwitchLogStoredState>('medsave-switch-log', {
    interventions: [],
    savings: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { interventions, savings } = storedState

  useEffect(() => {
    if (interventions.length && savings) {
      setLoading(false)
      return
    }

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [ints, sav] = await Promise.all([getInterventions(), getSavingsSummary()])
        setStoredState({ interventions: ints, savings: sav })
      } catch {
        setError('Unable to load switch log data from API endpoints.')
      } finally {
        setLoading(false)
      }
    })()
  }, [interventions.length, savings, setStoredState])

  const completed = useMemo(() => interventions.filter((i) => i.status === 'COMPLETED'), [interventions])
  const inProgress = useMemo(() => interventions.filter((i) => i.status !== 'COMPLETED'), [interventions])
  const totalRealized = useMemo(() => interventions.reduce((s, i) => s + (i.realized_savings || 0), 0), [interventions])
  const verified = useMemo(() => completed.reduce((s, i) => s + (i.realized_savings || 0), 0), [completed])

  return (
    <div className="pg">
      <div className="ph">
        <h1>Switch log</h1>
        <p>Live audit and realization view from interventions and savings endpoints.</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Switches complete</div><div className="mc-v">{completed.length}</div><div className="mc-s up">completed interventions</div></div>
        <div className="mc"><div className="mc-l">In progress</div><div className="mc-v">{inProgress.length}</div><div className="mc-s dn">active or draft</div></div>
        <div className="mc"><div className="mc-l">Saving delivered</div><div className="mc-v">£{Math.round(totalRealized).toLocaleString()}</div><div className="mc-s up">from interventions</div></div>
        <div className="mc"><div className="mc-l">EPD verified proxy</div><div className="mc-v">£{Math.round(verified).toLocaleString()}</div><div className="mc-s up">completed interventions</div></div>
      </div>

      {savings ? (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="ch"><div className="ch-t">Savings summary</div><div className="ch-s">/api/savings/summary</div></div>
          <div className="pad">YTD total: <strong>£{Math.round(savings.ytd_total).toLocaleString()}</strong> · Forecast: <strong>£{Math.round(savings.total_forecast).toLocaleString()}</strong></div>
        </div>
      ) : null}

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">Intervention switch audit log</div>
            <div className="ch-s">Live from /api/interventions</div>
          </div>
        </div>
        {loading ? <div className="pad">Loading switch log...</div> : null}
        {error ? <div className="pad" style={{ color: 'var(--re)' }}>{error}</div> : null}
        {!loading && !error ? (
          <table className="tc">
            <thead>
              <tr>
                <th>Intervention</th>
                <th>Switch</th>
                <th>Status</th>
                <th>Patients switched</th>
                <th>Realized</th>
                <th>Forecast</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div className="cell-main">{i.name}</div>
                    <div className="cell-sub">{i.therapeutic_area || i.workstream_code || '—'}</div>
                  </td>
                  <td>{i.current_drug} → {i.target_drug}</td>
                  <td>
                    <span className={`sb ${i.status === 'COMPLETED' ? 'sb-ok' : 'sb-w'}`}>
                      <span className="sd" />
                      {i.status}
                    </span>
                  </td>
                  <td>{i.patients_switched.toLocaleString()}</td>
                  <td className="strong">£{Math.round(i.realized_savings).toLocaleString()}</td>
                  <td>£{Math.round(i.forecast_annual_savings || 0).toLocaleString()}</td>
                </tr>
              ))}
              {!interventions.length ? (
                <tr><td colSpan={6} className="pad">No interventions returned for this tenant.</td></tr>
              ) : null}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}
