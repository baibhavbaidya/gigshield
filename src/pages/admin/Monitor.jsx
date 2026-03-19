import { useState, useEffect } from 'react'

const ZONES = [
  'Mumbai — Andheri',
  'Mumbai — Dharavi',
  'Delhi — Saket',
  'Bengaluru — Koramangala',
  'Hyderabad — Madhapur',
  'Chennai — Adyar',
]

const TRIGGERS = [
  {
    id: 'rainfall',
    name: 'Rainfall',
    unit: 'mm/hr',
    threshold: 65,
    category: 'Environmental',
    base: 12,
    variance: 8,
  },
  {
    id: 'heat',
    name: 'Heat Index',
    unit: '°C',
    threshold: 43,
    category: 'Environmental',
    base: 38,
    variance: 3,
  },
  {
    id: 'aqi',
    name: 'AQI',
    unit: 'µg/m³',
    threshold: 300,
    category: 'Environmental',
    base: 187,
    variance: 25,
  },
  {
    id: 'waterlogging',
    name: 'Waterlogging',
    unit: 'status',
    threshold: 1,
    category: 'Environmental',
    base: 0,
    variance: 0,
    binary: true,
    binaryLabel: ['Clear', 'Active'],
  },
  {
    id: 'bandh',
    name: 'Bandh / Strike',
    unit: 'status',
    threshold: 1,
    category: 'Social',
    base: 0,
    variance: 0,
    binary: true,
    binaryLabel: ['None', 'Declared'],
  },
  {
    id: 'curfew',
    name: 'Sec 144 / Curfew',
    unit: 'status',
    threshold: 1,
    category: 'Social',
    base: 0,
    variance: 0,
    binary: true,
    binaryLabel: ['None', 'Active'],
  },
  {
    id: 'festival',
    name: 'Festival Closure',
    unit: 'status',
    threshold: 1,
    category: 'Social',
    base: 0,
    variance: 0,
    binary: true,
    binaryLabel: ['None', 'Active'],
  },
  {
    id: 'darkstore',
    name: 'Darkstore',
    unit: 'status',
    threshold: 1,
    category: 'Platform',
    base: 0,
    variance: 0,
    binary: true,
    binaryLabel: ['Online', 'Offline'],
  },
  {
    id: 'outage',
    name: 'App Outage',
    unit: 'min',
    threshold: 45,
    category: 'Platform',
    base: 0,
    variance: 2,
  },
]

const CATEGORY_COLORS = {
  Environmental: 'var(--accent)',
  Social: '#3b82f6',
  Platform: 'var(--success)',
}

function initValues() {
  const vals = {}
  TRIGGERS.forEach(t => {
    vals[t.id] = t.binary ? 0 : parseFloat((t.base + (Math.random() - 0.5) * t.variance).toFixed(1))
  })
  return vals
}

