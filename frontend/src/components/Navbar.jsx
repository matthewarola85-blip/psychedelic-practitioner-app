import { useNavigate, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/dashboard')}>
        <span style={styles.logo}>⬡</span>
        <span style={styles.title}>Vessel</span>
      </div>
      <div style={styles.links}>
        <button
          style={isActive('/dashboard') ? styles.linkActive : styles.link}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button
          style={isActive('/clients') ? styles.linkActive : styles.link}
          onClick={() => navigate('/clients')}
        >
          Clients
        </button>
      </div>
      <div style={styles.userSection}>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#0a0a0f',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logo: {
    fontSize: '22px',
    color: '#8b5cf6',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  linkActive: {
    background: 'rgba(139,92,246,0.15)',
    border: 'none',
    color: '#a78bfa',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
}