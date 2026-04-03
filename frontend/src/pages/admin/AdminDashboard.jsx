import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const METRICS = [
  { label: 'ACTIVE POLICIES',    value: '1,284',  delta: '+12 today',   up: true },
  { label: 'PREMIUMS THIS WEEK', value: '₹1.14L', delta: '+₹10,680',    up: true },
  { label: 'CLAIMS TODAY',       value: '38',      delta: '+8 triggered', up: null },
  { label: 'PAYOUTS TODAY',      value: '₹7,486',  delta: '34 approved',  up: true },
  { label: 'FRAUD FLAGGED',      value: '4',       delta: '2 auto-rejected', up: null },
  { label: 'LOSS RATIO',         value: '18.4%',   delta: '-2.1% vs last week', up: true },
]

const RECENT_EVENTS = [
  { time: '2:47 PM', event: 'Darkstore closure detected', zone: 'Andheri East', workers: 23, status: 'triggered' },
  { time: '2:41 PM', event: '23 claims auto-approved',    zone: 'Andheri East', workers: 23, status: 'approved' },
  { time: '2:41 PM', event: 'Payouts initiated via Razorpay', zone: 'Andheri East', workers: 23, status: 'paid' },
  { time: '1:30 PM', event: 'AQI crossed 300 threshold', zone: 'Delhi Saket',   workers: 41, status: 'triggered' },
  { time: '1:32 PM', event: '38 claims auto-approved',   zone: 'Delhi Saket',   workers: 38, status: 'approved' },
  { time: '1:33 PM', event: '3 claims flagged for review', zone: 'Delhi Saket', workers: 3,  status: 'flagged' },
  { time: '11:15 AM', event: 'Fraud ring detected — 12 claims rejected', zone: 'Mumbai Dharavi', workers: 12, status: 'rejected' },
]

const ZONE_RISKS = [
  { zone: 'Mumbai Dharavi',       risk: 82, workers: 312, claims: 28 },
  { zone: 'Delhi Saket',          risk: 74, workers: 198, claims: 41 },
  { zone: 'Mumbai Andheri',       risk: 61, workers: 287, claims: 23 },
  { zone: 'Bengaluru Koramangala',risk: 34, workers: 241, claims: 0  },
  { zone: 'Hyderabad Madhapur',   risk: 22, workers: 189, claims: 0  },
  { zone: 'Chennai Adyar',        risk: 18, workers: 57,  claims: 0  },
]

