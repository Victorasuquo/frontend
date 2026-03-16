import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { OPPS } from '../data/pocData'

type Filter = 'all' | 'scheme' | 'simple' | 'ghost' | 'doac'

export function OpportunitiesPage() {
  const { selectedRole } = useAuth()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (filter === 'scheme') return OPPS.filter((o) => o.inc)
    if (filter === 'simple') return OPPS.filter((o) => o.ease >= 4)
    if (filter === 'ghost') return OPPS.filter((o) => o.cat === 'Ghost generic')
    if (filter === 'doac') return OPPS.filter((o) => o.ch.includes('DOAC'))
    return OPPS
  }, [filter])

  const total = OPPS.reduce((s, o) => s + o.sav, 0)
  const included = OPPS.filter((o) => o.inc).length
  const title = selectedRole === 'pcn' ? 'Sheffield East PCN' : selectedRole === 'gp' ? 'Darnall Health Centre' : 'South Yorkshire ICB'

  const easeColor = (ease: number) => (ease >= 4 ? 'var(--ok)' : ease >= 3 ? 'var(--am)' : 'var(--re)')

  return (
    <div className="pg">
      <div className="ph">
        <span className="tag tag-teal" style={{ marginBottom: 8 }}>Week of 10 Mar 2026 · Drug Tariff March 2026</span>
        <h1>{title} — All {OPPS.length} opportunities</h1>
        <p>Complete ranked list · all BNF chapters · 5-gate validated · choose which to pursue</p>
      </div>

      <div className="mets m4">
        <div className="mc"><div className="mc-l">Total opportunities</div><div className="mc-v">{OPPS.length}</div><div className="mc-s nu">all BNF chapters</div></div>
        <div className="mc"><div className="mc-l">Total annual saving</div><div className="mc-v">£{Math.round(total / 1000)}k</div><div className="mc-s nu">if all actioned</div></div>
        <div className="mc"><div className="mc-l">ICB scheme opportunities</div><div className="mc-v">{included}</div><div className="mc-s up">Selected by ICB pharmacist</div></div>
        <div className="mc"><div className="mc-l">YTD saving (verified)</div><div className="mc-v">£58.5k</div><div className="mc-s up">↑ EPD confirmed</div></div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ch-t">All opportunities — ranked by annual saving</div>
            <div className="ch-s">Full list · click rows for intervention actioning</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className={`btn bs bsm ${filter === 'all' ? 'af' : ''}`} onClick={() => setFilter('all')}>All ({OPPS.length})</button>
            <button className={`btn bs bsm ${filter === 'scheme' ? 'af' : ''}`} onClick={() => setFilter('scheme')}>ICB scheme ({included})</button>
            <button className={`btn bs bsm ${filter === 'simple' ? 'af' : ''}`} onClick={() => setFilter('simple')}>Simple (ease ≥4)</button>
            <button className={`btn bs bsm ${filter === 'ghost' ? 'af' : ''}`} onClick={() => setFilter('ghost')}>Ghost generics</button>
            <button className={`btn bs bsm ${filter === 'doac' ? 'af' : ''}`} onClick={() => setFilter('doac')}>DOACs</button>
          </div>
        </div>

        <table className="tc" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Category</th>
              <th>Annual saving</th>
              <th>Per patient</th>
              <th>Patients</th>
              <th>Price change</th>
              <th>Ease</th>
              <th>BNF</th>
              {selectedRole === 'icb' ? <th>Scheme</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id}>
                <td><div className={`rn ${i === 0 ? 'rn1' : i === 1 ? 'rn2' : i === 2 ? 'rn3' : 'rnn'}`}>{o.rank}</div></td>
                <td><span className="pf">{o.fr.length > 26 ? `${o.fr.slice(0, 26)}...` : o.fr}</span></td>
                <td><span className="pt">{o.to.length > 26 ? `${o.to.slice(0, 26)}...` : o.to}</span></td>
                <td><span className="tag tag-blue" style={{ fontSize: 9 }}>{o.cat}</span></td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800, color: 'var(--ok)' }}>£{o.sav.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--mid)' }}>£{o.pp}</td>
                <td><div style={{ fontSize: 13, fontWeight: 700 }}>{o.pts.toLocaleString()}</div></td>
                <td style={{ fontSize: 11 }}><span style={{ color: 'var(--re)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{o.pF}</span> → <span style={{ color: 'var(--ok)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{o.pT}</span></td>
                <td>
                  <div className="ease-b"><div className="ease-f" style={{ width: `${o.ease * 20}%`, background: easeColor(o.ease) }} /></div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{o.eL.split(' ')[0]}</div>
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>{o.bnf}</td>
                {selectedRole === 'icb' ? (
                  <td><div className={`tog ${o.inc ? 'on' : ''}`} /></td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
