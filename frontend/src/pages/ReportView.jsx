import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ReportView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/treatment/${id}`)
      .then(res => setReport(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={styles.loading}>Loading report...</div>
  if (!report) return <div style={styles.loading}>Report not found.</div>

  const sections = parseReport(report.report)
  const meds = typeof report.medications === 'string'
    ? JSON.parse(report.medications)
    : report.medications

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div style={styles.headerInfo}>
          <div style={styles.reportBadge}>Treatment Intelligence Report</div>
          <h1 style={styles.title}>{report.psychedelic}</h1>
          <p style={styles.subtitle}>
            Generated {new Date(report.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <button style={styles.printBtn} onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </div>

      {meds && meds.length > 0 && (
        <div style={styles.medSummary}>
          <span style={styles.medSummaryLabel}>Medications reviewed: </span>
          {meds.map((m, i) => (
            <span key={i} style={styles.medTag}>
              {m.name}{m.dosage ? ` — ${m.dosage}` : ''}
            </span>
          ))}
        </div>
      )}

      <div style={styles.reportBody}>
        {sections.length === 0 ? (
          <div style={styles.rawReport}>
            {report.report.split('\n').map((line, i) => (
              <p key={i} style={styles.contentLine}>{line}</p>
            ))}
          </div>
        ) : (
          sections.map((section, i) => (
            <div key={i} style={getSectionStyle(section.title)}>
              <h2 style={getSectionTitleStyle(section.title)}>{section.title}</h2>
              <div style={styles.sectionContent}>
                {section.content.split('\n').map((line, j) => {
                  if (!line.trim()) return null

                  const cleaned = line
                    .replace(/^#{1,4}\s*/, '')
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/\*(.*?)\*/g, '$1')
                    .trim()

                  if (!cleaned) return null

                  const lower = cleaned.toLowerCase()
                  const isContraindicated = lower.includes('contraindicated')
                  const isHighCaution = lower.includes('high caution')
                  const isCaution = lower.includes('⚠') || lower.includes('caution:')
                  const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•')
                  const isNumbered = /^\d+\./.test(line.trim())
                  const isSubHeader = cleaned.endsWith(':') && cleaned.length < 80 && !isBullet

                  if (isContraindicated) return <p key={j} style={styles.contraLine}>{cleaned}</p>
                  if (isHighCaution) return <p key={j} style={styles.cautionLine}>{cleaned}</p>
                  if (isCaution) return <p key={j} style={styles.cautionLine}>{cleaned}</p>
                  if (isSubHeader) return <p key={j} style={styles.subHeader}>{cleaned}</p>
                  if (isBullet || isNumbered) return <p key={j} style={styles.bulletLine}>{cleaned}</p>
                  return <p key={j} style={styles.contentLine}>{cleaned}</p>
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.disclaimer}>
        <p style={styles.disclaimerText}>
          This report is generated for licensed and certified practitioners only. It synthesizes
          published research and peer-reviewed literature and does not constitute medical advice.
          Clinical judgment of the treating practitioner supersedes all recommendations herein.
        </p>
      </div>
    </div>
  )
}

function parseReport(text) {
  const sectionHeaders = [
    'DRUG INTERACTIONS',
    'RECOMMENDED PROTOCOL',
    'EVIDENCE BASE',
    'BENEFITS',
    'RISKS & CONTRAINDICATIONS',
    'RISKS',
    'PRACTITIONER NOTES',
  ]

  const sections = []
  let currentSection = null
  let currentContent = []

  const lines = text.split('\n')
  for (const line of lines) {
    const upperLine = line.toUpperCase().replace(/^#+\s*/, '').trim()
    const matchedHeader = sectionHeaders.find(h => upperLine === h || upperLine.startsWith(h))
    if (matchedHeader) {
      if (currentSection) {
        sections.push({ title: currentSection, content: currentContent.join('\n') })
      }
      currentSection = matchedHeader
      currentContent = []
    } else if (currentSection) {
      currentContent.push(line)
    }
  }
  if (currentSection) {
    sections.push({ title: currentSection, content: currentContent.join('\n') })
  }

  return sections
}

function getSectionStyle(title) {
  const base = {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '20px',
  }
  if (title === 'DRUG INTERACTIONS') return { ...base, borderColor: 'rgba(239,68,68,0.3)' }
  if (title === 'RECOMMENDED PROTOCOL') return { ...base, borderColor: 'rgba(16,185,129,0.2)' }
  if (title === 'RISKS & CONTRAINDICATIONS' || title === 'RISKS') return { ...base, borderColor: 'rgba(245,158,11,0.2)' }
  return base
}

function getSectionTitleStyle(title) {
  const base = {
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 20px 0',
  }
  if (title === 'DRUG INTERACTIONS') return { ...base, color: '#ef4444' }
  if (title === 'RECOMMENDED PROTOCOL') return { ...base, color: '#10b981' }
  if (title === 'EVIDENCE BASE') return { ...base, color: '#3b82f6' }
  if (title === 'BENEFITS') return { ...base, color: '#8b5cf6' }
  if (title === 'RISKS & CONTRAINDICATIONS' || title === 'RISKS') return { ...base, color: '#f59e0b' }
  if (title === 'PRACTITIONER NOTES') return { ...base, color: '#9ca3af' }
  return { ...base, color: '#ffffff' }
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e8e6f0',
    padding: '40px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    maxWidth: '900px',
    margin: '0 auto',
  },
  loading: {
    color: '#6b7280',
    padding: '60px',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
    gap: '20px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    flexShrink: 0,
    marginTop: '4px',
  },
  headerInfo: {
    flex: 1,
  },
  reportBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
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
  printBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    flexShrink: 0,
  },
  medSummary: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
  },
  medSummaryLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  medTag: {
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.25)',
    color: '#a78bfa',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
  },
  reportBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  rawReport: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '28px',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  contentLine: {
    fontSize: '14px',
    color: '#9ca3af',
    lineHeight: '1.7',
    margin: 0,
  },
  subHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e8e6f0',
    lineHeight: '1.7',
    margin: '12px 0 4px 0',
  },
  bulletLine: {
    fontSize: '14px',
    color: '#9ca3af',
    lineHeight: '1.7',
    margin: '0',
    paddingLeft: '16px',
    borderLeft: '2px solid rgba(139,92,246,0.3)',
  },
  contraLine: {
    fontSize: '14px',
    color: '#fca5a5',
    lineHeight: '1.7',
    margin: 0,
    background: 'rgba(239,68,68,0.08)',
    padding: '10px 14px',
    borderRadius: '6px',
    borderLeft: '3px solid #ef4444',
  },
  cautionLine: {
    fontSize: '14px',
    color: '#fcd34d',
    lineHeight: '1.7',
    margin: 0,
    background: 'rgba(245,158,11,0.08)',
    padding: '10px 14px',
    borderRadius: '6px',
    borderLeft: '3px solid #f59e0b',
  },
  disclaimer: {
    marginTop: '40px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
  },
  disclaimerText: {
    fontSize: '12px',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: 0,
    textAlign: 'center',
  },
}