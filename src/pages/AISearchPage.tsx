import { useEffect, useMemo, useState } from 'react'
import { findOpportunities, getAISuggestions, runClinicalQuery } from '../api/client'
import { useSessionState } from '../hooks/useSessionState'
import type { ClinicalQueryResponse, OpportunityIdea } from '../types'

interface AISearchStoredState {
  query: string
  suggestions: string[]
  clinical: ClinicalQueryResponse | null
  ideas: OpportunityIdea[]
}

const FALLBACK_SUGGESTIONS = [
  'Find high-savings DPP4 opportunities in adults with recent HbA1c under 75 mmol/mol',
  'Show PPI liquid-to-capsule switch candidates excluding swallowing difficulties',
  'Identify repeat prescriptions for expensive brands where generic equivalent exists',
]

export default function AISearchPage() {
  const [storedState, setStoredState] = useSessionState<AISearchStoredState>('medsave-ai-search', {
    query: '',
    suggestions: [],
    clinical: null,
    ideas: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { query, suggestions, clinical, ideas } = storedState

  const updateStoredState = (patch: Partial<AISearchStoredState>) => {
    setStoredState((current) => ({ ...current, ...patch }))
  }

  useEffect(() => {
    if (suggestions.length) {
      return
    }

    void (async () => {
      try {
        const s = await getAISuggestions()
        updateStoredState({ suggestions: s.length ? s : FALLBACK_SUGGESTIONS })
      } catch {
        updateStoredState({ suggestions: FALLBACK_SUGGESTIONS })
      }
    })()
  }, [suggestions.length])

  const run = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const [c, f] = await Promise.all([
        runClinicalQuery(query.trim(), 'both'),
        findOpportunities(query.trim(), 6),
      ])
      updateStoredState({ clinical: c, ideas: f.opportunities })
    } catch {
      setError('AI endpoints are unavailable right now. Check backend auth/session and retry.')
    } finally {
      setLoading(false)
    }
  }

  const totalSaving = useMemo(() => ideas.reduce((s, i) => s + (i.estimated_annual_savings || 0), 0), [ideas])
  const totalPatients = useMemo(() => ideas.reduce((s, i) => s + (i.affected_patients || 0), 0), [ideas])

  return (
    <div className="pg">
      <div className="ph">
        <h1>AI patient search</h1>
        <p>Describe your clinical query and generate structured EMIS/SystmOne search logic with ranked opportunities.</p>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="pad">
          <div className="fl" style={{ marginBottom: 8 }}>Clinical query</div>
          <textarea
            className="fi"
            style={{ minHeight: 100, resize: 'vertical', marginBottom: 10 }}
            placeholder="e.g. Find high-savings brand-to-generic opportunities in cardiovascular medicines"
            value={query}
            onChange={(e) => updateStoredState({ query: e.target.value })}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {suggestions.slice(0, 6).map((s) => (
              <button key={s} className="btn bs bsm" onClick={() => updateStoredState({ query: s })}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn bp" onClick={() => void run()} disabled={loading}>{loading ? 'Running AI...' : 'Find opportunities'}</button>
            <button
              className="btn bs"
              onClick={() => {
                setError(null)
                setStoredState((current) => ({ ...current, query: '', clinical: null, ideas: [] }))
              }}
            >
              Clear
            </button>
          </div>
          {error ? <div className="err">{error}</div> : null}
        </div>
      </div>

      <div className="mets m3">
        <div className="mc"><div className="mc-l">Opportunities returned</div><div className="mc-v">{ideas.length}</div><div className="mc-s nu">from AI ranking</div></div>
        <div className="mc"><div className="mc-l">Affected patients</div><div className="mc-v">{totalPatients.toLocaleString()}</div><div className="mc-s up">estimated by model</div></div>
        <div className="mc"><div className="mc-l">Estimated annual saving</div><div className="mc-v">£{Math.round(totalSaving).toLocaleString()}</div><div className="mc-s up">portfolio estimate</div></div>
      </div>

      {clinical ? (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="ch">
            <div>
              <div className="ch-t">Generated clinical query logic</div>
              <div className="ch-s">Target: {clinical.target_system}</div>
            </div>
          </div>
          <div style={{ padding: '1rem 1.15rem' }}>
            <div className="fl" style={{ marginBottom: 6 }}>EMIS query</div>
            <div className="cbox" style={{ marginBottom: 8 }}><pre>{clinical.emis_query}</pre></div>
            <div className="fl" style={{ marginBottom: 6 }}>SystmOne query</div>
            <div className="cbox"><pre>{clinical.systmone_query}</pre></div>
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">AI opportunity shortlist</div>
            <div className="ch-s">Live results from /api/ai-search/find-opportunities</div>
          </div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Saving</th>
              <th>Patients</th>
              <th>BNF</th>
              <th>Exclusions</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((o, idx) => (
              <tr key={`${o.title}-${idx}`}>
                <td>
                  <div className="cell-main">{o.title}</div>
                  <div className="cell-sub">{o.current_drug ?? 'Current'} → {o.target_drug ?? 'Target'}</div>
                </td>
                <td className="strong">£{Math.round(o.estimated_annual_savings).toLocaleString()}</td>
                <td>{o.affected_patients.toLocaleString()}</td>
                <td>{(o.bnf_codes || []).join(', ') || '—'}</td>
                <td>{(o.exclusions || []).slice(0, 2).join(' · ') || '—'}</td>
              </tr>
            ))}
            {!ideas.length ? (
              <tr>
                <td colSpan={5} className="pad">Run a query to populate AI opportunities.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
