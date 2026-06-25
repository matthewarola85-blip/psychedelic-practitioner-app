import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Clients() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = () => {
    axios.get(`${API}/api/clients`)
      .then(res => setClients(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const deleteClient = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this client and all their reports? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await axios.delete(`${API}/api/clients/${id}`)
      setClients(clients.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete client.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Clients</h1>
          <p style={styles.subtitle}>Manage your client roster</p>
        </div>
        <button style={styles.newBtn} onClick={() => navigate('/clients/new')}>
          + New Client
        </button>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : clients.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>👤</div>
          <p style={styles.emptyTitle}>No clients yet</p>
          <p style={styles.emptyText}>Add your first client to get started</p>
          <button style={styles.emptyBtn} onClick={() => navigate('/clients/new')}>
            Add Client
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {clients.map(client => (
            <div
              key={client.id}
              style={styles.card}
              onClick={() => navigate(`/clients/${client.id}/treatment`)}
            >
              <div style={styles.cardAvatar}>
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.cardInfo}>
                <div style={styles.cardName}>{client.name}</div>
                <div style={styles.cardGoal}>{client.treatment_goal || 'No goal set'}</div>
                {client.date_of_birth && (
                  <div style={styles.cardDob}>
                    DOB: {new Date(client.date_of_birth).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div style={styles.cardActions}>
                <button
                  style={styles.planBtn}
                  onClick={e => { e.stopPropagation(); navigate(`/clients/${client.id}/treatment`) }}
                >
                  Generate Report →
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={e => deleteClient(e, client.id)}
                  disabled={deletingId === client.id}
                >
                  {deletingId === client.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
  newBtn: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '10px 22px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  empty: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '60px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '80px 40px',
    background: '#13111a',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
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
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 24px',
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  cardAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(139,92,246,0.2)',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '18px',
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '4px',
  },
  cardGoal: {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '4px',
  },
  cardDob: {
    fontSize: '12px',
    color: '#6b7280',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexShrink: 0,
  },
  planBtn: {
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)',
    color: '#a78bfa',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
}