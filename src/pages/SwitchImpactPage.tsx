import { SL_DATA, fm } from '../data/slData'

export default function SwitchImpactPage() {
  const d = SL_DATA
  const verified = d.implementedSwitches.filter((s) => s.status === 'verified')
  const totalTarget = d.implementedSwitches.reduce((s, sw) => s + sw.targetSaving, 0)
  const totalActual = verified.reduce((s, sw) => s + sw.actualSaving, 0)
  const avgVar = verified.reduce((s, sw) => s + (sw.variance ?? 0), 0) / (verified.length || 1)

  const exportCsv = () => {
    const rows = ['Switch,Date,Sub-ICB,Practices,Patients Switched,Target Saving,Actual Saving,Variance %,Status,EPD Verification']
    d.implementedSwitches.forEach((sw) => {
      rows.push([
        `"${sw.switch}"`,
        sw.date,
        sw.subICB,
        sw.practices,
        sw.patientsSwitched,
        `"£${sw.targetSaving.toLocaleString()}"`,
        sw.actualSaving ? `"£${sw.actualSaving.toLocaleString()}"` : 'Pending',
        sw.variance !== null ? `${sw.variance}%` : '—',
        sw.status,
        `"${sw.epd}"`,
      ].join(','))
    })

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'SY_ICB_Switch_Impact_Finance_Report.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="pg">
      <div className="ph">
        <h1>Switch impact monitoring</h1>
        <p>EPD verification of implemented switches · target vs actual saving · variance analysis · performance evidence</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Switches implemented</div><div className="mc-v">{d.implementedSwitches.length}</div><div className="mc-s nu">Since Apr 2024</div></div>
        <div className="mc"><div className="mc-l">EPD verified</div><div className="mc-v">{verified.length}</div><div className="mc-s up">Confirmed in dispensing data</div></div>
        <div className="mc"><div className="mc-l">Total saving verified</div><div className="mc-v">{fm(totalActual)}</div><div className="mc-s up">Actual vs target {fm(totalTarget)}</div></div>
        <div className="mc"><div className="mc-l">Average realisation rate</div><div className="mc-v">{(100 + avgVar).toFixed(1)}%</div><div className="mc-s up">Of estimated saving</div></div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">Implemented switch tracker — EPD verification</div>
            <div className="ch-s">Every switch logged · verified against NHSBSA EPD data the following month · variance tracked</div>
          </div>
          <button className="btn bs bsm" onClick={exportCsv}>Export for finance</button>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Switch</th>
              <th>Date</th>
              <th>Sub-ICB</th>
              <th>Practices</th>
              <th>Patients</th>
              <th>Target saving</th>
              <th>Actual saving</th>
              <th>Variance</th>
              <th>Status</th>
              <th>EPD verification</th>
            </tr>
          </thead>
          <tbody>
            {d.implementedSwitches.map((sw) => {
              const isVer = sw.status === 'verified'
              const isPart = sw.status === 'partial'
              const varCol = sw.variance === null ? 'var(--muted)' : sw.variance > -10 ? 'var(--ok)' : 'var(--am)'

              return (
                <tr key={`${sw.switch}-${sw.date}`} style={isVer ? undefined : { background: 'var(--bg)' }}>
                  <td style={{ fontWeight: 700, fontSize: 12.5 }}>{sw.switch}</td>
                  <td style={{ fontSize: 11.5, fontFamily: 'var(--mono)' }}>{sw.date}</td>
                  <td style={{ fontSize: 12 }}>{sw.subICB}</td>
                  <td style={{ fontSize: 12 }}>{sw.practices}</td>
                  <td style={{ fontSize: 12 }}>{sw.patientsSwitched.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{fm(sw.targetSaving)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: isVer ? 'var(--ok)' : 'var(--muted)' }}>
                    {sw.actualSaving ? fm(sw.actualSaving) : 'Pending'}
                  </td>
                  <td style={{ fontSize: 12, fontWeight: 700, color: varCol }}>{sw.variance !== null ? `${sw.variance}%` : '—'}</td>
                  <td>
                    <span className={`sb ${isVer ? 'sb-ok' : isPart ? 'sb-w' : 'sb-b'}`}><span className="sd" />{isVer ? 'Verified' : isPart ? 'Partial' : 'In progress'}</span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--mid)', maxWidth: 220, lineHeight: 1.5 }}>{sw.epd}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