const STATUS_CONFIG = {
  triggered: { label: 'TRIGGERED', color: 'var(--accent)',  bg: 'rgba(245,158,11,0.1)' },
  approved:  { label: 'APPROVED',  color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  paid:      { label: 'PAID',      color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  flagged:   { label: 'FLAGGED',   color: '#3b82f6',        bg: 'rgba(59,130,246,0.1)' },
  rejected:  { label: 'REJECTED',  color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)'  },
}

function getRiskColor(risk) {
  if (risk >= 70) return '#EF4444'
  if (risk >= 40) return '#F59E0B'
  return '#10B981'
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const [liveMetrics, setLiveMetrics] = useState(METRICS)

  const SIMULATION_STEPS = [
    '● Rainfall threshold crossed — 71mm/hr in Andheri East',
    '● 3 demo worker policies matched in zone',
    '● Fraud engine running — GPS · Platform activity · Behavioural baseline',
    '● Fraud scores: Worker #4821 → 12 ✓  Worker #2934 → 74 ✗  Worker #7102 → 18 ✓',
    '● 2 claims auto-approved · 1 auto-rejected',
    '● Razorpay UPI transfers initiated — ₹197 + ₹131',
    '● WhatsApp notifications sent to 2 workers',
    '✓ Simulation complete — full cycle in 6 minutes 12 seconds',
  ]

  function runSimulation() {
    setSimulationRunning(true)
    setSimulationStep(0)
    let step = 0
    const id = setInterval(() => {
      step++
      setSimulationStep(step)
      if (step >= SIMULATION_STEPS.length - 1) {
        clearInterval(id)
        setSimulationRunning(false)
      }
    }, 900)
  }

  // Live metric fluctuation
  useEffect(() => {
    const id = setInterval(() => {
      setLiveMetrics(prev => prev.map((m, i) => {
        if (i === 2) {
          const base = parseInt(m.value)
          const newVal = Math.max(30, base + Math.round((Math.random() - 0.4) * 2))
          return { ...m, value: `${newVal}` }
        }
        return m
      }))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px' }}>

      <style>{`
        .admin-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .metric-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px;
        }
        .event-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .event-row:last-child { border-bottom: none; }
        .zone-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .zone-row:last-child { border-bottom: none; }
        .sim-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          padding: 4px 0;
          transition: color 0.3s;
        }
        @media (max-width: 768px) {
          .admin-metrics { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
            ADMIN PORTAL
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Overview Dashboard
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '3px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '9px 18px' }}
            onClick={() => navigate('/admin/monitor')}
          >
            Live Monitor
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '9px 18px' }}
            onClick={runSimulation}
            disabled={simulationRunning}
          >
            {simulationRunning ? 'Running...' : 'Simulate Disruption'}
          </button>
        </div>
      </div>

      {/* Metrics grid */}
      <div
        className="admin-metrics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {liveMetrics.map((m, i) => (
          <div key={i} className="metric-card">
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.8px', marginBottom: '8px' }}>
              {m.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '26px', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              {m.value}
            </div>
            <div style={{
              fontSize: '11px', fontFamily: 'JetBrains Mono',
              color: m.up === true ? 'var(--success)' : m.up === false ? 'var(--danger)' : 'var(--muted)',
            }}>
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Simulation terminal */}
      {(simulationRunning || simulationStep > 0) && (
        <div style={{
          background: '#0a0a0a',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          fontFamily: 'JetBrains Mono',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span className={simulationRunning ? 'pulse' : ''} style={{ fontSize: '8px', color: simulationRunning ? 'var(--accent)' : 'var(--success)' }}>●</span>
            <span style={{ fontSize: '11px', color: simulationRunning ? 'var(--accent)' : 'var(--success)', letterSpacing: '1px' }}>
              {simulationRunning ? 'SIMULATION RUNNING' : 'SIMULATION COMPLETE'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {SIMULATION_STEPS.slice(0, simulationStep + 1).map((line, i) => (
              <div key={i} className="sim-line" style={{
                color: i === simulationStep
                  ? line.startsWith('✓') ? 'var(--success)' : 'var(--accent)'
                  : 'var(--muted)',
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="admin-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Recent events */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                LIVE FEED
              </div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>Recent Events</div>
            </div>
            <span className="pulse" style={{ fontSize: '8px', color: 'var(--success)' }}>●</span>
          </div>

          {RECENT_EVENTS.map((e, i) => {
            const s = STATUS_CONFIG[e.status]
            return (
              <div key={i} className="event-row">
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', minWidth: '52px', paddingTop: '2px' }}>
                  {e.time}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{e.event}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      {e.zone}
                    </span>
                    <span style={{
                      fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                      padding: '2px 7px', borderRadius: '99px',
                      background: s.bg, color: s.color,
                    }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Zone risk table */}
        <div className="admin-card">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              ZONE RISK
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Active Zone Overview</div>
          </div>

          {ZONE_RISKS.map((z, i) => {
            const color = getRiskColor(z.risk)
            return (
              <div key={i} className="zone-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{z.zone}</div>
                  <div style={{ background: 'var(--surface2)', borderRadius: '99px', height: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${z.risk}%`, background: color, borderRadius: '99px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px', color }}>
                      {z.risk}%
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>RISK</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px', color: z.claims > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                      {z.claims}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>CLAIMS</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px' }}>
                      {z.workers}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>WORKERS</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pool health */}
      <div className="admin-card" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              POOL HEALTH
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Weekly Premium vs Payout</div>
          </div>
          <div style={{
            display: 'flex', gap: '16px',
          }}>
            {[
              { color: 'rgba(245,158,11,0.5)', label: 'Premiums' },
              { color: 'var(--success)',        label: 'Payouts' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        {(() => {
          const weeks = [
            { label: 'W1', premium: 89000, payout: 12400 },
            { label: 'W2', premium: 94000, payout: 18600 },
            { label: 'W3', premium: 98000, payout: 9800  },
            { label: 'W4', premium: 102000, payout: 21000 },
            { label: 'W5', premium: 108000, payout: 16400 },
            { label: 'W6', premium: 114000, payout: 7486  },
          ]
          const maxVal = Math.max(...weeks.map(w => w.premium))
          return (
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', marginBottom: '8px' }}>
                {weeks.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%' }}>
                    <div style={{
                      flex: 1,
                      height: `${(w.premium / maxVal) * 100}%`,
                      background: 'rgba(245,158,11,0.4)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                    }} />
                    <div style={{
                      flex: 1,
                      height: `${(w.payout / maxVal) * 100}%`,
                      background: 'var(--success)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {weeks.map((w, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{w.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '12px', marginTop: '16px',
          paddingTop: '16px', borderTop: '1px solid var(--border)',
        }}>
          {[
            { label: 'TOTAL PREMIUMS', value: '₹6.05L', color: 'var(--accent)' },
            { label: 'TOTAL PAYOUTS',  value: '₹85,686', color: 'var(--success)' },
            { label: 'POOL SURPLUS',   value: '₹5.19L', color: 'var(--text)' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '20px', color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}