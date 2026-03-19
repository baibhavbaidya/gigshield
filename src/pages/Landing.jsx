import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '8M+',    label: 'Unprotected Workers' },
  { value: '₹3,200', label: 'Avg Monthly Loss' },
  { value: '<8 min', label: 'Claim to Payout' },
  { value: '₹49',    label: 'Starting Per Week' },
]

const features = [
  {
    title: 'Parametric Triggers',
    desc: '9 disruption types monitored in real time across environmental, social, and platform categories. Claims fire automatically — no worker action needed.',
  },
  {
    title: 'AI Risk Engine',
    desc: 'XGBoost model computes your zone risk multiplier from historical IMD and CPCB data. Your premium reflects your actual exposure, not a flat rate.',
  },
  {
    title: 'Fraud Detection',
    desc: 'Isolation Forest model scores every claim across 5 signal layers — GPS behaviour, platform activity, device fingerprinting, ring detection, and ground truth.',
  },
  {
    title: 'Instant UPI Payout',
    desc: 'Approved claims trigger a Razorpay UPI transfer in under 8 minutes. No forms, no calls, no waiting. Lost income lands back in your account.',
  },
  {
    title: 'Monday Forecast',
    desc: 'Every Monday, AI predicts disruption probability for your zone over the next 7 days. Choose your coverage tier based on the week ahead.',
  },
  {
    title: 'Surge Shield',
    desc: 'Clean claim history earns progressive premium discounts — up to 15% off after 12 consecutive weeks. Lower risk, lower cost, automatically.',
  },
]

const triggers = [
  {
    category: 'Environmental',
    items: ['Heavy Rainfall > 65mm/hr', 'Extreme Heat > 43°C', 'Severe AQI > 300', 'Road Waterlogging'],
  },
  {
    category: 'Social',
    items: ['Bandh / Strike', 'Section 144 / Curfew', 'Festival Zone Closure'],
  },
  {
    category: 'Platform',
    items: ['Darkstore Closure', 'App Outage > 45 min'],
  },
]