export default function Monitor() {
  const [selectedZone, setSelectedZone] = useState(ZONES[0])
  const [values, setValues] = useState(initValues)
  const [simulating, setSimulating] = useState(false)
  const [simTrigger, setSimTrigger] = useState(null)
  const [log, setLog] = useState([])
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Live fluctuation
  useEffect(() => {
    if (simulating) return
    const id = setInterval(() => {
      setValues(prev => {
        const next = { ...prev }
        TRIGGERS.forEach(t => {
          if (!t.binary && t.variance > 0) {
            const current = parseFloat(next[t.id])
            const newVal = Math.max(0, current + (Math.random() - 0.5) * (t.variance * 0.3))
            next[t.id] = parseFloat(newVal.toFixed(1))
          }
        })
        return next
      })
      setLastUpdated(new Date())
    }, 2000)
    return () => clearInterval(id)
  }, [simulating])

  function addLog(msg, type = 'info') {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLog(prev => [{ time, msg, type }, ...prev].slice(0, 50))
  }

  function simulateDisruption(triggerId) {
    const trigger = TRIGGERS.find(t => t.id === triggerId)
    if (!trigger) return
    setSimulating(true)
    setSimTrigger(triggerId)

    // Set value above threshold
    setValues(prev => ({
      ...prev,
      [triggerId]: trigger.binary ? 1 : trigger.threshold * 1.15,
    }))

    addLog(`Simulating: ${trigger.name} in ${selectedZone}`, 'warning')

    setTimeout(() => {
      addLog(`Threshold crossed — ${trigger.name} above ${trigger.threshold}${trigger.unit !== 'status' ? ' ' + trigger.unit : ''}`, 'warning')
    }, 800)

    setTimeout(() => {
      addLog('Matching active policies in zone...', 'info')
    }, 1600)

    setTimeout(() => {
      addLog('3 workers matched — auto-initiating claims', 'info')
    }, 2400)

    setTimeout(() => {
      addLog('Fraud engine running — Isolation Forest scoring...', 'info')
    }, 3200)

    setTimeout(() => {
      addLog('Worker #4821 — Fraud score: 12 → AUTO APPROVED', 'success')
      addLog('Worker #2934 — Fraud score: 74 → AUTO REJECTED (GPS spoof)', 'danger')
      addLog('Worker #7102 — Fraud score: 18 → AUTO APPROVED', 'success')
    }, 4200)

    setTimeout(() => {
      addLog('Razorpay UPI transfers initiated — ₹197 + ₹131', 'success')
      addLog('WhatsApp notifications sent to 2 workers', 'success')
    }, 5200)

    setTimeout(() => {
      addLog('✓ Full cycle complete — 2 paid, 1 rejected', 'success')
      setSimulating(false)
      setSimTrigger(null)
      // Reset value after sim
      setValues(prev => ({
        ...prev,
        [triggerId]: trigger.binary ? 0 : trigger.base,
      }))
    }, 6200)
  }

  function clearSimulation() {
    setValues(initValues())
    setLog([])
    setSimTrigger(null)
  }

  const triggeredCount = TRIGGERS.filter(t => {
    if (t.binary) return values[t.id] >= t.threshold
    return values[t.id] >= t.threshold
  }).length

  return (
    <div style={{ padding: '32px 28px', maxWidth: '1100px' }}>

      <style>{`
        .monitor-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .trigger-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px;
          transition: border-color 0.2s;
        }
        .trigger-card.breached {
          border-color: rgba(239,68,68,0.4);
          background: rgba(239,68,68,0.04);
        }
        .trigger-card.warning {
          border-color: rgba(245,158,11,0.4);
          background: rgba(245,158,11,0.04);
        }
        .log-line {
          display: flex;
          gap: 12px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.5;
        }
        .log-line:last-child { border-bottom: none; }
        .zone-pill {
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
        .zone-pill.active {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }
        @media (max-width: 768px) {
          .monitor-grid { grid-template-columns: 1fr !important; }
          .triggers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
            LIVE MONITOR
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Real-Time Trigger Monitor
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span className="pulse" style={{ fontSize: '8px', color: 'var(--success)' }}>●</span>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
              POLLING EVERY 15 MIN · LAST UPDATED {lastUpdated.toLocaleTimeString('en-IN')}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '9px 16px' }}
            onClick={clearSimulation}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Zone selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {ZONES.map(z => (
          <button
            key={z}
            className={`zone-pill ${selectedZone === z ? 'active' : ''}`}
            onClick={() => setSelectedZone(z)}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div style={{
        background: triggeredCount > 0 ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)',
        border: `1px solid ${triggeredCount > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
        borderRadius: '12px', padding: '14px 18px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: '12px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={triggeredCount > 0 ? 'pulse' : ''} style={{
            fontSize: '10px',
            color: triggeredCount > 0 ? 'var(--danger)' : 'var(--success)',
          }}>●</span>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>
            {triggeredCount > 0
              ? `${triggeredCount} trigger${triggeredCount > 1 ? 's' : ''} breached in ${selectedZone}`
              : `All clear — ${selectedZone}`}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
          {TRIGGERS.length - triggeredCount}/{TRIGGERS.length} TRIGGERS BELOW THRESHOLD
        </div>
      </div>

      <div
        className="monitor-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}
      >
        {/* Triggers grid */}
        <div>
          <div
            className="triggers-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}
          >
            {TRIGGERS.map(t => {
              const val = values[t.id]
              const isBreached = t.binary ? val >= t.threshold : val >= t.threshold
              const isWarning = !t.binary && !isBreached && val >= t.threshold * 0.8
              const catColor = CATEGORY_COLORS[t.category]
              const pct = t.binary
                ? (val >= 1 ? 100 : 0)
                : Math.min(100, (val / t.threshold) * 100)

              return (
                <div
                  key={t.id}
                  className={`trigger-card ${isBreached ? 'breached' : isWarning ? 'warning' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>{t.name}</div>
                      <div style={{
                        fontSize: '10px', fontFamily: 'JetBrains Mono',
                        padding: '1px 7px', borderRadius: '99px', display: 'inline-block',
                        background: `${catColor}15`, color: catColor,
                      }}>
                        {t.category.toUpperCase()}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '10px', fontFamily: 'JetBrains Mono', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '99px',
                      background: isBreached ? 'rgba(239,68,68,0.15)' : isWarning ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: isBreached ? 'var(--danger)' : isWarning ? 'var(--accent)' : 'var(--success)',
                    }}>
                      {isBreached ? 'BREACH' : isWarning ? 'WATCH' : 'CLEAR'}
                    </div>
                  </div>

                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '22px', marginBottom: '4px', color: isBreached ? 'var(--danger)' : isWarning ? 'var(--accent)' : 'var(--text)' }}>
                    {t.binary
                      ? t.binaryLabel[val >= 1 ? 1 : 0]
                      : `${typeof val === 'number' ? val.toFixed(t.id === 'aqi' || t.id === 'outage' ? 0 : 1) : val}`}
                    {!t.binary && t.unit !== 'status' && (
                      <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 400 }}> {t.unit}</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: 'var(--surface)', borderRadius: '99px', height: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      width: `${Math.min(pct, 100)}%`,
                      background: isBreached ? 'var(--danger)' : isWarning ? 'var(--accent)' : 'var(--success)',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      Threshold: {t.binary ? t.binaryLabel[1] : `${t.threshold} ${t.unit !== 'status' ? t.unit : ''}`}
                    </div>
                    <button
                      style={{
                        fontSize: '10px', padding: '3px 10px',
                        borderRadius: '6px', border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--muted)',
                        cursor: 'pointer', fontFamily: 'JetBrains Mono',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                      onClick={() => simulateDisruption(t.id)}
                      disabled={simulating}
                    >
                      Simulate
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Event log */}
        <div>
          <div className="monitor-card" style={{ height: '100%', minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
                  EVENT LOG
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>System Activity</div>
              </div>
              {log.length > 0 && (
                <button
                  style={{ fontSize: '11px', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
                  onClick={() => setLog([])}
                >
                  Clear
                </button>
              )}
            </div>

            {log.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: '13px' }}>
                <div style={{ fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>No events yet</div>
                <div style={{ fontSize: '12px' }}>Hit Simulate on any trigger to see the full claim flow</div>
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {log.map((l, i) => (
                  <div key={i} className="log-line">
                    <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{l.time}</span>
                    <span style={{
                      color: l.type === 'success' ? 'var(--success)'
                        : l.type === 'danger' ? 'var(--danger)'
                        : l.type === 'warning' ? 'var(--accent)'
                        : 'var(--text)',
                    }}>
                      {l.msg}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}