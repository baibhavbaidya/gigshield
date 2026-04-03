import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/admin',            label: 'Overview' },
  { to: '/admin/monitor',    label: 'Live Monitor' },
  { to: '/admin/claims',     label: 'Claims' },
  { to: '/admin/analytics',  label: 'Analytics' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()


  async function handleSignOut() {
    await logout()
    navigate('/')
  }
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
            Gig<span style={{ color: 'var(--accent)' }}>Shield</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>
            ADMIN PORTAL
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'}
              style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
              {({ isActive }) => (
                <div style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}>
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 10px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}
  onClick={handleSignOut}>
  Sign Out
</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}