import { useState } from 'react'

const PAYOUTS = [
  {
    id: 'PAY-2847',
    claimId: 'CLM-2847',
    trigger: 'Heavy Rainfall',
    date: 'Mar 14, 2026',
    time: '6:19 PM',
    amount: 197,
    upiRef: 'UPI2847BLKT',
    bank: 'SBI ****4521',
    timeToPayout: '7 min',
  },
  {
    id: 'PAY-2801',
    claimId: 'CLM-2801',
    trigger: 'Severe AQI',
    date: 'Mar 09, 2026',
    time: '11:36 AM',
    amount: 164,
    upiRef: 'UPI2801BLKT',
    bank: 'SBI ****4521',
    timeToPayout: '6 min',
  },
  {
    id: 'PAY-2755',
    claimId: 'CLM-2755',
    trigger: 'Bandh / Strike',
    date: 'Mar 02, 2026',
    time: '8:08 AM',
    amount: 197,
    upiRef: 'UPI2755BLKT',
    bank: 'SBI ****4521',
    timeToPayout: '8 min',
  },
  {
    id: 'PAY-2699',
    claimId: 'CLM-2699',
    trigger: 'Extreme Heat',
    date: 'Feb 22, 2026',
    time: '2:14 PM',
    amount: 131,
    upiRef: 'UPI2699BLKT',
    bank: 'SBI ****4521',
    timeToPayout: '6 min',
  },
  {
    id: 'PAY-2644',
    claimId: 'CLM-2644',
    trigger: 'Road Waterlogging',
    date: 'Feb 15, 2026',
    time: '9:22 AM',
    amount: 197,
    upiRef: 'UPI2644BLKT',
    bank: 'SBI ****4521',
    timeToPayout: '7 min',
  },
]

const WEEKLY_DATA = [
  { week: 'Feb 10-16', premium: 89, payout: 0,   net: -89 },
  { week: 'Feb 17-23', premium: 89, payout: 131,  net: 42 },
  { week: 'Feb 24-Mar 2', premium: 89, payout: 197, net: 108 },
  { week: 'Mar 3-9',   premium: 89, payout: 164,  net: 75 },
  { week: 'Mar 10-16', premium: 89, payout: 197,  net: 108 },
  { week: 'Mar 17-23', premium: 89, payout: 0,    net: -89 },
]

export default function Payouts() {
  const [tab, setTab] = useState('history')

  const totalProtected = PAYOUTS.reduce((a, b) => a + b.amount, 0)
  const totalPremiums = WEEKLY_DATA.reduce((a, b) => a + b.premium, 0)
  const netBenefit = totalProtected - totalPremiums
  const maxBar = Math.max(...WEEKLY_DATA.map(w => Math.max(w.premium, w.payout)))

  return (
    <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      <style>{`
        .payout-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .payout-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }
        .payout-row:last-child { border-bottom: none; }
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
        .week-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }
        .week-row:last-child { border-bottom: none; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          PAYOUTS
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Earnings Protected
        </div>
      </div>

      {/* Hero stat */}
      <div style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--success)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '8px' }}>
          TOTAL INCOME PROTECTED BY GIGSHIELD
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '48px', color: 'var(--success)', letterSpacing: '-1px', marginBottom: '4px' }}>
          ₹{totalProtected.toLocaleString()}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
          across {PAYOUTS.length} disruption events · last 6 weeks
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'PREMIUMS PAID', value: `₹${totalPremiums}`, color: 'var(--muted)' },
          { label: 'INCOME SAVED', value: `₹${totalProtected}`, color: 'var(--success)' },
          { label: 'NET BENEFIT', value: `${netBenefit >= 0 ? '+' : ''}₹${netBenefit}`, color: netBenefit >= 0 ? 'var(--success)' : 'var(--danger)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '14px',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '5px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="payout-card">
        <div style={{
          display: 'flex', background: 'var(--surface2)',
          borderRadius: '9px', padding: '4px',
          marginBottom: '20px', gap: '4px',
        }}>
          {['history', 'weekly'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : 'inactive'}`}
              onClick={() => setTab(t)}
            >
              {t === 'history' ? 'Payout History' : 'Weekly Breakdown'}
            </button>
          ))}
        </div>

        {/* Payout history */}
        {tab === 'history' && (
          <div>
            {PAYOUTS.map((p, i) => (
              <div key={i} className="payout-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>
                    {p.trigger}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    {p.date} · {p.time}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
                    {p.upiRef} · {p.bank}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '17px', color: 'var(--success)', marginBottom: '3px' }}>
                    +₹{p.amount}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    in {p.timeToPayout}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weekly breakdown */}
        {tab === 'weekly' && (
          <div>
            {/* Bar chart */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '100px', marginBottom: '8px' }}>
                {WEEKLY_DATA.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: '2px', alignItems: 'flex-end', height: '100%' }}>
                    <div style={{
                      flex: 1,
                      height: `${(w.premium / maxBar) * 100}%`,
                      background: 'rgba(245,158,11,0.4)',
                      borderRadius: '3px 3px 0 0',
                      minHeight: '4px',
                    }} />
                    <div style={{
                      flex: 1,
                      height: `${(w.payout / maxBar) * 100}%`,
                      background: w.payout > 0 ? 'var(--success)' : 'transparent',
                      borderRadius: '3px 3px 0 0',
                      minHeight: w.payout > 0 ? '4px' : '0',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {WEEKLY_DATA.map((w, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                      {w.week.split('-')[0].trim().replace('Feb ', 'F').replace('Mar ', 'M')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                {[
                  { color: 'rgba(245,158,11,0.4)', label: 'Premium paid' },
                  { color: 'var(--success)', label: 'Payout received' },
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly rows */}
            {WEEKLY_DATA.map((w, i) => (
              <div key={i} className="week-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{w.week}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
                    Premium ₹{w.premium} · Payout {w.payout > 0 ? `₹${w.payout}` : '—'}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '14px',
                  color: w.net >= 0 ? 'var(--success)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  {w.net >= 0 ? '+' : ''}₹{w.net}
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '16px',
              padding: '14px',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>6-week net benefit</div>
              <div style={{
                fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px',
                color: netBenefit >= 0 ? 'var(--success)' : 'var(--danger)',
              }}>
                {netBenefit >= 0 ? '+' : ''}₹{netBenefit}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}