import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

const ZONES = [
  { value: 'mumbai-andheri',        label: 'Mumbai — Andheri',          multiplier: 1.2 },
  { value: 'mumbai-dharavi',        label: 'Mumbai — Dharavi',          multiplier: 1.4 },
  { value: 'mumbai-bandra',         label: 'Mumbai — Bandra',           multiplier: 1.2 },
  { value: 'delhi-saket',           label: 'Delhi — Saket',             multiplier: 1.1 },
  { value: 'delhi-dwarka',          label: 'Delhi — Dwarka',            multiplier: 1.1 },
  { value: 'bengaluru-koramangala', label: 'Bengaluru — Koramangala',   multiplier: 1.0 },
  { value: 'bengaluru-whitefield',  label: 'Bengaluru — Whitefield',    multiplier: 1.0 },
  { value: 'hyderabad-madhapur',    label: 'Hyderabad — Madhapur',      multiplier: 0.9 },
  { value: 'hyderabad-hitech',      label: 'Hyderabad — HiTech City',   multiplier: 0.9 },
  { value: 'chennai-adyar',         label: 'Chennai — Adyar',           multiplier: 1.0 },
]

const PLATFORMS = [
  { value: 'zepto',           label: 'Zepto' },
  { value: 'blinkit',         label: 'Blinkit' },
  { value: 'swiggy-instamart',label: 'Swiggy Instamart' },
]

const STEPS = ['Account', 'Work Profile', 'Risk Profile']

function computeRisk(zone, hours) {
  const z = ZONES.find(z => z.value === zone)
  const multiplier = z ? z.multiplier : 1.0
  const hoursScore = hours >= 10 ? 1.3 : hours >= 7 ? 1.0 : 0.8
  const raw = multiplier * hoursScore
  if (raw >= 1.3) return { label: 'High Risk', color: '#EF4444', score: Math.round(raw * 65) }
  if (raw >= 1.0) return { label: 'Moderate Risk', color: '#F59E0B', score: Math.round(raw * 65) }
  return { label: 'Low Risk', color: '#10B981', score: Math.round(raw * 65) }
}

function computePremium(zone, hours, plan) {
  const z = ZONES.find(z => z.value === zone)
  const multiplier = z ? z.multiplier : 1.0
  const base = plan === 'lite' ? 49 : plan === 'standard' ? 89 : 129
  return Math.round(base * multiplier)
}