const plans = [
  { name: 'Lite',     price: '49',  coverage: '50%', payout: '175' },
  { name: 'Standard', price: '89',  coverage: '75%', payout: '262', recommended: true },
  { name: 'Premium',  price: '129', coverage: '100%', payout: '350' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Pay your weekly premium',
    desc: 'Every Monday, choose your coverage tier based on the AI-generated risk forecast for your zone. Pay ₹49–₹129 via UPI. Policy activates instantly.',
  },
  {
    step: '02',
    title: 'GigShield monitors in real time',
    desc: 'Our backend polls weather, AQI, platform status, and civic advisory APIs every 15 minutes across your zone throughout the week.',
  },
  {
    step: '03',
    title: 'Disruption detected automatically',
    desc: 'The moment a threshold is crossed — rainfall, AQI spike, bandh, curfew, darkstore closure — your claim is initiated without you doing anything.',
  },
  {
    step: '04',
    title: 'Fraud check runs in background',
    desc: 'Our Isolation Forest model scores your claim across 5 signal layers in under 2 minutes. Clean claims are auto-approved instantly.',
  },
  {
    step: '05',
    title: 'Lost income hits your UPI',
    desc: 'Razorpay initiates the transfer. A WhatsApp message confirms the amount. Total time from trigger to payout: under 8 minutes.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>

      <style>{`
        .landing-hero-title {
          font-size: clamp(32px, 6vw, 58px);
        }
        .landing-section {
          padding: 80px 32px;
        }
        .landing-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .landing-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .landing-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 32px;
        }
        .nav-buttons {
          display: flex;
          gap: 10px;
        }
        .hero-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-links {
          display: flex;
          gap: 20px;
        }
        .plan-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px 24px;
          position: relative;
        }
        .plan-card.recommended {
          background: rgba(245,158,11,0.06);
          border-color: rgba(245,158,11,0.4);
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: rgba(245,158,11,0.3);
        }
        @media (max-width: 600px) {
          .landing-section { padding: 56px 20px; }
          .landing-hero { padding: 72px 20px 56px; }
          .landing-nav { padding: 0 20px; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
          .footer-links { flex-wrap: wrap; }
          .hero-buttons .btn { width: 100%; justify-content: center; }
          .hero-buttons { flex-direction: column; align-items: stretch; max-width: 320px; margin: 0 auto; }
        }
      `}</style>

      {/* NAV */}
      <nav className="landing-nav" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(12,12,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 32px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.3px' }}>
          Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
        </span>
        <div className="nav-buttons">
          <button className="btn btn-secondary" style={{ padding: '8px 18px' }}
            onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn btn-primary" style={{ padding: '8px 18px' }}
            onClick={() => navigate('/register')}>
            Get Protected
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero" style={{
        padding: '100px 32px 80px',
        maxWidth: '740px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '99px', padding: '5px 14px',
          fontSize: '11px', color: 'var(--accent)',
          fontFamily: 'JetBrains Mono',
          marginBottom: '32px',
          background: 'rgba(245,158,11,0.05)',
          letterSpacing: '0.5px',
        }}>
          <span className="pulse" style={{ fontSize: '8px' }}>●</span>
          Q-COMMERCE · ZEPTO · BLINKIT · SWIGGY INSTAMART
        </div>

        <h1 className="landing-hero-title" style={{
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-1.5px',
          marginBottom: '24px',
        }}>
          When disruptions stop you,<br />
          <span style={{ color: 'var(--accent)' }}>your income keeps moving.</span>
        </h1>

        <p style={{
          fontSize: '17px', color: 'var(--muted)', lineHeight: 1.7,
          maxWidth: '520px', margin: '0 auto 40px',
        }}>
          GigShield protects Q-Commerce delivery workers from income loss caused
          by weather, pollution, civic disruptions, and platform outages —
          automatically detecting events and paying out in under 8 minutes.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '15px' }}
            onClick={() => navigate('/register')}>
            Start Protection — ₹49/week
          </button>
          <button className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: '15px' }}
            onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 32px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="landing-stats" style={{ textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i} className="fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{
                  fontSize: '34px', fontWeight: 700,
                  color: 'var(--accent)', letterSpacing: '-1px',
                  fontFamily: 'JetBrains Mono',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '11px', color: 'var(--muted)', marginTop: '4px',
                  fontFamily: 'JetBrains Mono', letterSpacing: '0.5px',
                }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', color: 'var(--accent)',
            fontFamily: 'JetBrains Mono', letterSpacing: '2px', marginBottom: '10px',
          }}>
            HOW IT WORKS
          </div>
          <div className="section-title" style={{ fontSize: '28px' }}>
            Zero-touch income protection
          </div>
          <div className="section-subtitle">
            From disruption detected to money in your account — fully automated.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {howItWorks.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px',
              padding: '28px 0',
              borderBottom: i < howItWorks.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono', fontSize: '12px',
                color: 'var(--accent)', fontWeight: 600,
                minWidth: '28px', paddingTop: '2px', flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>
                  {item.title}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.65 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRIGGERS */}
      <section className="landing-section" style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', color: 'var(--accent)',
              fontFamily: 'JetBrains Mono', letterSpacing: '2px', marginBottom: '10px',
            }}>
              COVERAGE
            </div>
            <div className="section-title" style={{ fontSize: '28px' }}>
              9 disruption triggers across 3 categories
            </div>
            <div className="section-subtitle">
              Built specifically for Q-Commerce. Platform outages and darkstore closures covered — no other product does this.
            </div>
          </div>

          <div className="landing-grid-2">
            {triggers.map((t, i) => (
              <div key={i} className="card card-glow">
                <div style={{
                  fontSize: '11px', color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono', letterSpacing: '1.5px',
                  marginBottom: '16px', fontWeight: 600,
                }}>
                  {t.category.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {t.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        background: 'var(--accent)', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', color: 'var(--accent)',
            fontFamily: 'JetBrains Mono', letterSpacing: '2px', marginBottom: '10px',
          }}>
            PLATFORM
          </div>
          <div className="section-title" style={{ fontSize: '28px' }}>
            Built on real AI, not rules
          </div>
        </div>

        <div className="landing-grid-2">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="landing-section" style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{
              fontSize: '11px', color: 'var(--accent)',
              fontFamily: 'JetBrains Mono', letterSpacing: '2px', marginBottom: '10px',
            }}>
              PRICING
            </div>
            <div className="section-title" style={{ fontSize: '28px' }}>
              Weekly. Simple. Fair.
            </div>
            <div className="section-subtitle">
              Aligned with how gig workers actually get paid. Cancel any week.
            </div>
          </div>

          <div className="landing-grid-3">
            {plans.map((p, i) => (
              <div key={i} className={`plan-card ${p.recommended ? 'recommended' : ''}`}>
                {p.recommended && (
                  <div style={{
                    position: 'absolute', top: '-12px',
                    left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent)', color: '#000',
                    fontSize: '10px', fontWeight: 700,
                    padding: '3px 12px', borderRadius: '99px',
                    fontFamily: 'JetBrains Mono', whiteSpace: 'nowrap',
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{
                  fontSize: '12px', color: 'var(--muted)',
                  fontFamily: 'JetBrains Mono', marginBottom: '12px', letterSpacing: '1px',
                }}>
                  {p.name.toUpperCase()}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'baseline',
                  gap: '4px', marginBottom: '20px',
                }}>
                  <span style={{
                    fontSize: '38px', fontWeight: 700,
                    fontFamily: 'JetBrains Mono',
                    color: p.recommended ? 'var(--accent)' : 'var(--text)',
                  }}>
                    ₹{p.price}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>/week</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {[
                    `${p.coverage} income coverage`,
                    `Up to ₹${p.payout}/day payout`,
                    'Auto claim initiation',
                    'UPI payout < 8 minutes',
                    'WhatsApp notifications',
                  ].map((item, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center',
                      gap: '8px', fontSize: '13px', color: 'var(--muted)',
                    }}>
                      <span style={{ color: 'var(--success)', fontSize: '12px', flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${p.recommended ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{
        padding: '80px 32px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          fontWeight: 700, letterSpacing: '-0.8px',
          marginBottom: '16px', lineHeight: 1.2,
        }}>
          Extreme heat. Flash floods. Sudden curfews.<br />
          <span style={{ color: 'var(--accent)' }}>None of it should cost you a day's earnings.</span>
        </div>
        <div style={{
          color: 'var(--muted)', fontSize: '15px',
          marginBottom: '32px', lineHeight: 1.6,
        }}>
          GigShield covers what no insurance product in India covers —
          the full spectrum of disruptions that stop Q-Commerce workers from earning.
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: '14px 32px', fontSize: '16px' }}
          onClick={() => navigate('/register')}
        >
          Get Protected Today
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 32px',
      }}>
        <div className="footer-inner">
          <span style={{ fontWeight: 700, fontSize: '16px' }}>
            Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
          </span>
          <span style={{
            fontSize: '11px', color: 'var(--muted)',
            fontFamily: 'JetBrains Mono', letterSpacing: '0.5px',
          }}>
            TEAM SMOOTH OPERATORS · GUIDEWIRE DEVTRAILS 2026
          </span>
          <div className="footer-links">
            <span
              style={{ fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Worker Login
            </span>
            <span
              style={{ fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}
              onClick={() => navigate('/admin')}
            >
              Admin Portal
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}