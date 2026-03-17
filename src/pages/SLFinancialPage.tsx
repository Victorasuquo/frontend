import { SL_DATA, TOP_OPPS, fm, pct } from '../data/slData'

export default function SLFinancialPage() {
  const d = SL_DATA
  const totSpend = Object.values(d.subICBs).reduce((s, b) => s + b.spend, 0)
  const totBudget = Object.values(d.subICBs).reduce((s, b) => s + b.budget, 0)
  const totSav = Object.values(d.subICBs).reduce((s, b) => s + b.savDelivered, 0)
  const totPot = Object.values(d.subICBs).reduce((s, b) => s + b.savPotential, 0)
  const cumSav = d.monthlyTrend[d.monthlyTrend.length - 1].cumSaving

  const rankClass = (i: number) => i === 0 ? 'rn1' : i === 1 ? 'rn2' : i === 2 ? 'rn3' : 'rnn'

  return (
    <div className="pg">
      <div className="ph">
        <h1>Financial performance</h1>
        <p>Medicines expenditure · savings delivered · switch value ranking · budget position</p>
      </div>

      {/* 4 metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Total prescribing spend YTD</div>
          <div className="mc-v">{fm(totSpend)}</div>
          <div className={`mc-s ${totSpend < totBudget ? 'up' : 'dn'}`}>
            {totSpend < totBudget ? 'Under' : 'Over'} budget by {fm(Math.abs(totBudget - totSpend))}
          </div>
        </div>
        <div className="mc">
          <div className="mc-l">Savings delivered YTD</div>
          <div className="mc-v">{fm(totSav)}</div>
          <div className="mc-s up">Verified in EPD data</div>
        </div>
        <div className="mc">
          <div className="mc-l">Cumulative saving (Apr–Mar)</div>
          <div className="mc-v">{fm(cumSav)}</div>
          <div className="mc-s up">{pct(cumSav, totPot)}% of annual potential</div>
        </div>
        <div className="mc">
          <div className="mc-l">Unrealised saving remaining</div>
          <div className="mc-v">{fm(totPot - totSav)}</div>
          <div className="mc-s dn">This financial year</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.1rem', marginBottom: '1.1rem' }}>
        {/* Top 10 switches table */}
        <div className="card">
          <div className="ch">
            <div>
              <div className="ch-t">Top 10 switches by annual saving</div>
              <div className="ch-s">Which switch saves the most — full ICB value · ranked</div>
            </div>
          </div>
          <table className="tc">
            <thead>
              <tr>
                <th>#</th>
                <th>Switch</th>
                <th>Category</th>
                <th>Annual saving</th>
                <th>Per patient</th>
                <th>Patients</th>
                <th>% of potential</th>
              </tr>
            </thead>
            <tbody>
              {TOP_OPPS.map((o, i) => (
                <tr key={o.id}>
                  <td><div className={`rn ${rankClass(i)}`}>{i + 1}</div></td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{o.fr}</div>
                    <div style={{ fontSize: 10, color: 'var(--ok)' }}>→ {o.to}</div>
                  </td>
                  <td><span className="tag tag-blue" style={{ fontSize: 9 }}>{o.cat}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)', fontSize: 14 }}>{fm(o.sav)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted)' }}>£{o.pp}</td>
                  <td style={{ fontSize: 12 }}>{o.pts.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, Math.round(o.sav / totPot * 500))}%`, background: 'var(--tm)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 10 }}>{(o.sav / totPot * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div>
          {/* Savings by sub-ICB bars */}
          <div className="card" style={{ marginBottom: '1.1rem' }}>
            <div className="ch">
              <div className="ch-t">Savings delivered by sub-ICB</div>
            </div>
            {Object.values(d.subICBs).map(s => {
              const p = pct(s.savDelivered, s.savPotential)
              const barColor = p > 60 ? 'var(--ok)' : p > 35 ? 'var(--am)' : 'var(--re)'
              return (
                <div key={s.code} style={{ padding: '.75rem 1.1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ok)' }}>{fm(s.savDelivered)}</div>
                  </div>
                  <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ height: '100%', width: `${p}%`, background: barColor, borderRadius: 4 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
                    <span>{p}% of {fm(s.savPotential)} potential</span>
                    <span>{fm(s.savPotential - s.savDelivered)} remaining</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Budget position */}
          <div className="card">
            <div className="ch">
              <div className="ch-t">Budget position by sub-ICB</div>
            </div>
            <table className="tc">
              <thead>
                <tr>
                  <th>Sub-ICB</th>
                  <th>Spend</th>
                  <th>Budget</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(d.subICBs).map(s => {
                  const diff = s.budget - s.spend
                  return (
                    <tr key={s.code}>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5 }}>{fm(s.spend)}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5 }}>{fm(s.budget)}</td>
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 700, color: diff > 0 ? 'var(--ok)' : 'var(--re)' }}>
                          {diff > 0 ? 'Under by ' : 'Over by '}{fm(Math.abs(diff))}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
