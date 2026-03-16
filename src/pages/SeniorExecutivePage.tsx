import { SL_DATA, fm, pct } from '../data/slData'

// SVG ring progress component
function RingProgress({ value, color }: { value: number; color: string }) {
  const r = 44
  const circumference = 2 * Math.PI * r
  const dash = circumference * (value / 100)
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash.toFixed(1)} ${circumference.toFixed(1)}`}
        strokeDashoffset={(circumference / 4).toFixed(1)}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function SeniorExecutivePage() {
  const d = SL_DATA
  const allPracs = Object.values(d.subICBs).flatMap(s => s.practices)
  const totSav = Object.values(d.subICBs).reduce((s, b) => s + b.savDelivered, 0)
  const totPot = Object.values(d.subICBs).reduce((s, b) => s + b.savPotential, 0)
  const totSpend = Object.values(d.subICBs).reduce((s, b) => s + b.spend, 0)
  const totBudget = Object.values(d.subICBs).reduce((s, b) => s + b.budget, 0)
  const patentPot = d.patentExpiry.reduce((s, p) => s + p.annualSaving, 0)
  const concTotal = d.concessions.reduce((s, c) => s + c.totalImpact, 0)
  const cumSav = d.monthlyTrend[d.monthlyTrend.length - 1].cumSaving

  const sorted = [...allPracs].sort((a, b) => b.sav / b.pot - a.sav / a.pot)
  const top5 = sorted.slice(0, 5)
  const bottom5 = sorted.slice(-5)

  const subICBColor = (p: number) => p > 60 ? 'var(--ok)' : p > 35 ? 'var(--am)' : 'var(--re)'
  const subICBTag = (p: number) => p > 60 ? 'tag-ok' : p > 35 ? 'tag-am' : 'tag-re'

  const findSubICBName = (pracId: string) =>
    Object.values(d.subICBs).find(s => s.practices.find(p => p.id === pracId))?.name ?? ''

  const urgentActions = [
    { col: 're', icon: '⚠', txt: '4 practices below 30% of savings potential', tab: 'sl-subicb' },
    { col: 're', icon: '⚠', txt: '8 patent expiries — immediate switch opportunity: £4.3M', tab: 'sl-patent' },
    { col: 'am', icon: '▲', txt: 'Price concessions up £5,600 month-on-month', tab: 'sl-concessions' },
    { col: 'am', icon: '▲', txt: 'PCSK9 spend up 121% — NICE criteria audit needed', tab: 'sl-expenditure' },
    { col: 'ok', icon: '✓', txt: 'Atorvastatin switch: 88% verified in EPD', tab: 'sl-impact' },
  ]

  return (
    <div className="pg">
      <div className="ph">
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t)', textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 6 }}>
          South Yorkshire ICB — Senior Leadership · {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <h1>Executive summary</h1>
        <p>Full ICB view across all 4 sub-ICBs · 38 practices · medicines optimisation performance</p>
      </div>

      {/* ── 5 metric cards ── */}
      <div className="mets m5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '1rem', marginBottom: '1.1rem' }}>
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
          <div className="mc-s up">↑ {fm(112400)} this month</div>
        </div>
        <div className="mc">
          <div className="mc-l">Cumulative saving (Apr–Mar)</div>
          <div className="mc-v">{fm(cumSav)}</div>
          <div className="mc-s up">{pct(cumSav, totPot)}% of annual potential</div>
        </div>
        <div className="mc">
          <div className="mc-l">Patent expiry pipeline</div>
          <div className="mc-v">{fm(patentPot)}</div>
          <div className="mc-s up">{d.patentExpiry.length} drugs — act now</div>
        </div>
        <div className="mc">
          <div className="mc-l">Price concession cost (YTD)</div>
          <div className="mc-v">{fm(concTotal)}</div>
          <div className="mc-s dn">↑ monitoring required</div>
        </div>
      </div>

      {/* ── 4 sub-ICB cards with SVG circular progress ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.1rem', marginBottom: '1.1rem' }}>
        {Object.entries(d.subICBs).map(([, s]) => {
          const p = pct(s.savDelivered, s.savPotential)
          const col = subICBColor(p)
          return (
            <div className="card" key={s.code} style={{ margin: 0 }}>
              <div className="ch">
                <div>
                  <div className="ch-t">{s.name}</div>
                  <div className="ch-s">{s.practices.length} practices · {(s.registered / 1000).toFixed(0)}k patients</div>
                </div>
                <span className={`tag ${subICBTag(p)}`} style={{ fontSize: 9 }}>Review</span>
              </div>
              <div style={{ textAlign: 'center', padding: '.75rem 0', position: 'relative' }}>
                <div style={{ display: 'inline-block', position: 'relative', width: 100, height: 100 }}>
                  <RingProgress value={p} color={col} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--slate)' }}>{p}%</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)' }}>of target</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 1rem .85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { label: 'Delivered', val: fm(s.savDelivered), color: 'var(--ok)' },
                  { label: 'Remaining', val: fm(s.savPotential - s.savDelivered), color: 'var(--am)' },
                  { label: 'PPU index', val: String(s.ppu_index), color: s.ppu_index > 105 ? 'var(--re)' : s.ppu_index > 100 ? 'var(--am)' : 'var(--ok)' },
                  { label: 'Concessions', val: fm(s.concessionCost), color: 'var(--am)' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg)', borderRadius: 6, padding: '6px 8px' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 1rem 1rem' }}>
                <button className="btn bp bsm" style={{ width: '100%', justifyContent: 'center' }}>
                  View {s.name} detail ↗
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Bottom section: Practice list + Trend + Urgent actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.1rem' }}>
        {/* Top 5 & bottom 5 practices */}
        <div className="card">
          <div className="ch">
            <div className="ch-t">Top 5 &amp; bottom 5 practices — savings vs potential</div>
            <div className="ch-s">Full ICB · ranked by % of potential delivered</div>
          </div>
          {top5.map((p) => {
            const pctV = pct(p.sav, p.pot)
            return (
              <div className="pr" key={p.id}>
                <div className={`rag rag-${p.rag}`} />
                <div style={{ flex: 1 }}>
                  <div className="pr-n">{p.nm}</div>
                  <div className="pr-s">{findSubICBName(p.id)} · {p.pts.toLocaleString()} patients</div>
                  <div style={{ height: 4, width: `${Math.min(pctV, 100)}%`, background: 'var(--ok)', borderRadius: 2, marginTop: 4 }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="pr-v">{fm(p.sav)}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{pctV}% of potential</div>
                </div>
              </div>
            )
          })}
          <div style={{ padding: '.4rem 1.1rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)', fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            ↓ Bottom 5 — require support
          </div>
          {bottom5.map(p => {
            const pctV = pct(p.sav, p.pot)
            return (
              <div className="pr" key={p.id}>
                <div className={`rag rag-${p.rag}`} />
                <div style={{ flex: 1 }}>
                  <div className="pr-n">{p.nm}</div>
                  <div className="pr-s">{findSubICBName(p.id)} · {p.pts.toLocaleString()} patients</div>
                  <div style={{ height: 4, width: `${Math.min(pctV, 100)}%`, background: 'var(--re)', borderRadius: 2, marginTop: 4 }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="pr-v">{fm(p.sav)}</div>
                  <div style={{ fontSize: 10, color: 'var(--re)' }}>{pctV}% of potential</div>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          {/* Monthly savings trend */}
          <div className="card" style={{ marginBottom: '1.1rem' }}>
            <div className="ch">
              <div className="ch-t">Monthly savings trend</div>
              <div className="ch-s">Apr 2025 – Mar 2026</div>
            </div>
            <div style={{ padding: '.75rem 1rem' }}>
              {d.monthlyTrend.map((m, i) => {
                const w = Math.round((m.saving / 130000) * 100)
                const isLast = i === d.monthlyTrend.length - 1
                return (
                  <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', width: 52 }}>{m.month.split(' ')[0].substring(0, 3)}</div>
                    <div style={{ flex: 1, height: 14, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(w, 100)}%`, background: isLast ? 'var(--t)' : 'var(--tm)', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ok)', width: 56, textAlign: 'right' }}>{fm(m.saving)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Urgent actions */}
          <div className="card">
            <div className="ch"><div className="ch-t">Urgent actions</div></div>
            <div style={{ padding: '.5rem 0' }}>
              {urgentActions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '.7rem 1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: `var(--${a.col})` }}>{a.icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--slate)', flex: 1 }}>{a.txt}</span>
                  <span style={{ fontSize: 11, color: 'var(--bm)' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
