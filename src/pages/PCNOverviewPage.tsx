import { PRACS } from '../data/pocData'

export function PCNOverviewPage() {
  const ts = PRACS.reduce((s, p) => s + p.sav, 0)
  const tp = PRACS.reduce((s, p) => s + p.pot, 0)
  const swDone = PRACS.reduce((s, p) => s + p.done, 0)
  const swTotal = PRACS.reduce((s, p) => s + p.sw, 0)

  return (
    <div className="pg">
      <div className="ph">
        <h1>Sheffield East PCN — Overview</h1>
        <p>Network level · 8 practices · Week of 10 Mar 2026</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">PCN savings YTD</div><div className="mc-v">£{Math.round(ts / 1000)}k</div><div className="mc-s up">↑ £9.9k this week</div></div>
        <div className="mc"><div className="mc-l">Remaining potential</div><div className="mc-v">£{Math.round((tp - ts) / 1000)}k</div><div className="mc-s nu">this financial year</div></div>
        <div className="mc"><div className="mc-l">Switches complete</div><div className="mc-v">{swDone}/{swTotal}</div><div className="mc-s up">across PCN</div></div>
        <div className="mc"><div className="mc-l">Open price alerts</div><div className="mc-v">4</div><div className="mc-s dn">Require action</div></div>
      </div>

      <div className="card">
        <div className="ch"><div className="ch-t">Practices</div></div>
        {PRACS.map((p) => {
          const progress = Math.round((p.sav / p.pot) * 100)
          return (
            <div className="pr" key={p.id}>
              <div className={`rag rag-${p.rag}`} />
              <div style={{ flex: 1 }}>
                <div className="pr-n">{p.nm}</div>
                <div className="pr-s">{p.done}/{p.sw} switches · {p.pts.toLocaleString()} patients</div>
                <div className="pr-bar" style={{ marginTop: 4, width: 140 }}><div className="pr-bf" style={{ width: `${progress}%` }} /></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pr-v">£{p.sav.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{progress}%</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
