import { SL_DATA, fm } from '../data/slData'

export default function PricePerUnitPage() {
  const d = SL_DATA
  const totalSaving = d.ppu.reduce((s, p) => s + p.annualSaving, 0)

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="tag tag-teal">Price per unit analysis</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Based on OpenPrescribing PPU methodology</span>
        </div>
        <h1>Price per unit (PPU) tool</h1>
        <p>Identifies cost saving opportunities by comparing the price paid per unit across every practice — outliers signal ghost generics, formulation issues, or brand prescribing</p>
      </div>

      {/* Info banner */}
      <div className="ig">
        <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,.1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <div>
          <div className="ig-t">How PPU analysis works</div>
          <div className="ig-b">
            The price per unit is calculated as: Net Ingredient Cost ÷ quantity dispensed. A practice prescribing branded amlodipine (Istin) will show a PPU of 29.3p vs the ICB average of 5.7p — a ratio of 5:1 that immediately identifies the ghost generic opportunity. PPU analysis surfaces these discrepancies across every BNF code simultaneously, without needing to check each drug individually.
          </div>
          <div className="ig-tags">
            <span className="ig-tag">OpenPrescribing PPU methodology</span>
            <span className="ig-tag">PPU index: 100 = ICB average</span>
            <span className="ig-tag">Above 100 = paying more than average</span>
          </div>
        </div>
      </div>

      {/* 4 metric cards */}
      <div className="mets m4">
        <div className="mc">
          <div className="mc-l">Drugs with PPU outliers</div>
          <div className="mc-v">{d.ppu.length}</div>
          <div className="mc-s dn">Require investigation</div>
        </div>
        <div className="mc">
          <div className="mc-l">Total PPU saving opportunity</div>
          <div className="mc-v">{fm(totalSaving)}</div>
          <div className="mc-s nu">annual if all resolved</div>
        </div>
        <div className="mc">
          <div className="mc-l">Highest PPU outlier</div>
          <div className="mc-v">9.4×</div>
          <div className="mc-s dn">Amlodipine — 1 practice</div>
        </div>
        <div className="mc">
          <div className="mc-l">ICB PPU index</div>
          <div className="mc-v">104</div>
          <div className="mc-s dn">4% above England average</div>
        </div>
      </div>

      {/* PPU outlier table */}
      <div className="card" style={{ marginBottom: '1.1rem' }}>
        <div className="ch">
          <div>
            <div className="ch-t">PPU outlier analysis — all BNF lines</div>
            <div className="ch-s">Sorted by potential saving · worst outlier practices identified</div>
          </div>
        </div>
        <table className="tc">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Unit</th>
              <th>ICB avg PPU</th>
              <th>Best practice PPU</th>
              <th>Worst practice PPU</th>
              <th>Outlier ratio</th>
              <th>Worst practice</th>
              <th>Annual saving</th>
              <th>Items/yr</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {d.ppu.map(p => {
              const ratio = (p.maxPPU / p.minPPU)
              const ratioColor = ratio > 5 ? 'var(--re)' : ratio > 2 ? 'var(--am)' : 'var(--ok)'
              return (
                <tr key={p.bnf}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{p.drug}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{p.bnf}</div>
                  </td>
                  <td style={{ fontSize: 11.5, color: 'var(--muted)' }}>per {p.unit}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.icbPPU}p</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                    <span style={{ color: 'var(--ok)' }}>{p.minPPU}p</span>
                    <div style={{ fontSize: 9, color: 'var(--muted)' }}>{p.bestPrac}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                    <span style={{ color: 'var(--re)' }}>{p.maxPPU}p</span>
                    <div style={{ fontSize: 9, color: 'var(--muted)' }}>{p.worstPrac}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 800, color: ratioColor }}>{ratio.toFixed(1)}×</span>
                  </td>
                  <td style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--re)' }}>{p.worstPrac}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>{fm(p.annualSaving)}</td>
                  <td style={{ fontSize: 11.5, color: 'var(--muted)' }}>{(p.items / 1000).toFixed(0)}k</td>
                  <td>
                    <button className="btn bp bsm" onClick={() => alert(`PPU investigation launched for ${p.drug} — ${p.worstPrac}`)}>
                      Investigate
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* PPU index by sub-ICB */}
      <div className="card">
        <div className="ch">
          <div className="ch-t">PPU index by sub-ICB</div>
          <div className="ch-s">100 = ICB average · above 100 means paying more per unit than average</div>
        </div>
        <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {Object.values(d.subICBs).map(s => {
            const col = s.ppu_index > 110 ? 'var(--re)' : s.ppu_index > 105 ? 'var(--am)' : s.ppu_index < 100 ? 'var(--ok)' : 'var(--muted)'
            return (
              <div key={s.code} style={{ background: 'var(--bg)', borderRadius: 'var(--rs)', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--slate)', marginBottom: 8 }}>{s.name}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: col }}>{s.ppu_index}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  {s.ppu_index > 100 ? `${s.ppu_index - 100}% above average`
                    : s.ppu_index < 100 ? `${100 - s.ppu_index}% below average`
                    : 'At average'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
