import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    value: 'lite',
    label: 'Lite',
    price: 49,
    coverage: '50%',
    payout: 175,
    desc: 'Basic protection for part-time workers or low-risk zones.',
  },
  {
    value: 'standard',
    label: 'Standard',
    price: 89,
    coverage: '75%',
    payout: 262,
    recommended: true,
    desc: 'Best balance of cost and coverage for most Q-Commerce workers.',
  },
  {
    value: 'premium',
    label: 'Premium',
    price: 129,
    coverage: '100%',
    payout: 350,
    desc: 'Full income replacement for full-time workers in high-risk zones.',
  },
]

const COVERAGE_ITEMS = [
  { label: 'Heavy Rainfall',       category: 'Environmental' },
  { label: 'Extreme Heat',         category: 'Environmental' },
  { label: 'Severe AQI',           category: 'Environmental' },
  { label: 'Road Waterlogging',    category: 'Environmental' },
  { label: 'Bandh / Strike',       category: 'Social' },
  { label: 'Section 144 / Curfew', category: 'Social' },
  { label: 'Festival Zone Closure',category: 'Social' },
  { label: 'Darkstore Closure',    category: 'Platform' },
  { label: 'App Outage',           category: 'Platform' },
]

const EXCLUSIONS = [
  'Vehicle repair or maintenance costs',
  'Health, medical, or accident coverage',
  'Personal disputes or voluntary absence',
  'Disruptions lasting under 45 minutes',
  'Events outside your registered zone',
]

const HISTORY = [
  { week: 'Mar 10 – 16', plan: 'Standard', paid: 89,  claims: 1, payout: 197, status: 'completed' },
  { week: 'Mar 03 – 09', plan: 'Standard', paid: 89,  claims: 1, payout: 164, status: 'completed' },
  { week: 'Feb 24 – Mar 02', plan: 'Standard', paid: 89, claims: 1, payout: 197, status: 'completed' },
  { week: 'Feb 17 – 23', plan: 'Lite',     paid: 49,  claims: 0, payout: 0,   status: 'completed' },
]

