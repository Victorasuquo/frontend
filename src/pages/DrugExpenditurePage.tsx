import { SL_DATA } from '../data/slData'

function money(n: number): string {
  return `£${n.toLocaleString()}`
}

function trendSvg(isUp: boolean) {
  const color = isUp ? '#C0392B' : '#0B6E5B'
  return (
    <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
      <path d={isUp ? 'M2 20 L78 2' : 'M2 2 L78 20'} stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function actionFor(category: string): string {
  if (category.includes('Dapagliflozin')) return 'Generic now available — switch from Forxiga brand urgently'
  if (category.includes('Empagliflozin')) return 'Generic now available — switch from Jardiance brand'
  if (category.includes('GLP-1')) return 'Monitor — high growth area, biosimilars expected 2026-27'
  if (category.includes('Pregabalin')) return 'Review neuropathic pain indication only — gabapentin switch programme'
  if (category.includes('Adalimumab')) return 'Continue biosimilar programme — target 85% biosimilar by Q4'
  if (category.includes('Rivaroxaban') || category.includes('Apixaban')) return 'Continue conversion to generic where clinically appropriate'
  return 'Monitor trend and review prescribing drivers'
}

export default function DrugExpenditurePage() {
  const d = SL_DATA
  const rows = [...d.expenditure].sort((a, b) => Math.abs(b.yoyChange) - Math.abs(a.yoyChange))

  const highGrowth = rows.filter((e) => (e.prevYear > 0 ? ((e.currentYear - e.prevYear) / e.prevYear) * 100 : 0) > 30).length
  const reduced = rows.filter((e) => e.currentYear < e.prevYear).length

  const exportCsv = () => {
    const csvRows = ['Drug Class,BNF,Spend 2023/24,Spend 2024/25,Change %,Driver,Action']
    rows.forEach((e) => {
      const pct = e.prevYear > 0 ? Math.round(((e.currentYear - e.prevYear) / e.prevYear) * 100) : 999
      csvRows.push([
        `"${e.category}"`,
        e.bnfChapter,
        `"${money(e.prevYear)}"`,
        `"${money(e.currentYear)}"`,
        pct === 999 ? 'NEW' : `${pct}%`,
        `"${e.driver}"`,
        `"${actionFor(e.category)}"`,
      ].join(','))
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'SY_ICB_Drug_Expenditure.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="pg">
      <div className="ph">
        <h1>Drug expenditure monitoring</h1>
        <p>High-spend and high-growth drug classes · budget impact · unplanned expenditure alerts</p>
      </div>

      <div className="mets m3">
        <div className="mc">
          <div className="mc-l">High-growth drug classes (&gt;30%)</div>
          <div className="mc-v">{highGrowth}</div>
          <div className="mc-s dn">Require budget review</div>
        </div>
        <div className="mc">
          <div className="mc-l">New high-cost drugs (this year)</div>
          <div className="mc-v">2</div>
          <div className="mc-s dn">Tezepelumab, inclisiran</div>
        </div>
        <div className="mc">
          <div className="mc-l">Drugs successfully reduced</div>
          <div className="mc-v">{reduced}</div>
          <div className="mc-s up">Switch programmes working</div>
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">Drug expenditure tracker — high-spend BNF lines</div>
            <div className="ch-s">Year-on-year spend change · 2023/24 vs 2024/25 · actions and alerts</div>
          </div>
          <button className="btn bs bsm" onClick={exportCsv}>Export CSV</button>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Drug class</th>
              <th>BNF</th>
              <th>Spend 23/24</th>
              <th>Spend 24/25</th>
              <th>Change</th>
              <th>Trend</th>
              <th>Driver</th>
              <th>Action / status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const pct = e.prevYear > 0 ? Math.round(((e.currentYear - e.prevYear) / e.prevYear) * 100) : 999
              const isUp = pct === 999 || pct > 0
              const col = pct === 999 || pct > 50 ? 'var(--re)' : pct > 20 ? 'var(--am)' : pct < 0 ? 'var(--ok)' : 'var(--muted)'
              const barW = pct === 999 ? 80 : (Math.min(Math.abs(pct), 150) / 150) * 80
              const action = actionFor(e.category)
              const actionColor = action.includes('urgently') || action.includes('immediately') ? 'var(--re)' : action.includes('Continue') ? 'var(--ok)' : 'var(--mid)'

              return (
                <tr key={e.category}>
                  <td><div style={{ fontWeight: 700, fontSize: 12.5 }}>{e.category}</div></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{e.bnfChapter}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5 }}>{money(e.prevYear)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 700 }}>{money(e.currentYear)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: `${barW}px`, height: 6, background: col, borderRadius: 3, opacity: 0.8 }} />
                      <span style={{ fontSize: 12, fontWeight: 800, color: col }}>{pct === 999 ? 'NEW' : `${isUp ? '+' : ''}${pct}%`}</span>
                    </div>
                  </td>
                  <td>{trendSvg(isUp)}</td>
                  <td style={{ fontSize: 11, color: 'var(--mid)', maxWidth: 180, lineHeight: 1.5 }}>{e.driver}</td>
                  <td style={{ fontSize: 11, color: actionColor, lineHeight: 1.5 }}>{action}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
