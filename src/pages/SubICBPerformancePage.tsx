import { useState } from 'react'
import { SL_DATA, fm, pct, type SubICB } from '../data/slData'

const FILTERS = [
  { key: 'all', label: 'All sub-ICBs' },
  { key: 'barnsley', label: 'Barnsley' },
  { key: 'sheffield', label: 'Sheffield' },
  { key: 'doncaster', label: 'Doncaster' },
  { key: 'rotherham', label: 'Rotherham' },
] as const

type FilterKey = typeof FILTERS[number]['key']

function ppuColor(ppu: number) {
  return ppu < 100 ? 'var(--ok)' : ppu < 115 ? 'var(--am)' : 'var(--re)'
}

function SubICBBlock({ subICB }: { subICB: SubICB }) {
  const sorted = [...subICB.practices].sort((a, b) => b.sav / b.pot - a.sav / a.pot)
  const avgPct = Math.round(sorted.reduce((sum, p) => sum + p.sav / p.pot, 0) / sorted.length * 100)
  const avgPPU = Math.round(sorted.reduce((sum, p) => sum + p.ppu, 0) / sorted.length)
  const above = sorted.filter(p => pct(p.sav, p.pot) > avgPct).length
  const below = sorted.filter(p => pct(p.sav, p.pot) <= avgPct).length

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div className="ch">
        <div>
          <div className="ch-t">{subICB.name} sub-ICB — {subICB.practices.length} practices</div>
          <div className="ch-s">{(subICB.registered / 1000).toFixed(0)}k registered patients · PPU index {subICB.ppu_index} · {above} above average, {below} below average</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Savings delivered</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ok)' }}>{fm(subICB.savDelivered)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Remaining potential</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--am)' }}>{fm(subICB.savPotential - subICB.savDelivered)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '.6rem 1rem', background: 'var(--tl)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: 12, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--t)', fontWeight: 700 }}>ICB average achievement: {avgPct}%</span>
        <span style={{ color: 'var(--ok)' }}>▲ Above average: {above} practices</span>
        <span style={{ color: 'var(--re)' }}>▼ Below average: {below} practices</span>
        <span style={{ color: 'var(--muted)' }}>Average PPU index: {avgPPU}</span>
      </div>

      <table className="tc" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>RAG</th>
            <th>Practice</th>
            <th>Patients</th>
            <th>Savings YTD</th>
            <th>Potential</th>
            <th>Achievement</th>
            <th>Switches</th>
            <th>PPU index</th>
            <th>Monthly trend</th>
            <th>vs avg</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => {
            const achPct = pct(p.sav, p.pot)
            const vsAvg = achPct - avgPct
            const achColor = achPct > 60 ? 'var(--ok)' : achPct > 35 ? 'var(--am)' : 'var(--re)'
            return (
              <tr key={p.id}>
                <td><div className={`rag rag-${p.rag}`} /></td>
                <td>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{p.nm}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{p.id}</div>
                </td>
                <td style={{ fontSize: 12 }}>{p.pts.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 800, color: 'var(--ok)' }}>{fm(p.sav)}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted)' }}>{fm(p.pot)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 50, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(achPct, 100)}%`, background: achColor, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 800 }}>{achPct}%</span>
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>{p.done}/{p.sw}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, (p.ppu - 80) / (140 - 80) * 100))}%`, background: ppuColor(p.ppu), borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ppuColor(p.ppu) }}>{p.ppu}</span>
                  </div>
                </td>
                <td>
                  {p.trend !== 0 ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: p.trend > 0 ? 'var(--ok)' : 'var(--re)' }}>
                      {p.trend > 0 ? '▲' : '▼'} {Math.abs(p.trend)}%
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>—</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 800, color: vsAvg >= 0 ? 'var(--ok)' : 'var(--re)' }}>
                    {vsAvg >= 0 ? '+' : ''}{vsAvg}pp
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function SubICBPerformancePage() {
  const [filter, setFilter] = useState<FilterKey>('all')

  const subICBsToShow = filter === 'all'
    ? Object.entries(SL_DATA.subICBs)
    : [[filter, SL_DATA.subICBs[filter]] as [string, SubICB]]

  return (
    <div className="pg">
      <div className="ph">
        <h1>Sub-ICB performance</h1>
        <p>Practice-level detail · above/below average identification · export for performance review</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: '1.1rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`btn ${filter === f.key ? 'bp' : 'bs'} bsm`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <button
          className="btn bs bsm"
          style={{ marginLeft: 'auto' }}
          onClick={() => alert('In production, this downloads a CSV of the performance data shown.')}
        >
          Export for performance review ↗
        </button>
      </div>

      {subICBsToShow.map(([, s]) => (
        <SubICBBlock key={(s as SubICB).code} subICB={s as SubICB} />
      ))}
    </div>
  )
}
