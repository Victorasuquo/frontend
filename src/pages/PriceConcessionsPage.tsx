import { SL_DATA, fm } from '../data/slData'

export default function PriceConcessionsPage() {
  const d = SL_DATA
  const latest = d.concessions[d.concessions.length - 1]
  const totalImpact = d.concessions.reduce((s, c) => s + c.totalImpact, 0)
  const maxImpact = Math.max(...d.concessions.map(c => c.totalImpact))

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="tag tag-re">Live concession tracking</span>
        </div>
        <h1>Price concessions tracker</h1>
        <p>NHS England issues price concessions when a drug cannot be supplied at Drug Tariff price — these create unplanned budget pressures requiring active management</p>
      </div>

      {/* Metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Active concessions this month</div>
          <div className="mc-v">{latest.count}</div>
          <div className="mc-s dn">Across South Yorkshire ICB</div>
        </div>
        <div className="mc">
          <div className="mc-l">This month cost impact</div>
          <div className="mc-v">{fm(latest.totalImpact)}</div>
          <div className="mc-s dn">above Drug Tariff</div>
        </div>
        <div className="mc">
          <div className="mc-l">YTD concession overspend</div>
          <div className="mc-v">{fm(totalImpact)}</div>
          <div className="mc-s dn">April to date</div>
        </div>
        <div className="mc">
          <div className="mc-l">Gate 2 trigger status</div>
          <div className="mc-v" style={{ color: latest.totalImpact > 80000 ? 'var(--re)' : 'var(--am)' }}>
            {latest.totalImpact > 80000 ? 'TRIGGERED' : 'APPROACH'}
          </div>
          <div className="mc-s dn">{latest.totalImpact > 80000 ? 'Escalation required' : 'Monitor closely'}</div>
        </div>
      </div>

      {/* Monthly cost impact bars */}
      <div className="card" style={{ marginBottom: '1.1rem' }}>
        <div className="ch">
          <div className="ch-t">Monthly concession cost impact</div>
          <div className="ch-s">Total cost above Drug Tariff per month</div>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          {d.concessions.map(c => {
            const pct = Math.round(c.totalImpact / maxImpact * 100)
            const col = c.totalImpact > 80000 ? 'var(--re)' : c.totalImpact > 50000 ? 'var(--am)' : 'var(--ok)'
            return (
              <div key={c.month} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 36, fontSize: 11, fontWeight: 700, color: 'var(--muted)', textAlign: 'right' }}>{c.month}</div>
                <div style={{ flex: 1, height: 28, background: 'var(--border)', borderRadius: 'var(--rs)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: col, borderRadius: 'var(--rs)', transition: 'width .4s' }} />
                  <div style={{ position: 'absolute', left: 10, top: 0, height: '100%', display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 700, color: pct > 30 ? '#fff' : 'var(--slate)' }}>
                    {c.count} concessions
                  </div>
                </div>
                <div style={{ width: 80, fontFamily: 'var(--mono)', fontWeight: 800, color: col, fontSize: 13, textAlign: 'right' }}>{fm(c.totalImpact)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top concession drugs this month */}
      <div className="card" style={{ marginBottom: '1.1rem' }}>
        <div className="ch">
          <div className="ch-t">Top concession drugs — {latest.month}</div>
          <div className="ch-s">Highest impact items requiring immediate action</div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Drug Tariff price</th>
              <th>Concession price</th>
              <th>% increase</th>
              <th>Est. monthly items</th>
              <th>Monthly overspend</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {latest.topDrugs.map((drug, i) => {
              const pctInc = Math.round((drug.concessionPrice - drug.tariffPrice) / drug.tariffPrice * 100)
              const overspend = (drug.concessionPrice - drug.tariffPrice) * drug.monthlyItems
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: 12 }}>{drug.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{drug.tariffPrice}p</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--re)', fontWeight: 700 }}>{drug.concessionPrice}p</td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 800, color: pctInc > 50 ? 'var(--re)' : 'var(--am)' }}>+{pctInc}%</span>
                  </td>
                  <td style={{ fontSize: 11.5 }}>{drug.monthlyItems.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--re)' }}>+{fm(overspend)}</td>
                  <td>
                    <button className="btn bs bsm">Review</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Gate 2 trigger guidance */}
      <div className="card">
        <div className="ch">
          <div className="ch-t">Quarter 2 Gate review status</div>
          <div className="ch-s">Concession trigger thresholds for ICB escalation</div>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          {[
            { label: 'Monthly threshold', value: 80000, current: latest.totalImpact },
            { label: 'Q2 cumulative threshold', value: 200000, current: totalImpact },
          ].map(gate => {
            const pct = Math.min(100, Math.round(gate.current / gate.value * 100))
            const triggered = gate.current >= gate.value
            return (
              <div key={gate.label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)' }}>{gate.label}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: triggered ? 'var(--re)' : 'var(--am)', fontWeight: 700 }}>
                    {fm(gate.current)} / {fm(gate.value)} {triggered ? '— TRIGGERED' : `— ${100 - pct}% headroom`}
                  </span>
                </div>
                <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: triggered ? 'var(--re)' : pct > 80 ? 'var(--am)' : 'var(--ok)', borderRadius: 5 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
