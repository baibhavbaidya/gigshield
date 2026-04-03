import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const FORECAST = [
  { day: 'Mon', date: '17', risk: 22, label: 'Low' },
  { day: 'Tue', date: '18', risk: 45, label: 'Moderate' },
  { day: 'Wed', date: '19', risk: 78, label: 'High' },
  { day: 'Thu', date: '20', risk: 82, label: 'High' },
  { day: 'Fri', date: '21', risk: 60, label: 'Moderate' },
  { day: 'Sat', date: '22', risk: 35, label: 'Low' },
  { day: 'Sun', date: '23', risk: 20, label: 'Low' },
]

const LIVE_TRIGGERS = [
  { name: 'Rainfall',      value: '12 mm/hr',  threshold: '65 mm/hr',  status: 'safe' },
  { name: 'Heat Index',    value: '38°C',       threshold: '43°C',      status: 'safe' },
  { name: 'AQI',           value: '187',        threshold: '300',       status: 'safe' },
  { name: 'Darkstore',     value: 'Online',     threshold: 'Offline',   status: 'safe' },
  { name: 'Bandh / Strike',value: 'None',       threshold: 'Declared',  status: 'safe' },
  { name: 'App Status',    value: 'Operational',threshold: '45 min down',status: 'safe' },
]

const RECENT_CLAIMS = [
  { id: 'CLM-2847', trigger: 'Heavy Rainfall', date: 'Mar 14', amount: 197, status: 'paid' },
  { id: 'CLM-2801', trigger: 'Severe AQI',     date: 'Mar 09', amount: 164, status: 'paid' },
  { id: 'CLM-2755', trigger: 'Bandh',          date: 'Mar 02', amount: 197, status: 'paid' },
]

function getRiskColor(risk) {
  if (risk >= 70) return '#EF4444'
  if (risk >= 40) return '#F59E0B'
  return '#10B981'
}