export default function Register() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [authMethod, setAuthMethod] = useState('google')
  const [phone, setPhone] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)

  const [form, setForm] = useState({
    name: '',
    platform: 'zepto',
    workerId: '',
    zone: 'bengaluru-koramangala',
    hoursPerDay: 8,
    daysPerWeek: 6,
    dailyEarning: 700,
    plan: 'standard',
  })

  const [googleLoading, setGoogleLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(false)

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  const risk = computeRisk(form.zone, form.hoursPerDay)
  const weeklyPremium = computePremium(form.zone, form.hoursPerDay, form.plan)
  const maxDailyPayout = form.plan === 'lite'
    ? Math.round(form.dailyEarning * 0.5)
    : form.plan === 'standard'
    ? Math.round(form.dailyEarning * 0.75)
    : form.dailyEarning

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      setAuthed(true)
      setStep(1)
    } catch {
      setError('Google sign in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  function setupRecaptcha() {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-register', { size: 'invisible' })
      setRecaptchaVerifier(verifier)
      return verifier
    }
    return recaptchaVerifier
  }

  async function handleSendOtp() {
    if (phone.length !== 10) { setError('Enter a valid 10-digit number'); return }
    setError('')
    setPhoneLoading(true)
    try {
      const verifier = setupRecaptcha()
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier)
      setConfirmationResult(result)
      setOtpStep(true)
    } catch {
      setError('Failed to send OTP. Try again.')
    } finally {
      setPhoneLoading(false)
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join('')
    if (code.length !== 6) { setError('Enter complete OTP'); return }
    setError('')
    setPhoneLoading(true)
    try {
      await confirmationResult.confirm(code)
      setAuthed(true)
      setStep(1)
    } catch {
      setError('Invalid OTP. Try again.')
    } finally {
      setPhoneLoading(false)
    }
  }

  function handleOtpChange(val, idx) {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]
    updated[idx] = val
    setOtp(updated)
    if (val && idx < 5) document.getElementById(`rotp-${idx + 1}`)?.focus()
  }

  function handleOtpKey(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`rotp-${idx - 1}`)?.focus()
    }
  }

  function handleFinish() {
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      <style>{`
        .reg-input {
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
          margin-bottom: 16px;
          appearance: none;
        }
        .reg-input:focus { border-color: var(--accent); }
        .reg-input::placeholder { color: var(--muted); }
        .rotp-input {
          width: 44px; height: 52px;
          text-align: center;
          font-size: 20px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text); outline: none;
          transition: border-color 0.15s;
          caret-color: var(--accent);
        }
        .rotp-input:focus { border-color: var(--accent); }
        .plan-option {
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.15s;
          background: var(--surface2);
        }
        .plan-option.selected {
          border-color: var(--accent);
          background: rgba(245,158,11,0.06);
        }
        .auth-tab {
          flex: 1; padding: 9px;
          border: none; border-radius: 7px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: all 0.15s;
        }
        .auth-tab.active { background: var(--accent); color: #000; }
        .auth-tab.inactive { background: transparent; color: var(--muted); }
        .google-btn-reg {
          width: 100%; padding: 11px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: border-color 0.15s;
        }
        .google-btn-reg:hover { border-color: var(--accent); }
        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center;
          justify-content: center;
          font-size: 11px; font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .reg-card { padding: 24px 16px !important; }
          .rotp-input { width: 38px; height: 46px; font-size: 18px; }
        }
      `}</style>

      <div id="recaptcha-register" />

      {/* Top bar */}
      <div style={{
        padding: '0 32px', height: '60px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <span
          style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
        </span>
        <button className="btn btn-secondary" style={{ padding: '7px 16px', fontSize: '13px' }}
          onClick={() => navigate('/login')}>
          Sign In
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Step indicator */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '0', marginBottom: '32px',
          }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="step-dot" style={{
                    background: i < step ? 'var(--success)'
                      : i === step ? 'var(--accent)' : 'var(--surface2)',
                    color: i <= step ? '#000' : 'var(--muted)',
                    border: i > step ? '1px solid var(--border)' : 'none',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                    color: i === step ? 'var(--text)' : 'var(--muted)',
                    fontWeight: i === step ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: '1px',
                    background: i < step ? 'var(--success)' : 'var(--border)',
                    margin: '0 12px',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="reg-card" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '32px',
          }}>

            {/* STEP 0 — Account */}
            {step === 0 && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '6px' }}>
                    Create your account
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55 }}>
                    Sign up to start protecting your weekly income.
                  </div>
                </div>

                {/* Auth method tabs */}
                <div style={{
                  display: 'flex', background: 'var(--surface2)',
                  borderRadius: '9px', padding: '4px',
                  marginBottom: '20px', gap: '4px',
                }}>
                  {['google', 'phone'].map(m => (
                    <button key={m}
                      className={`auth-tab ${authMethod === m ? 'active' : 'inactive'}`}
                      onClick={() => { setAuthMethod(m); setError('') }}
                    >
                      {m === 'google' ? 'Google' : 'Phone OTP'}
                    </button>
                  ))}
                </div>

                {authMethod === 'google' ? (
                  <>
                    <button className="google-btn-reg" onClick={handleGoogle} disabled={googleLoading}>
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                      </svg>
                      {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '12px', textAlign: 'center', lineHeight: 1.5 }}>
                      We'll use your Google account name and email for your GigShield profile.
                    </div>
                  </>
                ) : (
                  <>
                    {!otpStep ? (
                      <>
                        <label className="field-label">Mobile Number</label>
                        <div style={{
                          display: 'flex',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: 'var(--surface2)',
                          marginBottom: '16px',
                          transition: 'border-color 0.15s',
                        }}
                          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{
                            padding: '11px 14px',
                            borderRight: '1px solid var(--border)',
                            color: 'var(--muted)', fontSize: '14px',
                            fontFamily: 'JetBrains Mono',
                            display: 'flex', alignItems: 'center', flexShrink: 0,
                          }}>+91</div>
                          <input
                            type="tel" maxLength={10}
                            placeholder="98765 43210"
                            value={phone}
                            onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                            onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                            style={{
                              flex: 1, background: 'transparent',
                              border: 'none', outline: 'none',
                              padding: '11px 14px', color: 'var(--text)',
                              fontSize: '15px', fontFamily: 'JetBrains Mono',
                            }}
                          />
                        </div>
                        {error && <div style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '8px', fontFamily: 'JetBrains Mono' }}>{error}</div>}
                        <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
                          onClick={handleSendOtp} disabled={phoneLoading}>
                          {phoneLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                          Code sent to <span style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono' }}>+91 {phone}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
                          {otp.map((digit, idx) => (
                            <input key={idx} id={`rotp-${idx}`}
                              type="tel" maxLength={1} value={digit}
                              className="rotp-input"
                              onChange={e => handleOtpChange(e.target.value, idx)}
                              onKeyDown={e => handleOtpKey(e, idx)}
                              autoFocus={idx === 0}
                            />
                          ))}
                        </div>
                        {error && <div style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '8px', fontFamily: 'JetBrains Mono', textAlign: 'center' }}>{error}</div>}
                        <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
                          onClick={handleVerifyOtp} disabled={phoneLoading}>
                          {phoneLoading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
                          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => { setOtpStep(false); setOtp(['','','','','','']); setError('') }}>
                            Change number
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
                  Already have an account?{' '}
                  <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => navigate('/login')}>
                    Sign in
                  </span>
                </div>
              </>
            )}

            {/* STEP 1 — Work Profile */}
            {step === 1 && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '6px' }}>
                    Your work profile
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55 }}>
                    This helps us calculate your accurate premium and coverage.
                  </div>
                </div>

                <label className="field-label">Full Name</label>
                <input className="reg-input" placeholder="Ravi Kumar"
                  value={form.name}
                  onChange={e => update('name', e.target.value)} />

                <label className="field-label">Platform</label>
                <select className="reg-input" value={form.platform}
                  onChange={e => update('platform', e.target.value)}>
                  {PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>

                <label className="field-label">Worker / Partner ID</label>
                <input className="reg-input" placeholder="BLK-2024-XXXXXX"
                  value={form.workerId}
                  onChange={e => update('workerId', e.target.value)} />

                <label className="field-label">Home Zone</label>
                <select className="reg-input" value={form.zone}
                  onChange={e => update('zone', e.target.value)}>
                  {ZONES.map(z => (
                    <option key={z.value} value={z.value}>{z.label}</option>
                  ))}
                </select>

                <label className="field-label">Average Daily Earnings (₹)</label>
                <input className="reg-input" type="number" placeholder="700"
                  value={form.dailyEarning}
                  onChange={e => update('dailyEarning', Number(e.target.value))} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="field-label">Hours / Day</label>
                    <select className="reg-input" value={form.hoursPerDay}
                      onChange={e => update('hoursPerDay', Number(e.target.value))}>
                      {[4,5,6,7,8,9,10,11,12].map(h => (
                        <option key={h} value={h}>{h} hrs</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Days / Week</label>
                    <select className="reg-input" value={form.daysPerWeek}
                      onChange={e => update('daysPerWeek', Number(e.target.value))}>
                      {[4,5,6,7].map(d => (
                        <option key={d} value={d}>{d} days</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}
                  onClick={() => {
                    if (!form.name) { setError('Please enter your name'); return }
                    setError('')
                    setStep(2)
                  }}>
                  Continue
                </button>
                {error && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>{error}</div>}
              </>
            )}

            {/* STEP 2 — Risk Profile */}
            {step === 2 && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '6px' }}>
                    Your risk profile
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55 }}>
                    AI-computed based on your zone and work pattern. Choose your plan.
                  </div>
                </div>

                {/* Risk score card */}
                <div style={{
                  background: 'var(--surface2)',
                  border: `1px solid ${risk.color}33`,
                  borderRadius: '12px', padding: '20px',
                  marginBottom: '24px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', marginBottom: '6px', letterSpacing: '1px' }}>
                      ZONE RISK ASSESSMENT
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: risk.color, marginBottom: '4px' }}>
                      {risk.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {ZONES.find(z => z.value === form.zone)?.label}
                    </div>
                  </div>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    border: `3px solid ${risk.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: risk.color }}>
                      {risk.score}
                    </span>
                  </div>
                </div>

                {/* Plan selection */}
                <label className="field-label" style={{ marginBottom: '10px' }}>Choose Your Plan</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { value: 'lite',     label: 'Lite',     coverage: '50%', base: 49 },
                    { value: 'standard', label: 'Standard', coverage: '75%', base: 89, recommended: true },
                    { value: 'premium',  label: 'Premium',  coverage: '100%', base: 129 },
                  ].map(p => {
                    const price = computePremium(form.zone, form.hoursPerDay, p.value)
                    const payout = p.value === 'lite'
                      ? Math.round(form.dailyEarning * 0.5)
                      : p.value === 'standard'
                      ? Math.round(form.dailyEarning * 0.75)
                      : form.dailyEarning
                    return (
                      <div key={p.value}
                        className={`plan-option ${form.plan === p.value ? 'selected' : ''}`}
                        onClick={() => update('plan', p.value)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '16px', height: '16px', borderRadius: '50%',
                              border: `2px solid ${form.plan === p.value ? 'var(--accent)' : 'var(--border)'}`,
                              background: form.plan === p.value ? 'var(--accent)' : 'transparent',
                              flexShrink: 0,
                            }} />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px' }}>{p.label}</span>
                                {p.recommended && (
                                  <span style={{
                                    fontSize: '10px', background: 'rgba(245,158,11,0.15)',
                                    color: 'var(--accent)', padding: '2px 8px',
                                    borderRadius: '99px', fontFamily: 'JetBrains Mono',
                                    fontWeight: 700,
                                  }}>
                                    RECOMMENDED
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                {p.coverage} coverage · up to ₹{payout}/day
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                              fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px',
                              color: form.plan === p.value ? 'var(--accent)' : 'var(--text)',
                            }}>
                              ₹{price}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>/week</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Summary */}
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '16px',
                  marginBottom: '20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}>
                  {[
                    { label: 'WEEKLY PREMIUM', value: `₹${weeklyPremium}` },
                    { label: 'MAX DAILY PAYOUT', value: `₹${maxDailyPayout}` },
                    { label: 'COVERAGE', value: form.plan === 'lite' ? '50%' : form.plan === 'standard' ? '75%' : '100%' },
                    { label: 'PAYOUT TIME', value: '< 8 min' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.8px', marginBottom: '3px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '16px', color: 'var(--accent)' }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
  onClick={handleFinish}>
  Complete Setup
</button>

<div style={{ marginTop: '10px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)' }}>
  You can activate your first week's coverage from your dashboard.
</div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}