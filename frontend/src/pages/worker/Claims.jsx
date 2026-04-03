import { useState } from 'react'

const CLAIMS = [
  {
    id: 'CLM-2847',
    trigger: 'Heavy Rainfall',
    category: 'Environmental',
    date: 'Mar 14, 2026',
    time: '6:12 PM',
    zone: 'Andheri East, Mumbai',
    hoursLost: 3,
    dailyEarning: 700,
    coverage: 75,
    amount: 197,
    status: 'paid',
    fraudScore: 12,
    triggerValue: '71 mm/hr',
    threshold: '65 mm/hr',
    payoutTime: '7 min',
    upiRef: 'UPI2847BLKT',
  },
  {
    id: 'CLM-2801',
    trigger: 'Severe AQI',
    category: 'Environmental',
    date: 'Mar 09, 2026',
    time: '11:30 AM',
    zone: 'Andheri East, Mumbai',
    hoursLost: 2.5,
    dailyEarning: 700,
    coverage: 75,
    amount: 164,
    status: 'paid',
    fraudScore: 8,
    triggerValue: '318 µg/m³',
    threshold: '300 µg/m³',
    payoutTime: '6 min',
    upiRef: 'UPI2801BLKT',
  },
  {
    id: 'CLM-2755',
    trigger: 'Bandh / Strike',
    category: 'Social',
    date: 'Mar 02, 2026',
    time: '8:00 AM',
    zone: 'Andheri East, Mumbai',
    hoursLost: 3,
    dailyEarning: 700,
    coverage: 75,
    amount: 197,
    status: 'paid',
    fraudScore: 9,
    triggerValue: 'Declared',
    threshold: 'Active in zone',
    payoutTime: '8 min',
    upiRef: 'UPI2755BLKT',
  },
  {
    id: 'CLM-2901',
    trigger: 'Darkstore Closure',
    category: 'Platform',
    date: 'Mar 17, 2026',
    time: '2:45 PM',
    zone: 'Andheri East, Mumbai',
    hoursLost: 2,
    dailyEarning: 700,
    coverage: 75,
    amount: 131,
    status: 'processing',
    fraudScore: 18,
    triggerValue: 'Offline',
    threshold: 'Store offline',
    payoutTime: null,
    upiRef: null,
  },
]

const STATUS_CONFIG = {
  paid: {
    label: 'PAID',
    color: 'var(--success)',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
  },
  processing: {
    label: 'PROCESSING',
    color: 'var(--accent)',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
  },
  reviewing: {
    label: 'UNDER REVIEW',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
  },
  rejected: {
    label: 'REJECTED',
    color: 'var(--danger)',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
  },
}

const CATEGORY_COLORS = {
  Environmental: 'var(--accent)',
  Social: '#3b82f6',
  Platform: 'var(--success)',
}

function getFraudLabel(score) {
  if (score <= 30) return { label: 'Clean', color: 'var(--success)' }
  if (score <= 60) return { label: 'Review', color: 'var(--accent)' }
  return { label: 'Flagged', color: 'var(--danger)' }
}

