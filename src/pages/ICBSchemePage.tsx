import { useMemo, useState } from 'react'
import { OPPS, type Opp } from '../data/pocData'

export default function ICBSchemePage() {
  const [included, setIncluded] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(OPPS.map((o) => [o.id, o.inc])),
  )

  const includedOpps = useMemo(() => OPPS.filter((o) => included[o.id]), [included])
  const total = includedOpps.reduce((s, o) => s + o.sav, 0)

  const toggle = (id: number) => setIncluded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="pg">
      <div className="ph">
        <h1>QIPP scheme builder</h1>
        <p>Select which opportunities to include in the ICB prescribing incentive scheme</p>
      </div>

      <div className="mets m3">
        <div className="mc"><div className="mc-l">Included in scheme</div><div className="mc-v">{includedOpps.length}</div><div className="mc-s nu">of {OPPS.length} total</div></div>
        <div className="mc"><div className="mc-l">Scheme value</div><div className="mc-v">£{Math.round(total / 1000)}k/yr</div><div className="mc-s up">estimated annual saving</div></div>
        <div className="mc"><div className="mc-l">Practices receiving</div><div className="mc-v">105</div><div className="mc-s nu">South Yorkshire ICB</div></div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">Select scheme opportunities</div>
            <div className="ch-s">Practices will see included items in their weekly top 5 — toggle to add/remove</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn bp bsm">Publish scheme ↗</button>
            <button className="btn bs bsm">Export CSV</button>
          </div>
        </div>

        {OPPS.map((o: Opp) => (
          <div key={o.id} style={{ padding: '.85rem 1.1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className={`tog ${included[o.id] ? 'on' : ''}`} onClick={() => toggle(o.id)} aria-label="toggle inclusion" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)' }}>{o.fr} → {o.to}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {o.ch} · {o.pts.toLocaleString()} patients · £{o.pp}/patient/yr · <span className="tag tag-blue" style={{ fontSize: 9 }}>{o.cat}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ok)', fontFamily: 'var(--mono)' }}>£{o.sav.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>/yr ICB total</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