function getRiskLabel(risk) {
  if (risk >= 70) return 'High'
  if (risk >= 40) return 'Moderate'
  return 'Low'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [policyActive, setPolicyActive] = useState(false)
  const [paying, setPaying] = useState(false)
  const [liveData, setLiveData] = useState(LIVE_TRIGGERS)
  const today = new Date()
  const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1
  const weekRisk = Math.round(FORECAST.reduce((a, b) => a + b.risk, 0) / FORECAST.length)

  // Simulate live data fluctuation
  useEffect(() => {
    const id = setInterval(() => {
      setLiveData(prev => prev.map((t, i) => {
        if (i === 0) {
          const val = Math.max(5, Math.min(30, parseFloat(t.value) + (Math.random() - 0.5) * 3))
          return { ...t, value: `${val.toFixed(1)} mm/hr` }
        }
        if (i === 2) {
          const val = Math.max(150, Math.min(220, parseInt(t.value) + Math.round((Math.random() - 0.5) * 8)))
          return { ...t, value: `${val}` }
        }
        return t
      }))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  function handleActivate() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPolicyActive(true)
    }, 2000)
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      <style>{`
        .dash-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .trigger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .trigger-row:last-child { border-bottom: none; }
        .forecast-bar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          cursor: default;
        }
        .forecast-bar-bg {
          width: 100%;
          height: 80px;
          background: var(--surface2);
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .forecast-bar-fill {
          width: 100%;
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }
        .claim-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .claim-row:last-child { border-bottom: none; }
        .stat-mini {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
          flex: 1;
          min-width: 0;
        }
        @media (max-width: 400px) {
          .dash-card { padding: 16px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Good morning, Ravi
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '3px' }}>
          Blinkit · Andheri East, Mumbai
        </div>
      </div>

      {/* Policy status card */}
      {!policyActive ? (
        <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '6px' }}>
                THIS WEEK
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>
                No active coverage
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Activate your Standard plan to protect this week's earnings.
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: '10px 20px', flexShrink: 0 }}
              onClick={handleActivate}
              disabled={paying}
            >
              {paying ? 'Processing...' : 'Pay ₹89 — Activate'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--success)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '6px' }}>
                ACTIVE THIS WEEK
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>
                Standard Plan · ₹89/week
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Covers up to ₹262/day · Expires Sunday 11:59 PM
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '99px', padding: '6px 14px',
            }}>
              <span className="pulse" style={{ fontSize: '8px', color: 'var(--success)' }}>●</span>
              <span style={{ fontSize: '12px', color: 'var(--success)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                PROTECTED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mini stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'EARNED THIS WEEK', value: '₹3,800', color: 'var(--text)' },
          { label: 'PROTECTED', value: '₹558', color: 'var(--success)' },
          { label: 'CLAIM STREAK', value: '3 wks', color: 'var(--accent)' },
        ].map((s, i) => (
          <div key={i} className="stat-mini">
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '5px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly forecast */}
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              WEEKLY FORECAST
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>
              Disruption Risk — Andheri East
            </div>
          </div>
          <div style={{
            background: `${getRiskColor(weekRisk)}15`,
            border: `1px solid ${getRiskColor(weekRisk)}40`,
            borderRadius: '8px', padding: '6px 12px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '20px', color: getRiskColor(weekRisk) }}>
              {weekRisk}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
              AVG RISK
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
          {FORECAST.map((f, i) => {
            const isToday = i === todayIdx
            const color = getRiskColor(f.risk)
            return (
              <div key={i} className="forecast-bar-wrap">
                <div className="forecast-bar-bg">
                  <div className="forecast-bar-fill" style={{
                    height: `${f.risk}%`,
                    background: isToday
                      ? color
                      : `${color}66`,
                    boxShadow: isToday ? `0 0 12px ${color}66` : 'none',
                  }} />
                </div>
                <div style={{
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono',
                  color: isToday ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {f.day}
                </div>
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--muted)',
                }}>
                  {f.date}
                </div>
              </div>
            )
          })}
        </div>

        {weekRisk >= 60 && (
          <div style={{
            marginTop: '14px',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '8px', padding: '10px 14px',
            fontSize: '12px', color: 'var(--accent)',
            fontFamily: 'JetBrains Mono',
          }}>
            High disruption risk this week. Consider upgrading to Premium plan.
          </div>
        )}
      </div>

      {/* Live trigger monitor */}
      <div className="dash-card">
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px' }}>
              LIVE MONITOR
            </div>
            <span className="pulse" style={{ fontSize: '8px', color: 'var(--success)' }}>●</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>
            Current Zone Conditions
          </div>
        </div>

        {liveData.map((t, i) => (
          <div key={i} className="trigger-row">
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                Threshold: {t.threshold}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontWeight: 600,
                fontSize: '13px', color: 'var(--text)',
              }}>
                {t.value}
              </div>
              <div className="badge badge-success" style={{ fontSize: '10px' }}>
                CLEAR
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent claims */}
      <div className="dash-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              RECENT CLAIMS
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Payout History</div>
          </div>
          <span
            style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
            onClick={() => navigate('/claims')}
          >
            View all
          </span>
        </div>

        {RECENT_CLAIMS.map((c, i) => (
          <div key={i} className="claim-row">
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{c.trigger}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                {c.id} · {c.date}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '15px', color: 'var(--success)' }}>
                +₹{c.amount}
              </div>
              <div className="badge badge-success">PAID</div>
            </div>
          </div>
        ))}
      </div>

      {/* Loyalty streak */}
      <div className="dash-card" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
              SURGE SHIELD
            </div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Loyalty Discount</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px', color: 'var(--accent)' }}>
              3/12
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>WEEKS</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', borderRadius: '99px', height: '6px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{
            height: '100%', borderRadius: '99px',
            background: 'var(--accent)',
            width: `${(3 / 12) * 100}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { weeks: 4, discount: '5%' },
            { weeks: 8, discount: '10%' },
            { weeks: 12, discount: '15%' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 3 >= m.weeks ? 'var(--success)' : 'var(--muted)', fontWeight: 600 }}>
                {m.discount}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                {m.weeks}wk
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}