export default function Claims() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? CLAIMS
    : CLAIMS.filter(c => c.status === filter)

  const totalPaid = CLAIMS
    .filter(c => c.status === 'paid')
    .reduce((a, b) => a + b.amount, 0)

  const selectedClaim = CLAIMS.find(c => c.id === selected)

  return (
    <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      <style>{`
        .claim-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .claim-card:hover {
          border-color: rgba(245,158,11,0.3);
        }
        .claim-card.active {
          border-color: rgba(245,158,11,0.5);
          background: rgba(245,158,11,0.03);
        }
        .filter-btn {
          padding: 7px 14px;
          border-radius: 99px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-btn.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .detail-row:last-child { border-bottom: none; }
        .timeline-step {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
        }
        .timeline-step:last-child { margin-bottom: 0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          CLAIMS
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          My Claims
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'TOTAL CLAIMS', value: CLAIMS.length },
          { label: 'TOTAL PAID OUT', value: `₹${totalPaid}` },
          { label: 'AVG PAYOUT TIME', value: '7 min' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '14px',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '5px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: 'var(--accent)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { value: 'all',        label: 'All' },
          { value: 'paid',       label: 'Paid' },
          { value: 'processing', label: 'Processing' },
          { value: 'reviewing',  label: 'Under Review' },
          { value: 'rejected',   label: 'Rejected' },
        ].map(f => (
          <button
            key={f.value}
            className={`filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Claims list */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '40px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--muted)' }}>No claims found</div>
        </div>
      ) : (
        filtered.map(claim => {
          const status = STATUS_CONFIG[claim.status]
          const isOpen = selected === claim.id
          const fraud = getFraudLabel(claim.fraudScore)

          return (
            <div key={claim.id}>
              <div
                className={`claim-card ${isOpen ? 'active' : ''}`}
                onClick={() => setSelected(isOpen ? null : claim.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{claim.trigger}</span>
                      <span style={{
                        fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '99px',
                        background: `${CATEGORY_COLORS[claim.category]}15`,
                        color: CATEGORY_COLORS[claim.category],
                      }}>
                        {claim.category.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      {claim.id} · {claim.date} · {claim.time}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: claim.status === 'paid' ? 'var(--success)' : 'var(--text)', marginBottom: '4px' }}>
                      {claim.status === 'paid' ? `+₹${claim.amount}` : `₹${claim.amount}`}
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '99px',
                      background: status.bg, color: status.color,
                      border: `1px solid ${status.border}`,
                    }}>
                      {claim.status === 'processing' && <span className="pulse">●</span>}
                      {status.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && selectedClaim && (
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '0 0 14px 14px',
                  padding: '20px',
                  marginTop: '-10px',
                  marginBottom: '10px',
                }}>

                  {/* Trigger detail */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '10px' }}>
                      TRIGGER DETAILS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { label: 'TRIGGER TYPE', value: selectedClaim.trigger },
                        { label: 'DETECTED VALUE', value: selectedClaim.triggerValue },
                        { label: 'THRESHOLD', value: selectedClaim.threshold },
                        { label: 'ZONE', value: selectedClaim.zone },
                      ].map((d, i) => (
                        <div key={i} style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px', padding: '10px 12px',
                        }}>
                          <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '3px' }}>
                            {d.label}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payout breakdown */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '10px' }}>
                      PAYOUT BREAKDOWN
                    </div>
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px', overflow: 'hidden',
                    }}>
                      {[
                        { label: 'Hours lost', value: `${selectedClaim.hoursLost} hrs` },
                        { label: 'Hourly rate', value: `₹${(selectedClaim.dailyEarning / 8).toFixed(0)}/hr` },
                        { label: 'Coverage', value: `${selectedClaim.coverage}%` },
                        { label: 'Payout amount', value: `₹${selectedClaim.amount}`, highlight: true },
                      ].map((r, i) => (
                        <div key={i} className="detail-row" style={{
                          padding: '10px 14px',
                          background: r.highlight ? 'rgba(16,185,129,0.05)' : 'transparent',
                        }}>
                          <span style={{ color: r.highlight ? 'var(--text)' : 'var(--muted)', fontWeight: r.highlight ? 600 : 400 }}>
                            {r.label}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono', fontWeight: 700,
                            color: r.highlight ? 'var(--success)' : 'var(--text)',
                          }}>
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fraud score */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '10px' }}>
                      FRAUD ASSESSMENT
                    </div>
                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px', padding: '14px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: '16px',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '3px' }}>
                          Isolation Forest Score
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                          GPS · Platform activity · Behavioural baseline
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '24px', color: fraud.color }}>
                          {selectedClaim.fraudScore}
                        </div>
                        <div style={{ fontSize: '11px', color: fraud.color, fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                          {fraud.label.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payout status */}
                  {selectedClaim.status === 'paid' && (
                    <div style={{
                      background: 'rgba(16,185,129,0.06)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: '10px', padding: '14px',
                    }}>
                      <div style={{ fontSize: '11px', color: 'var(--success)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '8px' }}>
                        PAYOUT CONFIRMED
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        {[
                          { label: 'Amount', value: `₹${selectedClaim.amount}` },
                          { label: 'Time to payout', value: selectedClaim.payoutTime },
                          { label: 'UPI Reference', value: selectedClaim.upiRef },
                        ].map((d, i) => (
                          <div key={i}>
                            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>
                              {d.label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--success)' }}>
                              {d.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedClaim.status === 'processing' && (
                    <div style={{
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      borderRadius: '10px', padding: '14px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <span className="pulse" style={{ color: 'var(--accent)', fontSize: '10px' }}>●</span>
                      <div style={{ fontSize: '13px', color: 'var(--accent)' }}>
                        Fraud check in progress. Payout expected within 8 minutes.
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )
        })
      )}

    </div>
  )
}