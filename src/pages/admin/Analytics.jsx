import { useState } from 'react'

const WEEKLY_DATA = [
  { week: 'W1 Feb 10', premiums: 89000,  payouts: 12400, claims: 14, workers: 1102 },
  { week: 'W2 Feb 17', premiums: 94000,  payouts: 18600, claims: 21, workers: 1134 },
  { week: 'W3 Feb 24', premiums: 98000,  payouts: 9800,  claims: 11, workers: 1168 },
  { week: 'W4 Mar 03', premiums: 102000, payouts: 21000, claims: 24, workers: 1201 },
  { week: 'W5 Mar 10', premiums: 108000, payouts: 16400, claims: 18, workers: 1247 },
  { week: 'W6 Mar 17', premiums: 114000, payouts: 7486,  claims: 38, workers: 1284 },
]

const TRIGGER_BREAKDOWN = [
  { trigger: 'Heavy Rainfall',    count: 42, payout: 8274,  category: 'Environmental' },
  { trigger: 'Severe AQI',        count: 38, payout: 6232,  category: 'Environmental' },
  { trigger: 'Extreme Heat',      count: 19, payout: 2489,  category: 'Environmental' },
  { trigger: 'Road Waterlogging', count: 14, payout: 1834,  category: 'Environmental' },
  { trigger: 'Bandh / Strike',    count: 11, payout: 2167,  category: 'Social'        },
  { trigger: 'Darkstore Closure', count: 23, payout: 3013,  category: 'Platform'      },
  { trigger: 'App Outage',        count: 8,  payout: 1048,  category: 'Platform'      },
  { trigger: 'Sec 144 / Curfew',  count: 5,  payout: 985,   category: 'Social'        },
  { trigger: 'Festival Closure',  count: 3,  payout: 591,   category: 'Social'        },
]

const ZONE_DATA = [
  { zone: 'Mumbai — Dharavi',         workers: 312, lossRatio: 24.1, avgPremium: 108, claims: 48 },
  { zone: 'Delhi — Saket',            workers: 198, lossRatio: 19.8, avgPremium: 98,  claims: 31 },
  { zone: 'Mumbai — Andheri',         workers: 287, lossRatio: 18.2, avgPremium: 96,  claims: 39 },
  { zone: 'Bengaluru — Koramangala',  workers: 241, lossRatio: 12.4, avgPremium: 89,  claims: 18 },
  { zone: 'Hyderabad — Madhapur',     workers: 189, lossRatio: 9.1,  avgPremium: 82,  claims: 9  },
  { zone: 'Chennai — Adyar',          workers: 57,  lossRatio: 8.4,  avgPremium: 89,  claims: 4  },
]

const FORECAST_NEXT = [
  { zone: 'Mumbai — Dharavi',        risk: 81, expectedClaims: 52, expectedPayout: 11440 },
  { zone: 'Delhi — Saket',           risk: 73, expectedClaims: 38, expectedPayout: 7486  },
  { zone: 'Mumbai — Andheri',        risk: 64, expectedClaims: 31, expectedPayout: 6107  },
  { zone: 'Bengaluru — Koramangala', risk: 28, expectedClaims: 9,  expectedPayout: 1602  },
  { zone: 'Hyderabad — Madhapur',    risk: 18, expectedClaims: 4,  expectedPayout: 656   },
]

const CATEGORY_COLORS = {
  Environmental: 'var(--accent)',
  Social:        '#3b82f6',
  Platform:      'var(--success)',
}

function getRiskColor(risk) {
  if (risk >= 70) return '#EF4444'
  if (risk >= 40) return '#F59E0B'
  return '#10B981'
}

function getLossColor(ratio) {
  if (ratio >= 20) return '#EF4444'
  if (ratio >= 15) return '#F59E0B'
  return '#10B981'
}