export default function Policy() {
  const navigate = useNavigate()
  const [activePlan, setActivePlan] = useState('standard')
  const [selectedPlan, setSelectedPlan] = useState('standard')
  const [changing, setChanging] = useState(false)
  const [changed, setChanged] = useState(false)
  const [tab, setTab] = useState('coverage')

  const current = PLANS.find(p => p.value === activePlan)
  const selected = PLANS.find(p => p.value === selectedPlan)
  const hasChange = selectedPlan !== activePlan

  function handleChangePlan() {
    setChanging(true)
    setTimeout(() => {
      setActivePlan(selectedPlan)
      setChanging(false)
      setChanged(true)
      setTimeout(() => setChanged(false), 3000)
    }, 1500)
  }

  const categoryColors = {
    Environmental: 'var(--accent)',
    Social: '#3b82f6',
    Platform: 'var(--success)',
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      <style>{`
        .policy-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .plan-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface2);
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 8px;
        }
        .plan-row:last-child { margin-bottom: 0; }
        .plan-row.selected {
          border-color: rgba(245,158,11,0.5);
          background: rgba(245,158,11,0.06);
        }
        .tab-btn {
          flex: 1; padding: 9px;
          border: none; border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: all 0.15s;
        }
        .tab-btn.active { background: var(--accent); color: #000; }
        .tab-btn.inactive { background: transparent; color: var(--muted); }
        .coverage-row {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .coverage-row:last-child { border-bottom: none; }
        .history-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .history-row:last-child { border-bottom: none; }
        @media (max-width: 400px) {
          .policy-card { padding: 16px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          POLICY MANAGEMENT
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          My Coverage
        </div>
      </div>

      {/* Current active policy */}
      <div style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--success)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '6px' }}>
              ACTIVE POLICY · MAR 17–23
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '4px' }}>
              {current.label} Plan
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {current.coverage} coverage · up to ₹{current.payout}/day · ₹{current.price}/week
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '99px', padding: '6px 14px',
            flexShrink: 0,
          }}>
            <span className="pulse" style={{ fontSize: '8px', color: 'var(--success)' }}>●</span>
            <span style={{ fontSize: '12px', color: 'var(--success)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
              PROTECTED
            </span>
          </div>
        </div>

        {/* Policy stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginTop: '16px',
          paddingTop: '16px', borderTop: '1px solid rgba(16,185,129,0.15)',
        }}>
          {[
            { label: 'PREMIUM PAID', value: `₹${current.price}` },
            { label: 'MAX PAYOUT', value: `₹${current.payout}/day` },
            { label: 'DAYS LEFT', value: '6 days' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '3px' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '15px', color: 'var(--success)' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change plan */}
      <div className="policy-card">
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
            NEXT WEEK
          </div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>Change Plan</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>
            Plan changes take effect from next Monday.
          </div>
        </div>

        {PLANS.map(p => (
          <div
            key={p.value}
            className={`plan-row ${selectedPlan === p.value ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(p.value)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${selectedPlan === p.value ? 'var(--accent)' : 'var(--border)'}`,
                background: selectedPlan === p.value ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.label}</span>
                  {p.recommended && (
                    <span style={{
                      fontSize: '9px', background: 'rgba(245,158,11,0.15)',
                      color: 'var(--accent)', padding: '2px 7px',
                      borderRadius: '99px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                    }}>
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  {p.coverage} · up to ₹{p.payout}/day
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '17px',
                color: selectedPlan === p.value ? 'var(--accent)' : 'var(--text)',
              }}>
                ₹{p.price}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>/week</div>
            </div>
          </div>
        ))}

        {hasChange && (
          <div style={{
            marginTop: '14px',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '10px', padding: '12px 14px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Switching from{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{current.label} ₹{current.price}</span>
              {' '}to{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{selected.label} ₹{selected.price}</span>
              {' '}next week
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', flexShrink: 0 }}
              onClick={handleChangePlan}
              disabled={changing}
            >
              {changing ? 'Saving...' : 'Confirm Change'}
            </button>
          </div>
        )}

        {changed && (
          <div style={{
            marginTop: '12px', fontSize: '13px',
            color: 'var(--success)', fontFamily: 'JetBrains Mono',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ✓ Plan updated. Takes effect next Monday.
          </div>
        )}
      </div>

      {/* Coverage details tabs */}
      <div className="policy-card">
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '14px' }}>
          POLICY DETAILS
        </div>

        <div style={{
          display: 'flex', background: 'var(--surface2)',
          borderRadius: '9px', padding: '4px',
          marginBottom: '16px', gap: '4px',
        }}>
          {['coverage', 'exclusions', 'history'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : 'inactive'}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Coverage tab */}
        {tab === 'coverage' && (
          <div>
            {COVERAGE_ITEMS.map((item, i) => (
              <div key={i} className="coverage-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--success)', fontSize: '13px' }}>✓</span>
                  <span style={{ fontSize: '14px' }}>{item.label}</span>
                </div>
                <span style={{
                  fontSize: '10px', fontFamily: 'JetBrains Mono',
                  fontWeight: 600, padding: '2px 8px', borderRadius: '99px',
                  background: `${categoryColors[item.category]}15`,
                  color: categoryColors[item.category],
                }}>
                  {item.category.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Exclusions tab */}
        {tab === 'exclusions' && (
          <div>
            {EXCLUSIONS.map((item, i) => (
              <div key={i} className="coverage-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--danger)', fontSize: '13px' }}>✕</span>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div>
            {HISTORY.map((h, i) => (
              <div key={i} className="history-row">
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>
                    {h.week}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    {h.plan} plan · {h.claims} claim{h.claims !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: h.payout > 0 ? 'var(--success)' : 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    {h.payout > 0 ? `+₹${h.payout}` : '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                    paid ₹{h.paid}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout calculation explainer */}
      <div className="policy-card" style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '12px' }}>
          HOW PAYOUTS ARE CALCULATED
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
          Payout is based on hours lost during the disruption window, your registered daily earnings, and your coverage percentage.
        </div>
        <div style={{
          marginTop: '14px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '10px', padding: '14px',
          fontFamily: 'JetBrains Mono', fontSize: '12px',
          color: 'var(--muted)', lineHeight: 1.8,
        }}>
          <div>Hours lost × (Daily earnings ÷ 8) × Coverage %</div>
          <div style={{ marginTop: '6px', color: 'var(--text)' }}>
            Example: 3 hrs × (₹700 ÷ 8) × 75% = <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹197</span>
          </div>
        </div>
      </div>

    </div>
  )
}