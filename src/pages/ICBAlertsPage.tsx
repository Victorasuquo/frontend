import { PRICE_ALERTS } from '../data/pocData'

export default function ICBAlertsPage() {
  return (
    <div className="pg">
      <div className="ph">
        <h1>Formulary price alerts</h1>
        <p>Auto-detected when Drug Tariff price rises and a cheaper alternative exists · 5-gate validated · 2-month sustained</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Open alerts</div><div className="mc-v">{PRICE_ALERTS.length}</div><div className="mc-s dn">Require ICB review</div></div>
        <div className="mc"><div className="mc-l">Combined saving</div><div className="mc-v">£14.3k/yr</div><div className="mc-s nu">if all actioned</div></div>
        <div className="mc"><div className="mc-l">Patients affected</div><div className="mc-v">156</div><div className="mc-s nu">across SY ICB</div></div>
        <div className="mc"><div className="mc-l">Resolved this month</div><div className="mc-v">1</div><div className="mc-s up">Sertraline alert resolved</div></div>
      </div>

      <div className="card">
        <div className="ch">
          <div className="ch-t">Active alerts</div>
          <div className="ch-s">Approve to update formulary and notify practices · Defer to review next month</div>
        </div>

        {PRICE_ALERTS.map((a, idx) => (
          <div key={idx} style={{ padding: '.9rem 1.15rem', borderBottom: '1px solid var(--border)', borderLeft: '3px solid var(--am)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)' }}>{a.drug}</div>
                <div style={{ display: 'flex', gap: 7, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className="tag tag-am">{a.cat}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{a.mo} months · Gate 2 ✓ · {a.pts} patients</span>
                </div>
              </div>
              <span style={{ background: 'var(--ok-bg)', color: 'var(--ok)', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{a.sav}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--mid)', marginBottom: 7, lineHeight: 1.6 }}>{a.why}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 11.5 }}>
              <span style={{ background: 'var(--re-bg)', color: 'var(--re)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--mono)', fontWeight: 700 }}>{a.fr}</span>
              <span style={{ color: 'var(--muted)' }}>→</span>
              <span style={{ background: 'var(--ok-bg)', color: 'var(--ok)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--mono)', fontWeight: 700 }}>{a.to}</span>
              <span style={{ color: 'var(--muted)', fontSize: 11 }}>with {a.alt}</span>
            </div>
            <div className="br" style={{ marginTop: 6 }}>
              <button className="btn bp bsm">Approve & notify practices ↗</button>
              <button className="btn bs bsm">Defer</button>
              <button className="btn bw bsm">Clinical governance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
