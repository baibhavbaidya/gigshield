import { useState } from 'react'

const ALL_CLAIMS = [
  {
    id: 'CLM-2901',
    worker: 'Ravi Kumar',
    workerId: 'BLK-2024-004821',
    zone: 'Mumbai — Andheri',
    trigger: 'Darkstore Closure',
    category: 'Platform',
    date: 'Mar 17, 2026',
    time: '2:45 PM',
    amount: 131,
    status: 'processing',
    fraudScore: 18,
    gpsMatch: true,
    platformActive: true,
    duplicate: false,
    behavioural: true,
  },
  {
    id: 'CLM-2902',
    worker: 'Suresh Patel',
    workerId: 'ZPT-2024-007732',
    zone: 'Mumbai — Andheri',
    trigger: 'Darkstore Closure',
    category: 'Platform',
    date: 'Mar 17, 2026',
    time: '2:46 PM',
    amount: 175,
    status: 'reviewing',
    fraudScore: 48,
    gpsMatch: false,
    platformActive: true,
    duplicate: false,
    behavioural: true,
  },
  {
    id: 'CLM-2903',
    worker: 'Arjun Singh',
    workerId: 'BLK-2024-009901',
    zone: 'Mumbai — Andheri',
    trigger: 'Darkstore Closure',
    category: 'Platform',
    date: 'Mar 17, 2026',
    time: '2:46 PM',
    amount: 131,
    status: 'rejected',
    fraudScore: 74,
    gpsMatch: false,
    platformActive: false,
    duplicate: true,
    behavioural: false,
  },
  {
    id: 'CLM-2847',
    worker: 'Ravi Kumar',
    workerId: 'BLK-2024-004821',
    zone: 'Mumbai — Andheri',
    trigger: 'Heavy Rainfall',
    category: 'Environmental',
    date: 'Mar 14, 2026',
    time: '6:12 PM',
    amount: 197,
    status: 'paid',
    fraudScore: 12,
    gpsMatch: true,
    platformActive: true,
    duplicate: false,
    behavioural: true,
  },
  {
    id: 'CLM-2855',
    worker: 'Priya Sharma',
    workerId: 'ZPT-2024-003341',
    zone: 'Delhi — Saket',
    trigger: 'Severe AQI',
    category: 'Environmental',
    date: 'Mar 14, 2026',
    time: '1:30 PM',
    amount: 262,
    status: 'paid',
    fraudScore: 9,
    gpsMatch: true,
    platformActive: true,
    duplicate: false,
    behavioural: true,
  },
  {
    id: 'CLM-2856',
    worker: 'Mohammed Irfan',
    workerId: 'BLK-2024-001122',
    zone: 'Delhi — Saket',
    trigger: 'Severe AQI',
    category: 'Environmental',
    date: 'Mar 14, 2026',
    time: '1:31 PM',
    amount: 175,
    status: 'reviewing',
    fraudScore: 55,
    gpsMatch: true,
    platformActive: false,
    duplicate: false,
    behavioural: false,
  },
  {
    id: 'CLM-2801',
    worker: 'Ravi Kumar',
    workerId: 'BLK-2024-004821',
    zone: 'Mumbai — Andheri',
    trigger: 'Severe AQI',
    category: 'Environmental',
    date: 'Mar 09, 2026',
    time: '11:30 AM',
    amount: 164,
    status: 'paid',
    fraudScore: 8,
    gpsMatch: true,
    platformActive: true,
    duplicate: false,
    behavioural: true,
  },
]

