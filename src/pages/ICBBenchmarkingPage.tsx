import { useMemo, useState } from 'react'
import { ICB_DATA } from '../data/slData'

export default function ICBBenchmarkingPage() {
  const [key, setKey] = useState<'WY' | 'HY' | 'NE' | 'GM' | 'EL' | 'BN'>('WY')
  const sy = ICB_DATA.SY
  const cmp = ICB_DATA[key]

  const metrics = useMemo(() => [
    { label: 'Generic DOAC prescribing %', sy: sy.doac_gen, cmp: cmp.doac_gen, higherBetter: true, unit: '%' },
    { label: 'Best-value statin use %', sy: sy.statin_best, cmp: cmp.statin_best, higherBetter: true, unit: '%' },
    { label: 'Best-value PPI use %', sy: sy.ppi_best, cmp: cmp.ppi_best, higherBetter: true, unit: '%' },
    { label: 'Generic inhaler use %', sy: sy.inh_gen, cmp: cmp.inh_gen, higherBetter: true, unit: '%' },
    { label: 'Ghost generic rate %', sy: sy.ghostPct, cmp: cmp.ghostPct, higherBetter: false, unit: '%' },
  ], [cmp, sy])

  return (
    <div className="pg">
      <div className="ph">
        <h1>ICB benchmarking</h1>
        <p>Compare South Yorkshire against peer ICBs in England</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.1rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--slate)' }}>Compare South Yorkshire ICB against:</div>
        <select className="icb-sel" value={key} onChange={(e) => setKey(e.target.value as typeof key)}>
          <option value="WY">West Yorkshire ICB</option>
          <option value="HY">Humber & North Yorkshire ICB</option>
          <option value="NE">NHS North East & North Cumbria ICB</option>
          <option value="GM">Greater Manchester ICB</option>
          <option value="EL">East London ICB</option>
          <option value="BN">Bristol, North Somerset & South Gloucestershire ICB</option>
        </select>
      </div>

      <div className="bm-grid">
        <div className="bm-card">
          <div className="bm-hd"><div className="bm-title" style={{ color: 'var(--t)' }}>South Yorkshire ICB</div><span className="tag tag-teal">Your ICB</span></div>
          {metrics.map((m) => {
            const better = m.higherBetter ? m.sy > m.cmp : m.sy < m.cmp
            return (
              <div className="bm-row" key={m.label}>
                <div className="bm-drug">{m.label}</div>
                <div className="bm-bar-wrap"><div className="bm-bar"><div className="bm-bar-fill" style={{ width: `${Math.min(100, m.sy)}%`, background: better ? 'var(--ok)' : 'var(--bm)' }} /></div></div>
                <div className="bm-val" style={{ color: 'var(--t)' }}>{m.sy}{m.unit}</div>
                <div className={`bm-diff ${better ? 'bm-better' : 'bm-worse'}`}>{better ? '✓ Better' : '↓ Below avg'}</div>
              </div>
            )
          })}
        </div>

        <div className="bm-card">
          <div className="bm-hd"><div className="bm-title">{cmp.nm}</div><span className="tag tag-blue">Comparator</span></div>
          {metrics.map((m) => (
            <div className="bm-row" key={m.label}>
              <div className="bm-drug">{m.label}</div>
              <div className="bm-bar-wrap"><div className="bm-bar"><div className="bm-bar-fill" style={{ width: `${Math.min(100, m.cmp)}%`, background: 'var(--bm)' }} /></div></div>
              <div className="bm-val" style={{ color: 'var(--bm)' }}>{m.cmp}{m.unit}</div>
              <div />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