export default function Analytics() {
  const [tab, setTab] = useState('overview')

  const totalPremiums    = WEEKLY_DATA.reduce((a, b) => a + b.premiums, 0)
  const totalPayouts     = WEEKLY_DATA.reduce((a, b) => a + b.payouts, 0)
  const totalClaims      = WEEKLY_DATA.reduce((a, b) => a + b.claims, 0)
  const overallLossRatio = ((totalPayouts / totalPremiums) * 100).toFixed(1)
  const maxWorkers       = Math.max(...WEEKLY_DATA.map(w => w.workers))
  const maxPremium       = Math.max(...WEEKLY_DATA.map(w => w.premiums))
  const maxCount         = Math.max(...TRIGGER_BREAKDOWN.map(t => t.count))
  const totalTriggerPayouts = TRIGGER_BREAKDOWN.reduce((a, b) => a + b.payout, 0)

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px' }}>

      <style>{`
        .analytics-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .tab-btn {
          padding: 9px 18px;
          border: none; border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .tab-btn.active  { background: var(--accent); color: #000; }
        .tab-btn.inactive { background: transparent; color: var(--muted); }
        .table-row {
          display: grid;
          gap: 12px;
          align-items: center;
          padding: 11px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .table-row:last-child { border-bottom: none; }
        .table-header {
          display: grid;
          gap: 12px;
          padding: 9px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 10px;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.8px;
        }
        @media (max-width: 768px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          ANALYTICS
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Platform Analytics
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '3px' }}>
          6-week performance summary · Mar 17, 2026
        </div>
      </div>

      {/* KPI cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
        gap: '12px', marginBottom: '20px',
      }}>
        {[
          { label: 'TOTAL PREMIUMS',  value: `₹${(totalPremiums/100000).toFixed(2)}L`,   color: 'var(--accent)'  },
          { label: 'TOTAL PAYOUTS',   value: `₹${(totalPayouts/1000).toFixed(1)}K`,       color: 'var(--success)' },
          { label: 'LOSS RATIO',      value: `${overallLossRatio}%`,                       color: 'var(--text)'    },
          { label: 'TOTAL CLAIMS',    value: totalClaims,                                   color: 'var(--text)'    },
          { label: 'ACTIVE WORKERS',  value: '1,284',                                       color: 'var(--text)'    },
          { label: 'POOL SURPLUS',    value: `₹${((totalPremiums-totalPayouts)/100000).toFixed(2)}L`, color: 'var(--success)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '24px', color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px', padding: '4px',
        marginBottom: '20px',
        overflowX: 'auto',
      }}>
        {['overview', 'triggers', 'zones', 'forecast'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : 'inactive'}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <>
          {/* Premium vs Payout chart */}
          <div className="analytics-card">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                FINANCIAL PERFORMANCE
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Weekly Premiums vs Payouts</div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '140px', marginBottom: '10px' }}>
              {WEEKLY_DATA.map((w, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%' }}>
                  <div style={{
                    flex: 1,
                    height: `${(w.premiums / maxPremium) * 100}%`,
                    background: 'rgba(245,158,11,0.5)',
                    borderRadius: '4px 4px 0 0', minHeight: '4px',
                  }} />
                  <div style={{
                    flex: 1,
                    height: `${(w.payouts / maxPremium) * 100}%`,
                    background: 'var(--success)',
                    borderRadius: '4px 4px 0 0', minHeight: '4px',
                  }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              {WEEKLY_DATA.map((w, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    {w.week.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              {[
                { color: 'rgba(245,158,11,0.5)', label: 'Premiums collected' },
                { color: 'var(--success)',        label: 'Payouts disbursed'  },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worker growth + loss ratio */}
          <div
            className="analytics-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
          >
            {/* Worker growth */}
            <div className="analytics-card" style={{ margin: 0 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                  GROWTH
                </div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Active Workers</div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px', marginBottom: '8px' }}>
                {WEEKLY_DATA.map((w, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${(w.workers / maxWorkers) * 100}%`,
                    background: `rgba(59,130,246,${0.3 + (i / WEEKLY_DATA.length) * 0.7})`,
                    borderRadius: '4px 4px 0 0', minHeight: '4px',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {WEEKLY_DATA.map((w, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      {w.week.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '14px', paddingTop: '14px',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginBottom: '3px' }}>START</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px' }}>1,102</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginBottom: '3px' }}>NOW</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: 'var(--success)' }}>1,284</div>
                </div>
              </div>
            </div>

            {/* Loss ratio */}
            <div className="analytics-card" style={{ margin: 0 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                  LOSS RATIO
                </div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Weekly Loss Ratio %</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {WEEKLY_DATA.map((w, i) => {
                  const ratio = ((w.payouts / w.premiums) * 100).toFixed(1)
                  const color = getLossColor(parseFloat(ratio))
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', width: '32px', flexShrink: 0 }}>
                        {w.week.split(' ')[0]}
                      </div>
                      <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${Math.min(parseFloat(ratio), 100)}%`,
                          background: color, borderRadius: '99px',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '12px', color, width: '40px', textAlign: 'right', flexShrink: 0 }}>
                        {ratio}%
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{
                marginTop: '14px', paddingTop: '14px',
                borderTop: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>6-week average</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: getLossColor(parseFloat(overallLossRatio)) }}>
                  {overallLossRatio}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TRIGGERS TAB */}
      {tab === 'triggers' && (
        <div className="analytics-card">
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              TRIGGER ANALYSIS
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Claims by Disruption Type</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>Last 6 weeks · All zones</div>
          </div>

          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <div className="table-header" style={{ gridTemplateColumns: '1fr 80px 80px 100px 120px' }}>
              <div>TRIGGER</div>
              <div>CLAIMS</div>
              <div>PAYOUT</div>
              <div>% OF TOTAL</div>
              <div>FREQUENCY</div>
            </div>

            {TRIGGER_BREAKDOWN
              .sort((a, b) => b.count - a.count)
              .map((t, i) => {
                const pct = ((t.payout / totalTriggerPayouts) * 100).toFixed(1)
                const catColor = CATEGORY_COLORS[t.category]
                return (
                  <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 80px 80px 100px 120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 500 }}>{t.trigger}</span>
                      <span style={{
                        fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 600,
                        padding: '2px 7px', borderRadius: '99px',
                        background: `${catColor}15`, color: catColor,
                      }}>
                        {t.category.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{t.count}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--success)' }}>
                      ₹{(t.payout / 1000).toFixed(1)}K
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--muted)' }}>
                      {pct}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: 'var(--surface)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(t.count / maxCount) * 100}%`,
                          background: catColor,
                          borderRadius: '99px',
                        }} />
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ZONES TAB */}
      {tab === 'zones' && (
        <div className="analytics-card">
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              ZONE PERFORMANCE
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Zone-wise Breakdown</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>Last 6 weeks</div>
          </div>

          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <div className="table-header" style={{ gridTemplateColumns: '1fr 80px 90px 90px 100px' }}>
              <div>ZONE</div>
              <div>WORKERS</div>
              <div>CLAIMS</div>
              <div>AVG PREMIUM</div>
              <div>LOSS RATIO</div>
            </div>

            {ZONE_DATA
              .sort((a, b) => b.lossRatio - a.lossRatio)
              .map((z, i) => {
                const lossColor = getLossColor(z.lossRatio)
                return (
                  <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 80px 90px 90px 100px' }}>
                    <div style={{ fontWeight: 500 }}>{z.zone}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{z.workers}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{z.claims}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--accent)' }}>
                      ₹{z.avgPremium}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '99px', height: '5px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${Math.min(z.lossRatio * 4, 100)}%`,
                            background: lossColor, borderRadius: '99px',
                          }} />
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '13px', color: lossColor, minWidth: '40px' }}>
                          {z.lossRatio}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* FORECAST TAB */}
      {tab === 'forecast' && (
        <>
          <div className="analytics-card">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                PREDICTIVE ANALYTICS
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Next Week Forecast</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>
                AI-generated disruption probability · Mar 18–24, 2026
              </div>
            </div>

            {FORECAST_NEXT.map((f, i) => {
              const color = getRiskColor(f.risk)
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center',
                  gap: '16px', padding: '14px 0',
                  borderBottom: i < FORECAST_NEXT.length - 1 ? '1px solid var(--border)' : 'none',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ minWidth: '200px', flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{f.zone}</div>
                    <div style={{ background: 'var(--surface2)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${f.risk}%`,
                        background: color, borderRadius: '99px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px', color }}>
                        {f.risk}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>RISK</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px' }}>
                        {f.expectedClaims}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>EXP CLAIMS</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px', color: 'var(--accent)' }}>
                        ₹{(f.expectedPayout / 1000).toFixed(1)}K
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>EXP PAYOUT</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recommendation cards */}
          <div
            className="analytics-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
          >
            {[
              {
                label: 'HIGH ALERT',
                color: 'var(--danger)',
                bg: 'rgba(239,68,68,0.06)',
                border: 'rgba(239,68,68,0.2)',
                title: 'Mumbai Dharavi — 81% risk',
                body: 'Expect 52 claims next week. Consider proactive worker alerts and ensure reinsurance buffer is prepared for potential pool stress.',
              },
              {
                label: 'WATCH ZONE',
                color: '#3b82f6',
                bg: 'rgba(59,130,246,0.06)',
                border: 'rgba(59,130,246,0.2)',
                title: 'Delhi Saket — 73% risk',
                body: 'AQI forecast elevated through mid-week. 38 claims expected. Fraud engine on heightened sensitivity recommended.',
              },
              {
                label: 'STABLE',
                color: 'var(--success)',
                bg: 'rgba(16,185,129,0.06)',
                border: 'rgba(16,185,129,0.2)',
                title: 'Bengaluru — 28% risk',
                body: 'Low disruption probability next week. Only 9 claims expected. Surge Shield discounts auto-applied for clean-streak workers.',
              },
              {
                label: 'POOL STATUS',
                color: 'var(--accent)',
                bg: 'rgba(245,158,11,0.06)',
                border: 'rgba(245,158,11,0.2)',
                title: 'Expected next week payout: ₹27.3K',
                body: 'Against projected ₹1.14L in premiums. Loss ratio forecast at 23.9% — within healthy operating range. No reinsurance trigger expected.',
              },
            ].map((r, i) => (
              <div key={i} style={{
                background: r.bg,
                border: `1px solid ${r.border}`,
                borderRadius: '12px', padding: '18px',
              }}>
                <div style={{ fontSize: '10px', color: r.color, fontFamily: 'JetBrains Mono', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>
                  {r.label}
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{r.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{r.body}</div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}