import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Dashboard() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/clients`)
      .then(res => setClients(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const isMobile = window.innerWidth <= 768

  return (
    <div style={{ ...styles.container, padding: isMobile ? '20px' : '40px' }}>
      <div style={styles.header}>
        <div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '22px' : '28px' }}>
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p style={styles.subtitle}>Your practice at a glance</p>
        </div>
        <button style={styles.newClientBtn} onClick={() => navigate('/clients/new')}>
          + New Client
        </button>
      </div>

      {/* Stats */}
      <div style={{
        ...styles.statsGrid,
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
      }}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{clients.length}</div>
          <div style={styles.statLabel}>Active Clients</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>—</div>
          <div style={styles.statLabel}>Reports Generated</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>—</div>
          <div style={styles.statLabel}>Sessions This Month</div>
        </div>
      </div>

      {/* Recent Clients */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Clients</h2>
          <button style={styles.viewAll} onClick={() => navigate('/clients')}>
            View all →
          </button>
        </div>

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : clients.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No clients yet.</p>
            <button style={styles.emptyBtn} onClick={() => navigate('/clients/new')}>
              Add your first client
            </button>
          </div>
        ) : (
          <div style={styles.clientList}>
            {clients.slice(0, 5).map(client => (
              <div
                key={client.id}
                style={styles.clientCard}
                onClick={() => navigate(`/clients/${client.id}/treatment`)}
              >
                <div style={styles.clientAvatar}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.clientInfo}>
                  <div style={styles.clientName}>{client.name}</div>
                  <div style={styles.clientGoal}>{client.treatment_goal || 'No goal set'}</div>
                </div>
                <div style={styles.clientArrow}>→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e8e6f0',
    padding: '40px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '36px',
    gap: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
  },
  newClientBtn: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: '6px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  },
  viewAll: {
    background: 'transparent',
    border: 'none',
    color: '#8b5cf6',
    cursor: 'pointer',
    fontSize: '14px',
  },
  empty: {
    color: '#6b7280',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '15px',
    marginBottom: '16px',
  },
  emptyBtn: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  clientList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  clientCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  clientAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(139,92,246,0.2)',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    flexShrink: 0,
  },
  clientInfo: {
    flex: 1,
    minWidth: 0,
  },
  clientName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '3px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clientGoal: {
    fontSize: '13px',
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clientArrow: {
    color: '#4b5563',
    fontSize: '16px',
    flexShrink: 0,
  },
}