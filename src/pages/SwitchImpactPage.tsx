import { SL_DATA, fm } from '../data/slData'

export default function SwitchImpactPage() {
  const d = SL_DATA
  const switches = d.implementedSwitches
  const totalExpected = switches.reduce((s, sw) => s + sw.expectedSaving, 0)
  const totalActual = switches.reduce((s, sw) => s + sw.actualSaving, 0)
  const variance = totalActual - totalExpected
  const avgAchievement = Math.round(totalActual / totalExpected * 100)

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="tag tag-ok">EPD verification</span>
        </div>
        <h1>Switch impact tracker</h1>
        <p>Validates actual savings from implemented switches against forecasted benefit using Electronic Prescribing Data — closing the loop on ROI</p>
      </div>

      {/* Metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Switches tracked</div>
          <div className="mc-v">{switches.length}</div>
          <div className="mc-s dn">Implemented across ICB</div>
        </div>
        <div className="mc">
          <div className="mc-l">Expected savings (forecast)</div>
          <div className="mc-v">{fm(totalExpected)}</div>
          <div className="mc-s dn">At full implementation</div>
        </div>
        <div className="mc">
          <div className="mc-l">Actual savings (EPD verified)</div>
          <div className="mc-v" style={{ color: 'var(--ok)' }}>{fm(totalActual)}</div>
          <div className="mc-s nu">Confirmed in prescribing data</div>
        </div>
        <div className="mc">
          <div className="mc-l">Achievement rate</div>
          <div className="mc-v" style={{ color: avgAchievement >= 80 ? 'var(--ok)' : avgAchievement >= 60 ? 'var(--am)' : 'var(--re)' }}>
            {avgAchievement}%
          </div>
          <div className="mc-s" style={{ color: variance >= 0 ? 'var(--ok)' : 'var(--re)' }}>
            {variance >= 0 ? 'Over' : 'Under'} forecast by {fm(Math.abs(variance))}
          </div>
        </div>
      </div>

      {/* Summary bar - Expected vs Actual */}
      <div className="card" style={{ marginBottom: '1.1rem' }}>
        <div className="ch">
          <div className="ch-t">Portfolio performance — expected vs actual</div>
          <div className="ch-s">EPD-verified savings against forecasted benefit</div>
        </div>
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 90, fontSize: 11.5, fontWeight: 600, color: 'var(--muted)' }}>Expected</div>
            <div style={{ flex: 1, height: 18, background: '#E2E8F0', borderRadius: 4 }}>
              <div style={{ width: '100%', height: '100%', background: '#CBD5E1', borderRadius: 4 }} />
            </div>
            <div style={{ width: 80, fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--slate)' }}>{fm(totalExpected)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 90, fontSize: 11.5, fontWeight: 600, color: 'var(--ok)' }}>Actual (EPD)</div>
            <div style={{ flex: 1, height: 18, background: '#E2E8F0', borderRadius: 4 }}>
              <div style={{ width: `${Math.min(100, avgAchievement)}%`, height: '100%', background: 'var(--ok)', borderRadius: 4 }} />
            </div>
            <div style={{ width: 80, fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color: 'var(--ok)' }}>{fm(totalActual)}</div>
          </div>
        </div>
      </div>

      {/* EPD verification table */}
      <div className="card">
        <div className="ch">
          <div className="ch-t">Switch-by-switch EPD verification</div>
          <div className="ch-s">Actual prescribing data vs forecast — identify underperforming switchings for re-engagement</div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>#</th>
              <th>Switch</th>
              <th>Sub-ICB</th>
              <th>Implementation date</th>
              <th>Expected saving</th>
              <th>Actual saving (EPD)</th>
              <th>Variance</th>
              <th>Achievement</th>
              <th>EPD status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {switches.map((sw, i) => {
              const achievement = Math.round(sw.actualSaving / sw.expectedSaving * 100)
              const variance = sw.actualSaving - sw.expectedSaving
              const achievCol = achievement >= 80 ? 'var(--ok)' : achievement >= 60 ? 'var(--am)' : 'var(--re)'
              return (
                <tr key={sw.drug}>
                  <td>
                    <div className={`rn rn${i < 3 ? i + 1 : 'n'}`}>{i + 1}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{sw.drug}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{sw.switchType}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'var(--tl)', color: 'var(--t)' }}>
                      {sw.subicb}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5 }}>{sw.implementedDate}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fm(sw.expectedSaving)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>{fm(sw.actualSaving)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, color: variance >= 0 ? 'var(--ok)' : 'var(--re)' }}>
                    {variance >= 0 ? '+' : ''}{fm(variance)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ width: `${Math.min(100, achievement)}%`, height: '100%', background: achievCol, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: achievCol, width: 32 }}>{achievement}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                      background: sw.epdStatus === 'Verified' ? 'var(--ok-bg)' : sw.epdStatus === 'Partial' ? 'var(--am-bg)' : 'var(--re-bg)',
                      color: sw.epdStatus === 'Verified' ? 'var(--ok)' : sw.epdStatus === 'Partial' ? 'var(--am)' : 'var(--re)'
                    }}>
                      {sw.epdStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn bs bsm"
                      onClick={() => alert(`Practice-level breakdown for ${sw.drug}`)}
                    >
                      Drill down
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
