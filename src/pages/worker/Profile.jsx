import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ZONES = [
  { value: 'mumbai-andheri',        label: 'Mumbai — Andheri' },
  { value: 'mumbai-dharavi',        label: 'Mumbai — Dharavi' },
  { value: 'mumbai-bandra',         label: 'Mumbai — Bandra' },
  { value: 'delhi-saket',           label: 'Delhi — Saket' },
  { value: 'delhi-dwarka',          label: 'Delhi — Dwarka' },
  { value: 'bengaluru-koramangala', label: 'Bengaluru — Koramangala' },
  { value: 'bengaluru-whitefield',  label: 'Bengaluru — Whitefield' },
  { value: 'hyderabad-madhapur',    label: 'Hyderabad — Madhapur' },
  { value: 'hyderabad-hitech',      label: 'Hyderabad — HiTech City' },
  { value: 'chennai-adyar',         label: 'Chennai — Adyar' },
]

const PLATFORMS = [
  { value: 'zepto',            label: 'Zepto' },
  { value: 'blinkit',          label: 'Blinkit' },
  { value: 'swiggy-instamart', label: 'Swiggy Instamart' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: 'Ravi Kumar',
    phone: '9876543210',
    platform: 'blinkit',
    workerId: 'BLK-2024-004821',
    zone: 'mumbai-andheri',
    hoursPerDay: 8,
    daysPerWeek: 6,
    dailyEarning: 700,
  })

  const [draft, setDraft] = useState({ ...form })

  function update(key, val) {
    setDraft(d => ({ ...d, [key]: val }))
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setForm({ ...draft })
      setSaving(false)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1200)
  }

  function handleCancel() {
    setDraft({ ...form })
    setEditing(false)
  }

  async function handleSignOut() {
    await logout()
    navigate('/')
  }

  const zonelabel = ZONES.find(z => z.value === form.zone)?.label
  const platformLabel = PLATFORMS.find(p => p.value === form.platform)?.label

  return (
    <div style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      <style>{`
        .profile-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .tab-btn {
          flex: 1; padding: 9px;
          border: none; border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: all 0.15s;
        }
        .tab-btn.active  { background: var(--accent); color: #000; }
        .tab-btn.inactive { background: transparent; color: var(--muted); }
        .profile-field {
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .profile-field:last-child { border-bottom: none; }
        .edit-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          margin-bottom: 14px;
          appearance: none;
        }
        .edit-input:focus { border-color: var(--accent); }
        .edit-input::placeholder { color: var(--muted); }
        .notif-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .notif-row:last-child { border-bottom: none; }
        .toggle {
          width: 40px; height: 22px;
          border-radius: 99px;
          border: none; cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: white;
          transition: left 0.2s;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '4px' }}>
          ACCOUNT
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          My Profile
        </div>
      </div>

      {/* Avatar card */}
      <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(245,158,11,0.15)',
          border: '2px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', fontWeight: 700, color: 'var(--accent)',
          flexShrink: 0, fontFamily: 'JetBrains Mono',
        }}>
          {form.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '3px' }}>{form.name}</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            {platformLabel} · {zonelabel}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginTop: '2px' }}>
            {form.workerId}
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '99px', padding: '5px 12px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '8px', color: 'var(--success)' }} className="pulse">●</span>
          <span style={{ fontSize: '11px', color: 'var(--success)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
            ACTIVE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px', padding: '4px',
        marginBottom: '16px', gap: '4px',
      }}>
        {['profile', 'notifications', 'security'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : 'inactive'}`}
            onClick={() => { setTab(t); setEditing(false) }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <>
          {!editing ? (
            <div className="profile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px' }}>
                  WORK PROFILE
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                  onClick={() => { setDraft({ ...form }); setEditing(true) }}
                >
                  Edit
                </button>
              </div>

              {[
                { label: 'Full Name',       value: form.name },
                { label: 'Mobile Number',   value: `+91 ${form.phone}` },
                { label: 'Platform',        value: platformLabel },
                { label: 'Worker ID',       value: form.workerId },
                { label: 'Home Zone',       value: zonelabel },
                { label: 'Daily Earnings',  value: `₹${form.dailyEarning}` },
                { label: 'Hours / Day',     value: `${form.hoursPerDay} hrs` },
                { label: 'Days / Week',     value: `${form.daysPerWeek} days` },
              ].map((f, i) => (
                <div key={i} className="profile-field">
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{f.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, fontFamily: f.label === 'Worker ID' || f.label === 'Mobile Number' ? 'JetBrains Mono' : 'DM Sans', textAlign: 'right' }}>
                    {f.value}
                  </div>
                </div>
              ))}

              {saved && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--success)', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ✓ Profile updated successfully
                </div>
              )}
            </div>
          ) : (
            <div className="profile-card">
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '16px' }}>
                EDIT PROFILE
              </div>

              <label className="field-label">Full Name</label>
              <input className="edit-input" value={draft.name}
                onChange={e => update('name', e.target.value)} />

              <label className="field-label">Platform</label>
              <select className="edit-input" value={draft.platform}
                onChange={e => update('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>

              <label className="field-label">Worker / Partner ID</label>
              <input className="edit-input" value={draft.workerId}
                onChange={e => update('workerId', e.target.value)} />

              <label className="field-label">Home Zone</label>
              <select className="edit-input" value={draft.zone}
                onChange={e => update('zone', e.target.value)}>
                {ZONES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
              </select>

              <label className="field-label">Average Daily Earnings (₹)</label>
              <input className="edit-input" type="number" value={draft.dailyEarning}
                onChange={e => update('dailyEarning', Number(e.target.value))} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="field-label">Hours / Day</label>
                  <select className="edit-input" value={draft.hoursPerDay}
                    onChange={e => update('hoursPerDay', Number(e.target.value))}>
                    {[4,5,6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{h} hrs</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Days / Week</label>
                  <select className="edit-input" value={draft.daysPerWeek}
                    onChange={e => update('daysPerWeek', Number(e.target.value))}>
                    {[4,5,6,7].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '11px' }}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '11px' }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Notifications tab */}
      {tab === 'notifications' && (
        <NotificationsTab />
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="profile-card">
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '16px' }}>
            SECURITY
          </div>

          {[
            { label: 'Linked Account', sub: 'Google — ravi.kumar@gmail.com', action: null },
            { label: 'Phone Number', sub: `+91 ${form.phone} · Verified`, action: null },
            { label: 'UPI Account', sub: 'SBI ****4521 · Linked', action: 'Change' },
          ].map((item, i) => (
            <div key={i} className="profile-field">
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{item.sub}</div>
              </div>
              {item.action && (
                <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '12px', flexShrink: 0 }}>
                  {item.action}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sign out */}
      <div className="profile-card" style={{ marginBottom: '8px' }}>
        <button
          className="btn btn-danger"
          style={{ width: '100%', padding: '12px' }}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

    </div>
  )
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    claimInitiated: true,
    claimApproved: true,
    payoutSent: true,
    weeklyForecast: true,
    policyReminder: true,
    fraudAlert: true,
    whatsapp: true,
  })

  function toggle(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  const items = [
    { key: 'claimInitiated', label: 'Claim initiated',     sub: 'When a disruption triggers your claim' },
    { key: 'claimApproved',  label: 'Claim approved',      sub: 'When fraud check passes and claim is approved' },
    { key: 'payoutSent',     label: 'Payout sent',         sub: 'When UPI transfer is initiated' },
    { key: 'weeklyForecast', label: 'Monday forecast',     sub: 'Weekly disruption risk preview every Monday' },
    { key: 'policyReminder', label: 'Policy renewal',      sub: 'Reminder to activate next week\'s coverage' },
    { key: 'fraudAlert',     label: 'Fraud alert',         sub: 'If your claim is flagged for review' },
    { key: 'whatsapp',       label: 'WhatsApp notifications', sub: 'Receive all alerts on WhatsApp too' },
  ]

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono', letterSpacing: '1px', marginBottom: '16px' }}>
        NOTIFICATION PREFERENCES
      </div>

      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          gap: '16px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.sub}</div>
          </div>
          <button
            className="toggle"
            style={{ background: settings[item.key] ? 'var(--accent)' : 'var(--surface2)', border: `1px solid ${settings[item.key] ? 'var(--accent)' : 'var(--border)'}` }}
            onClick={() => toggle(item.key)}
          >
            <div
              className="toggle-thumb"
              style={{ left: settings[item.key] ? '21px' : '3px' }}
            />
          </button>
        </div>
      ))}
    </div>
  )
}