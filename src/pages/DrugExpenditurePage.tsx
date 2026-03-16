import { SL_DATA, fm } from '../data/slData'

export default function DrugExpenditurePage() {
  const d = SL_DATA
  const sorted = [...d.expenditure].sort((a, b) => Math.abs(b.yoyChange) - Math.abs(a.yoyChange))
  const totalSpend = d.expenditure.reduce((s, e) => s + e.currentYear, 0)
  const totalPrev = d.expenditure.reduce((s, e) => s + e.prevYear, 0)
  const totalChange = totalSpend - totalPrev
  const risers = d.expenditure.filter(e => e.yoyChange > 0).length
  const fallers = d.expenditure.filter(e => e.yoyChange < 0).length

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="tag tag-blue">Year-on-year analysis</span>
        </div>
        <h1>Drug expenditure tracker</h1>
        <p>Year-on-year spend comparison across the highest-value BNF categories — identifies unexpected budget pressures and efficiency gains</p>
      </div>

      {/* Metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Total tracked spend (current yr)</div>
          <div className="mc-v">{fm(totalSpend)}</div>
          <div className="mc-s dn">Top 10 BNF categories</div>
        </div>
        <div className="mc">
          <div className="mc-l">YoY change</div>
          <div className="mc-v" style={{ color: totalChange > 0 ? 'var(--re)' : 'var(--ok)' }}>
            {totalChange > 0 ? '+' : ''}{fm(totalChange)}
          </div>
          <div className="mc-s dn">vs prior year</div>
        </div>
        <div className="mc">
          <div className="mc-l">Categories with cost increase</div>
          <div className="mc-v" style={{ color: 'var(--re)' }}>{risers}</div>
          <div className="mc-s dn">Require review</div>
        </div>
        <div className="mc">
          <div className="mc-l">Categories with cost reduction</div>
          <div className="mc-v" style={{ color: 'var(--ok)' }}>{fallers}</div>
          <div className="mc-s nu">Efficiencies delivered</div>
        </div>
      </div>

      {/* Expenditure table */}
      <div className="card" style={{ marginBottom: '1.1rem' }}>
        <div className="ch">
          <div className="ch-t">Year-on-year drug expenditure</div>
          <div className="ch-s">Sorted by absolute year-on-year change</div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>BNF category</th>
              <th>Prior year (2023–24)</th>
              <th>Current year (2024–25)</th>
              <th>Change (£)</th>
              <th>Change (%)</th>
              <th>Trend</th>
              <th>Driver</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => {
              const pctChange = Math.round(e.yoyChange / e.prevYear * 100)
              const isIncrease = e.yoyChange > 0
              return (
                <tr key={e.category}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{e.category}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{e.bnfChapter}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fm(e.prevYear)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700 }}>{fm(e.currentYear)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: isIncrease ? 'var(--re)' : 'var(--ok)' }}>
                    {isIncrease ? '+' : ''}{fm(e.yoyChange)}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12, fontWeight: 800,
                      color: isIncrease ? 'var(--re)' : 'var(--ok)'
                    }}>
                      {isIncrease ? '▲' : '▼'} {Math.abs(pctChange)}%
                    </span>
                  </td>
                  <td>
                    {/* Mini bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {e.monthlyTrend.slice(-6).map((v, i) => {
                        const prev = e.monthlyTrend[e.monthlyTrend.length - 7 + i] ?? v
                        const isUp = v >= prev
                        return (
                          <div key={i} style={{ width: 5, height: Math.max(6, Math.round(v / Math.max(...e.monthlyTrend) * 24)), background: isUp ? 'var(--re)' : 'var(--ok)', borderRadius: 2 }} />
                        )
                      })}
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--mid)', maxWidth: 140 }}>{e.driver}</td>
                  <td>
                    <button className="btn bs bsm" onClick={() => alert(`Drill-down for ${e.category}`)}>Detail</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Waterfall chart — spend movers */}
      <div className="card">
        <div className="ch">
          <div className="ch-t">Spend movement — top drivers</div>
          <div className="ch-s">Largest contributors to YoY spend change</div>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          {sorted.slice(0, 6).map(e => {
            const maxAbs = Math.max(...sorted.map(x => Math.abs(x.yoyChange)))
            const barWidth = Math.round(Math.abs(e.yoyChange) / maxAbs * 100)
            const isInc = e.yoyChange > 0
            return (
              <div key={e.category} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 160, fontSize: 11.5, fontWeight: 600, color: 'var(--slate)', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {e.category}
                </div>
                <div style={{ flex: 1, height: 22, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${barWidth}%`, height: '100%', background: isInc ? 'var(--re)' : 'var(--ok)', borderRadius: 4 }} />
                </div>
                <div style={{ width: 90, fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: isInc ? 'var(--re)' : 'var(--ok)', textAlign: 'right' }}>
                  {isInc ? '+' : ''}{fm(e.yoyChange)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