const STATUS_CONFIG = {
  paid:       { label: 'PAID',         color: 'var(--success)', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)'  },
  processing: { label: 'PROCESSING',   color: 'var(--accent)',  bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)'  },
  reviewing:  { label: 'UNDER REVIEW', color: '#3b82f6',        bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)'  },
  rejected:   { label: 'REJECTED',     color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'   },
}

const CATEGORY_COLORS = {
  Environmental: 'var(--accent)',
  Social:        '#3b82f6',
  Platform:      'var(--success)',
}

function getFraudColor(score) {
  if (score <= 30) return 'var(--success)'
  if (score <= 60) return 'var(--accent)'
  return 'var(--danger)'
}

export default function AdminClaims() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [claims, setClaims] = useState(ALL_CLAIMS)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = claims.filter(c => {
    const matchFilter = filter === 'all' ? true : c.status === filter
    const matchSearch = search === ''
      ? true
      : c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.worker.toLowerCase().includes(search.toLowerCase()) ||
        c.zone.toLowerCase().includes(search.toLowerCase()) ||
        c.trigger.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const selectedClaim = claims.find(c => c.id === selected)

  function handleAction(id, action) {
    setActionLoading(true)
    setTimeout(() => {
      setClaims(prev => prev.map(c =>
        c.id === id
          ? { ...c, status: action === 'approve' ? 'paid' : 'rejected' }
          : c
      ))
      setActionLoading(false)
      if (action === 'approve') setSelected(null)
    }, 1200)
  }

  const counts = {
    all:        claims.length,
    processing: claims.filter(c => c.status === 'processing').length,
    reviewing:  claims.filter(c => c.status === 'reviewing').length,
    paid:       claims.filter(c => c.status === 'paid').length,
    rejected:   claims.filter(c => c.status === 'rejected').length,
  }

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px' }}>

      <style>{`
        .claims-table-row {
          display: grid;
          grid-template-columns: 110px 1fr 140px 100px 80px 90px 120px;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.15s;
          font-size: 13px;
        }
        .claims-table-row:hover { background: rgba(255,255,255,0.02); }
        .claims-table-row.selected { background: rgba(245,158,11,0.04); }
        .claims-table-header {
          display: grid;
          grid-template-columns: 110px 1fr 140px 100px 80px 90px 120px;
          gap: 12px;
          align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 10px;
          color: var(--muted);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.8px;
        }
        .filter-pill {
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
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-pill.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }
        .fraud-check-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .fraud-check-row:last-child { border-bottom: none; }
        @media (max-width: 900px) {
          .claims-table-row,
          .claims-table-header {
            grid-template-columns: 100px 1fr 80px 80px 120px;
          }
          .col-zone, .col-date { display: none; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          CLAIMS MANAGEMENT
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Claims & Fraud Queue
        </div>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
        gap: '12px', marginBottom: '20px',
      }}>
        {[
          { label: 'TOTAL CLAIMS',  value: counts.all,        color: 'var(--text)'    },
          { label: 'PROCESSING',    value: counts.processing,  color: 'var(--accent)'  },
          { label: 'UNDER REVIEW',  value: counts.reviewing,   color: '#3b82f6'        },
          { label: 'PAID',          value: counts.paid,        color: 'var(--success)' },
          { label: 'REJECTED',      value: counts.rejected,    color: 'var(--danger)'  },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px',
            cursor: 'pointer',
          }}
            onClick={() => setFilter(
              s.label === 'TOTAL CLAIMS' ? 'all'
                : s.label === 'PROCESSING' ? 'processing'
                : s.label === 'UNDER REVIEW' ? 'reviewing'
                : s.label.toLowerCase()
            )}
          >
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '28px', color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px' }}>

        {/* Left — table */}
        <div>
          {/* Filters + search */}
          <div style={{
            display: 'flex', gap: '10px',
            marginBottom: '16px', flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1 }}>
              {[
                { value: 'all',        label: 'All',          count: counts.all        },
                { value: 'reviewing',  label: 'Review Queue', count: counts.reviewing  },
                { value: 'processing', label: 'Processing',   count: counts.processing },
                { value: 'paid',       label: 'Paid',         count: counts.paid       },
                { value: 'rejected',   label: 'Rejected',     count: counts.rejected   },
              ].map(f => (
                <button
                  key={f.value}
                  className={`filter-pill ${filter === f.value ? 'active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                  <span style={{
                    background: filter === f.value ? 'rgba(0,0,0,0.2)' : 'var(--surface2)',
                    borderRadius: '99px', padding: '1px 6px',
                    fontSize: '10px', fontFamily: 'JetBrains Mono',
                    color: filter === f.value ? '#000' : 'var(--muted)',
                  }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <input
              placeholder="Search claims..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: 'var(--text)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'DM Sans',
                width: '180px',
                flexShrink: 0,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Table */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <div className="claims-table-header">
              <div>CLAIM ID</div>
              <div>WORKER</div>
              <div className="col-zone">ZONE</div>
              <div className="col-date">TRIGGER</div>
              <div>AMOUNT</div>
              <div>FRAUD</div>
              <div>STATUS</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                No claims found
              </div>
            ) : (
              filtered.map(c => {
                const status = STATUS_CONFIG[c.status]
                const fraudColor = getFraudColor(c.fraudScore)
                return (
                  <div
                    key={c.id}
                    className={`claims-table-row ${selected === c.id ? 'selected' : ''}`}
                    onClick={() => setSelected(selected === c.id ? null : c.id)}
                  >
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--accent)' }}>
                      {c.id}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '1px' }}>{c.worker}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                        {c.workerId}
                      </div>
                    </div>
                    <div className="col-zone" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {c.zone}
                    </div>
                    <div className="col-date">
                      <span style={{
                        fontSize: '10px', fontFamily: 'JetBrains Mono',
                        padding: '2px 7px', borderRadius: '99px',
                        background: `${CATEGORY_COLORS[c.category]}15`,
                        color: CATEGORY_COLORS[c.category],
                        fontWeight: 600,
                      }}>
                        {c.trigger}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--success)' }}>
                      ₹{c.amount}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px', color: fraudColor }}>
                      {c.fraudScore}
                    </div>
                    <div>
                      <span style={{
                        fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '99px',
                        background: status.bg, color: status.color,
                        border: `1px solid ${status.border}`,
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                      }}>
                        {c.status === 'processing' && <span className="pulse">●</span>}
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right — detail panel */}
        {selected && selectedClaim && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
            height: 'fit-content',
            position: 'sticky',
            top: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                  CLAIM DETAIL
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{selectedClaim.id}</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>

            {/* Worker info */}
            <div style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px',
              marginBottom: '14px',
            }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{selectedClaim.worker}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginBottom: '2px' }}>
                {selectedClaim.workerId}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {selectedClaim.zone}
              </div>
            </div>

            {/* Claim info */}
            <div style={{ marginBottom: '14px' }}>
              {[
                { label: 'Trigger',  value: selectedClaim.trigger },
                { label: 'Date',     value: `${selectedClaim.date} · ${selectedClaim.time}` },
                { label: 'Amount',   value: `₹${selectedClaim.amount}` },
                { label: 'Category', value: selectedClaim.category },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                  fontSize: '13px',
                }}>
                  <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Fraud breakdown */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '10px' }}>
                FRAUD ASSESSMENT
              </div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Isolation Forest Score</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '24px', color: getFraudColor(selectedClaim.fraudScore) }}>
                  {selectedClaim.fraudScore}
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>/100</span>
                </div>
              </div>

              {[
                { label: 'GPS zone match',       pass: selectedClaim.gpsMatch },
                { label: 'Platform activity',    pass: selectedClaim.platformActive },
                { label: 'No duplicate claim',   pass: !selectedClaim.duplicate },
                { label: 'Behavioural baseline', pass: selectedClaim.behavioural },
              ].map((check, i) => (
                <div key={i} className="fraud-check-row">
                  <span style={{ fontSize: '13px' }}>{check.label}</span>
                  <span style={{
                    fontSize: '11px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                    color: check.pass ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {check.pass ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            {(selectedClaim.status === 'reviewing' || selectedClaim.status === 'processing') && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  onClick={() => handleAction(selectedClaim.id, 'approve')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Approve & Pay'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  onClick={() => handleAction(selectedClaim.id, 'reject')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : 'Reject'}
                </button>
              </div>
            )}

            {selectedClaim.status === 'paid' && (
              <div style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '10px', padding: '12px',
                fontSize: '13px', color: 'var(--success)',
                fontFamily: 'JetBrains Mono', textAlign: 'center',
              }}>
                ✓ Payout completed
              </div>
            )}

            {selectedClaim.status === 'rejected' && (
              <div style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px', padding: '12px',
                fontSize: '13px', color: 'var(--danger)',
                fontFamily: 'JetBrains Mono', textAlign: 'center',
              }}>
                ✗ Claim rejected
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}