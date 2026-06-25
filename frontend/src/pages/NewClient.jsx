import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function NewClient() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    date_of_birth: '',
    treatment_goal: '',
    notes: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.treatment_goal) {
      alert('Name and treatment goal are required.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/clients`, form)
      navigate(`/clients/${res.data.id}/treatment`)
    } catch (err) {
      console.error(err)
      alert('Failed to create client.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <button style={styles.backBtn} onClick={() => navigate('/clients')}>
            ← Back
          </button>
          <h1 style={styles.title}>New Client</h1>
          <p style={styles.subtitle}>Enter client details to get started</p>
        </div>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Client full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Date of Birth</label>
            <input
              style={styles.input}
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Treatment Goal *</label>
            <textarea
              style={styles.textarea}
              name="treatment_goal"
              placeholder="What is the client hoping to achieve? (e.g. Processing grief and loss, Treatment-resistant depression, End-of-life anxiety, Alcohol use disorder)"
              value={form.treatment_goal}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Clinical Notes</label>
            <textarea
              style={styles.textarea}
              name="notes"
              placeholder="Any relevant clinical history, context, or notes..."
              value={form.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div style={styles.actions}>
            <button
              style={styles.cancelBtn}
              onClick={() => navigate('/clients')}
            >
              Cancel
            </button>
            <button
              style={loading ? styles.submitBtnDisabled : styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Client & Plan Treatment →'}
            </button>
          </div>
        </div>
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
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    height: 'fit-content',
  },
  cardHeader: {
    marginBottom: '32px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    marginBottom: '16px',
    display: 'block',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9ca3af',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  submitBtn: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  submitBtnDisabled: {
    background: '#4b5563',
    border: 'none',
    color: '#9ca3af',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '14px',
    fontWeight: '600',
  },
}