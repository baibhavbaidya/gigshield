import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [role, setRole] = useState('worker')
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [googleLoading, setGoogleLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const recaptchaRef = useRef(null)

  useEffect(() => {
    if (user) {
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, role, navigate])

  function setupRecaptcha() {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    return recaptchaRef.current
  }

async function handleGoogleSignIn() {
  setError('')
  setGoogleLoading(true)
  try {
    await signInWithPopup(auth, googleProvider)
    navigate(role === 'admin' ? '/admin' : '/dashboard')
  } catch (err) {
    setError('Google sign in failed. Please try again.')
  } finally {
    setGoogleLoading(false)
  }
}

async function handlePhoneSubmit() {
  if (phone.length !== 10) {
    setError('Enter a valid 10-digit mobile number')
    return
  }
  setError('')
  setPhoneLoading(true)
  try {
    const appVerifier = setupRecaptcha()
    const result = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier)
    setConfirmationResult(result)
    setStep('otp')
  } catch (err) {
    setError('Failed to send OTP. Please try again.')
    recaptchaRef.current = null
  } finally {
    setPhoneLoading(false)
  }
}
async function handleOtpSubmit() {
  const code = otp.join('')
  if (code.length !== 6) {
    setError('Enter the complete 6-digit OTP')
    return
  }
  setError('')
  setPhoneLoading(true)
  try {
    await confirmationResult.confirm(code)
    navigate(role === 'admin' ? '/admin' : '/dashboard')
  } catch (err) {
    setError('Invalid OTP. Please try again.')
  } finally {
    setPhoneLoading(false)
  }
}

  function handleOtpChange(val, idx) {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]
    updated[idx] = val
    setOtp(updated)
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  function handleOtpKeyDown(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  function handleRoleSwitch(newRole) {
    setRole(newRole)
    setStep('phone')
    setError('')
    setPhone('')
    setOtp(['', '', '', '', '', ''])
    setConfirmationResult(null)
    recaptchaRef.current = null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      <style>{`
        .otp-input {
          width: 48px;
          height: 56px;
          text-align: center;
          font-size: 22px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          outline: none;
          transition: border-color 0.15s;
          caret-color: var(--accent);
        }
        .otp-input:focus {
          border-color: var(--accent);
        }
        .role-tab {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.15s;
        }
        .role-tab.active {
          background: var(--accent);
          color: #000;
        }
        .role-tab.inactive {
          background: transparent;
          color: var(--muted);
        }
        .google-btn {
          width: 100%;
          padding: 11px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: border-color 0.15s, background 0.15s;
        }
        .google-btn:hover {
          border-color: var(--accent);
          background: var(--surface);
        }
        .divider-line {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: var(--muted);
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
        }
        .divider-line::before,
        .divider-line::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .phone-wrap {
          display: flex;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--surface2);
          transition: border-color 0.15s;
        }
        .phone-wrap:focus-within {
          border-color: var(--accent);
        }
        @media (max-width: 480px) {
          .otp-input {
            width: 40px;
            height: 48px;
            font-size: 18px;
          }
          .login-card {
            padding: 28px 20px;
          }
        }
      `}</style>

      {/* Invisible recaptcha container */}
      <div id="recaptcha-container" />

      {/* Top bar */}
      <div style={{
        padding: '0 32px',
        height: '60px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span
          style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
        </span>
        <button
          className="btn btn-secondary"
          style={{ padding: '7px 16px', fontSize: '13px' }}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>

      {/* Center */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}>
        <div
          className="login-card"
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px 32px',
          }}
        >

          {/* Role switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--surface2)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px',
            gap: '4px',
          }}>
            {['worker', 'admin'].map(r => (
              <button
                key={r}
                className={`role-tab ${role === r ? 'active' : 'inactive'}`}
                onClick={() => handleRoleSwitch(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {step === 'phone' ? (
            <>
              {/* Heading */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '22px', fontWeight: 700,
                  letterSpacing: '-0.3px', marginBottom: '6px',
                }}>
                  {role === 'worker' ? 'Welcome back' : 'Admin sign in'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55 }}>
                  {role === 'worker'
                    ? 'Sign in to access your coverage, claims, and payouts.'
                    : 'Sign in to access the insurer dashboard and fraud queue.'}
                </div>
              </div>

              {/* Google */}
              <button
  className="google-btn"
  onClick={handleGoogleSignIn}
  disabled={googleLoading}
>
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
  {googleLoading ? 'Signing in...' : 'Continue with Google'}
</button>

              <div className="divider-line">OR</div>

              {/* Phone */}
              <label className="field-label">Mobile Number</label>
              <div className="phone-wrap" style={{ marginBottom: '8px' }}>
                <div style={{
                  padding: '11px 14px',
                  borderRight: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontSize: '14px',
                  fontFamily: 'JetBrains Mono',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value.replace(/\D/g, ''))
                    setError('')
                  }}
                  onKeyDown={e => e.key === 'Enter' && handlePhoneSubmit()}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '11px 14px',
                    color: 'var(--text)',
                    fontSize: '15px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  fontSize: '12px', color: 'var(--danger)',
                  marginBottom: '4px', fontFamily: 'JetBrains Mono',
                }}>
                  {error}
                </div>
              )}

              <button
  className="btn btn-primary"
  style={{ width: '100%', marginTop: '16px', padding: '12px' }}
  onClick={handlePhoneSubmit}
  disabled={phoneLoading}
>
  {phoneLoading ? 'Sending OTP...' : 'Send OTP'}
</button>

              <div style={{
                marginTop: '24px', textAlign: 'center',
                fontSize: '13px', color: 'var(--muted)',
              }}>
                New to GigShield?{' '}
                <span
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => navigate('/register')}
                >
                  Register here
                </span>
              </div>
            </>
          ) : (
            <>
              {/* OTP step */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  fontSize: '22px', fontWeight: 700,
                  letterSpacing: '-0.3px', marginBottom: '6px',
                }}>
                  Enter OTP
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.55 }}>
                  A 6-digit code was sent to{' '}
                  <span style={{ color: 'var(--text)', fontFamily: 'JetBrains Mono' }}>
                    +91 {phone}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex', gap: '8px',
                justifyContent: 'center', marginBottom: '8px',
              }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    className="otp-input"
                    onChange={e => handleOtpChange(e.target.value, idx)}
                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {error && (
                <div style={{
                  fontSize: '12px', color: 'var(--danger)',
                  marginTop: '8px', fontFamily: 'JetBrains Mono',
                  textAlign: 'center',
                }}>
                  {error}
                </div>
              )}

              <button
  className="btn btn-primary"
  style={{ width: '100%', marginTop: '24px', padding: '12px' }}
  onClick={handleOtpSubmit}
  disabled={phoneLoading}
>
  {phoneLoading ? 'Verifying...' : 'Verify & Sign In'}
</button>

              <div style={{
                marginTop: '16px', textAlign: 'center',
                fontSize: '13px', color: 'var(--muted)',
              }}>
                Wrong number?{' '}
                <span
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => {
                    setStep('phone')
                    setOtp(['', '', '', '', '', ''])
                    setError('')
                    recaptchaRef.current = null
                  }}
                >
                  Change
                </span>
                {' · '}
                <span
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => {
                    setOtp(['', '', '', '', '', ''])
                    setError('')
                    handlePhoneSubmit()
                  }}
                >
                  Resend OTP
                </span>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  )
}