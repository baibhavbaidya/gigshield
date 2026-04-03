import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
export default function WorkerLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleSignOut() {
    await logout()
    navigate('/')
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top bar */}
      <header style={{
        padding: '0 20px',
        height: '56px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
          Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
        </span>
        <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}
  onClick={handleSignOut}>
  Sign Out
</button>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '64px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        zIndex: 50,
      }}>
        {[
          { to: '/dashboard', label: 'Home',    icon: '⊞' },
          { to: '/policy',    label: 'Policy',  icon: '◈' },
          { to: '/claims',    label: 'Claims',  icon: '◎' },
          { to: '/payouts',   label: 'Payouts', icon: '◉' },
          { to: '/profile',   label: 'Profile', icon: '◯' },
        ].map(item => (
          <NavLink key={item.to} to={item.to} style={{ flex: 1 }}>
            {({ isActive }) => (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}