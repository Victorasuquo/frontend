import { PRACS } from '../data/pocData'

export function PracticesPage() {
  return (
    <div className="pg">
      <div className="ph">
        <h1>Practice performance</h1>
        <p>All South Yorkshire ICB practices · savings tracking</p>
      </div>

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
            {PRACS.map((p) => {
              const progress = Math.round((p.sav / p.pot) * 100)
              const status = p.done === p.sw ? 'Complete' : p.done > 0 ? 'Active' : 'Not started'
              const sb = p.done === p.sw ? 'sb-ok' : p.done > 0 ? 'sb-w' : 'sb-b'
              return (
                <tr key={p.id}>
                  <td><div className={`rag rag-${p.rag}`} style={{ margin: '0 auto' }} /></td>
                  <td><div style={{ fontWeight: 700 }}>{p.nm}</div><div style={{ fontSize: 10, color: 'var(--muted)' }}>{p.id}</div></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{p.pcn}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>£{p.sav.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="pr-bar"><div className="pr-bf" style={{ width: `${progress}%` }} /></div>
                      <span style={{ fontSize: 11 }}>{progress}%</span>
                    </div>
                  </td>
                  <td>{p.done}/{p.sw}</td>
                  <td style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.pts.toLocaleString()}</td>
                  <td><span className={`sb ${sb}`}><span className="sd" />{status}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
