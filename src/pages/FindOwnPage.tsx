import { useState } from 'react'
import { findOpportunities } from '../api/client'
import { useSessionState } from '../hooks/useSessionState'
import type { OpportunityIdea } from '../types'

interface FindOwnStoredState {
  query: string
  results: OpportunityIdea[]
}

export default function FindOwnPage() {
  const [storedState, setStoredState] = useSessionState<FindOwnStoredState>('medsave-find-own', {
    query: '',
    results: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { query, results } = storedState

  const run = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await findOpportunities(query.trim(), 8)
      setStoredState((current) => ({ ...current, results: data.opportunities }))
    } catch {
      setError('Could not fetch opportunities from API. Please verify backend is running and retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pg">
      <div className="ph">
        <h1>Find my own</h1>
        <p>Enter a free-text idea and let the API return clinically framed opportunities with estimates.</p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="pad">
          <div className="fl" style={{ marginBottom: 8 }}>Opportunity prompt</div>
          <textarea
            className="fi"
            style={{ minHeight: 95, resize: 'vertical' }}
            placeholder="e.g. identify lower-cost alternatives for branded antihypertensives"
            value={query}
            onChange={(e) => setStoredState((current) => ({ ...current, query: e.target.value }))}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn bp" onClick={() => void run()} disabled={loading}>{loading ? 'Searching...' : 'Search opportunities'}</button>
            <button className="btn bs" onClick={() => { setStoredState({ query: '', results: [] }); setError(null) }}>Clear</button>
          </div>
          {error ? <div className="err">{error}</div> : null}
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">Discovery results</div>
            <div className="ch-s">Live from /api/ai-search/find-opportunities</div>
          </div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Title</th>
              <th>Drugs</th>
              <th>Savings</th>
              <th>Patients</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {results.map((o, i) => (
              <tr key={`${o.title}-${i}`}>
                <td className="cell-main">{o.title}</td>
                <td>{o.current_drug ?? 'Current'} → {o.target_drug ?? 'Target'}</td>
                <td className="strong">£{Math.round(o.estimated_annual_savings).toLocaleString()}</td>
                <td>{o.affected_patients.toLocaleString()}</td>
                <td className="cell-sub">{o.rationale}</td>
              </tr>
            ))}
            {!results.length ? (
              <tr>
                <td colSpan={5} className="pad">No results yet. Run a prompt to generate opportunities.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
