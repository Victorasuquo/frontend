import { SL_DATA, fm } from '../data/slData'

export default function PatentWatchPage() {
  const d = SL_DATA
  const sorted = [...d.patentExpiry].sort((a, b) => b.annualSaving - a.annualSaving)
  const totalPipeline = sorted.reduce((s, p) => s + p.annualSaving, 0)
  const imminent = sorted.filter(p => p.monthsToExpiry <= 6).length

  const statusColor = (status: string) => {
    if (status === 'Expired' || status === 'Generic available') return 'var(--ok)'
    if (status === 'Imminent') return 'var(--am)'
    return 'var(--re)'
  }
  const statusBg = (status: string) => {
    if (status === 'Expired' || status === 'Generic available') return 'var(--ok-bg)'
    if (status === 'Imminent') return 'var(--am-bg)'
    return '#FEF2F2'
  }

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="tag tag-am">Patent watch</span>
          <span className="tag tag-re">{imminent} imminent in 6 months</span>
        </div>
        <h1>Patent expiry pipeline</h1>
        <p>Track upcoming patent expiries to plan proactive generic switch programmes before branded prescribing embeds at practice level</p>
      </div>

      {/* Metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Total pipeline opportunity</div>
          <div className="mc-v">{fm(totalPipeline)}</div>
          <div className="mc-s nu">over next 24 months</div>
        </div>
        <div className="mc">
          <div className="mc-l">Imminent expiries (&le;6 months)</div>
          <div className="mc-v" style={{ color: 'var(--am)' }}>{imminent}</div>
          <div className="mc-s dn">Act now to influence prescribing</div>
        </div>
        <div className="mc">
          <div className="mc-l">Drugs in pipeline</div>
          <div className="mc-v">{sorted.length}</div>
          <div className="mc-s dn">Being tracked</div>
        </div>
        <div className="mc">
          <div className="mc-l">Average saving per drug</div>
          <div className="mc-v">{fm(Math.round(totalPipeline / sorted.length))}</div>
          <div className="mc-s nu">per year at 100% conversion</div>
        </div>
      </div>

      {/* Patent expiry table */}
      <div className="card">
        <div className="ch">
          <div className="ch-t">Patent expiry pipeline</div>
          <div className="ch-s">Sorted by annual saving opportunity · engage practices before generic launch</div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>#</th>
              <th>Drug</th>
              <th>Indication</th>
              <th>Expiry date</th>
              <th>Months to expiry</th>
              <th>Status</th>
              <th>Annual saving</th>
              <th>Practices affected</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.drug}>
                <td>
                  <div className={`rn rn${i < 3 ? i + 1 : 'n'}`}>{i + 1}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{p.drug}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{p.bnf}</div>
                </td>
                <td style={{ fontSize: 11.5, color: 'var(--mid)' }}>{p.indication}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.expiryDate}</td>
                <td>
                  <span style={{
                    fontSize: 12, fontWeight: 800,
                    color: p.monthsToExpiry <= 3 ? 'var(--re)' : p.monthsToExpiry <= 6 ? 'var(--am)' : 'var(--ok)'
                  }}>
                    {p.monthsToExpiry <= 0 ? 'Now' : `${p.monthsToExpiry}m`}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                    background: statusBg(p.status), color: statusColor(p.status)
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>{fm(p.annualSaving)}</td>
                <td style={{ fontSize: 11.5 }}>{p.practicesAffected}</td>
                <td>
                  <button className="btn bs bsm" onClick={() => alert(`Action plan for ${p.drug}`)}>
                    {p.monthsToExpiry <= 0 ? 'Launch switch' : p.monthsToExpiry <= 6 ? 'Prepare plan' : 'Monitor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
