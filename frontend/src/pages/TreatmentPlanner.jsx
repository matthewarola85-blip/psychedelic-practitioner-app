import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const PSYCHEDELICS = [
  'Psilocybin',
  'MDMA',
  'Ketamine',
  'LSD',
  'Ayahuasca (DMT + MAOI)',
  'DMT',
  '5-MeO-DMT',
  'Ibogaine',
  'Mescaline / Peyote',
  '2C-B',
  'Cannabis (adjunct)',
]

export default function TreatmentPlanner() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [psychedelic, setPsychedelic] = useState('')
  const [medications, setMedications] = useState([])
  const [medSearch, setMedSearch] = useState('')
  const [medResults, setMedResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [reports, setReports] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    axios.get(`${API}/api/clients/${id}`)
      .then(res => setClient(res.data))
      .catch(err => console.error(err))

    axios.get(`${API}/api/treatment/client/${id}`)
      .then(res => setReports(res.data))
      .catch(err => console.error(err))
  }, [id])

  useEffect(() => {
    if (medSearch.length < 2) {
      setMedResults([])
      setShowDropdown(false)
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      setShowDropdown(true)
      try {
        const res = await axios.get(
          `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(medSearch)}`
        )
        const groups = res.data?.drugGroup?.conceptGroup || []
        const drugs = []
        groups.forEach(group => {
          if (group.conceptProperties) {
            group.conceptProperties.forEach(drug => {
              drugs.push({ name: drug.name, rxcui: drug.rxcui })
            })
          }
        })
        setMedResults(drugs.slice(0, 8))
      } catch (err) {
        console.error(err)
        setMedResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [medSearch])

  const addMedication = (drug) => {
    if (medications.find(m => m.rxcui === drug.rxcui)) return
    setMedications([...medications, { name: drug.name, rxcui: drug.rxcui, dosage: '' }])
    setMedSearch('')
    setMedResults([])
    setShowDropdown(false)
  }

  const addManual = () => {
    if (!medSearch.trim()) return
    const manual = { name: medSearch.trim(), rxcui: `manual-${Date.now()}`, dosage: '' }
    setMedications([...medications, manual])
    setMedSearch('')
    setMedResults([])
    setShowDropdown(false)
  }

  const removeMedication = (rxcui) => {
    setMedications(medications.filter(m => m.rxcui !== rxcui))
  }

  const updateDosage = (rxcui, dosage) => {
    setMedications(medications.map(m => m.rxcui === rxcui ? { ...m, dosage } : m))
  }

  const generateReport = async () => {
    if (!psychedelic) {
      alert('Please select a psychedelic.')
      return
    }
    setGenerating(true)
    try {
      const res = await axios.post(`${API}/api/treatment/generate`, {
        client_id: id,
        treatment_goal: client.treatment_goal,
        psychedelic,
        medications,
      })
      navigate(`/reports/${res.data.report_id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to generate report.')
    } finally {
      setGenerating(false)
    }
  }

  if (!client) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/clients')}>← Back</button>
        <div>
          <h1 style={styles.title}>{client.name}</h1>
          <p style={styles.subtitle}>Treatment Intelligence Planner</p>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.formCol}>

          {/* Treatment Goal */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Treatment Goal</h2>
            <div style={styles.goalBox}>
              {client.treatment_goal || 'No treatment goal set'}
            </div>
          </div>

          {/* Psychedelic Selection */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Select Psychedelic</h2>
            <div style={styles.psychedelicGrid}>
              {PSYCHEDELICS.map(p => (
                <button
                  key={p}
                  style={psychedelic === p ? styles.psychedelicActive : styles.psychedelicBtn}
                  onClick={() => setPsychedelic(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Medication Search */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Current Medications</h2>
            <p style={styles.sectionHint}>
              Search by name or type any medication and click "Add manually"
            </p>

            <div style={styles.searchRow}>
              <div style={styles.searchWrapper}>
                <input
                  style={styles.searchInput}
                  type="text"
                  placeholder="Search medications (e.g. sertraline, lithium...)"
                  value={medSearch}
                  onChange={e => setMedSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addManual() }}
                />
                {showDropdown && (
                  <div style={styles.dropdown}>
                    {searching && (
                      <div style={styles.dropdownHint}>Searching...</div>
                    )}
                    {medResults.map(drug => (
                      <div
                        key={drug.rxcui}
                        style={styles.dropdownItem}
                        onClick={() => addMedication(drug)}
                      >
                        {drug.name}
                      </div>
                    ))}
                    {!searching && medSearch.length > 1 && (
                      <div
                        style={styles.dropdownItemManual}
                        onClick={addManual}
                      >
                        + Add "{medSearch}" manually
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button style={styles.addManualBtn} onClick={addManual}>
                Add
              </button>
            </div>

            {medications.length > 0 && (
              <div style={styles.medList}>
                {medications.map(med => (
                  <div key={med.rxcui} style={styles.medItem}>
                    <div style={styles.medName}>{med.name}</div>
                    <input
                      style={styles.dosageInput}
                      type="text"
                      placeholder="Dosage (e.g. 100mg daily)"
                      value={med.dosage}
                      onChange={e => updateDosage(med.rxcui, e.target.value)}
                    />
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeMedication(med.rxcui)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            style={generating ? styles.generateBtnDisabled : styles.generateBtn}
            onClick={generateReport}
            disabled={generating}
          >
            {generating ? '⏳ Generating Report...' : '⚡ Generate Treatment Intelligence Report'}
          </button>

          {generating && (
            <p style={styles.generatingHint}>
              Analyzing drug interactions, protocols, and evidence base. This takes 10–20 seconds...
            </p>
          )}
        </div>

        {/* Right column - past reports */}
        <div style={styles.reportsCol}>
          <h2 style={styles.sectionTitle}>Previous Reports</h2>
          {reports.length === 0 ? (
            <div style={styles.noReports}>No reports generated yet</div>
          ) : (
            <div style={styles.reportList}>
              {reports.map(report => (
                <div
                  key={report.id}
                  style={styles.reportItem}
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  <div style={styles.reportPsychedelic}>{report.psychedelic}</div>
                  <div style={styles.reportDate}>
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  <div style={styles.reportArrow}>→</div>
                </div>
              ))}
            </div>
          )}
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
  },
  loading: {
    color: '#6b7280',
    padding: '60px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '36px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    marginBottom: '12px',
    display: 'block',
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
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '32px',
    alignItems: 'start',
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  section: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 16px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionHint: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '-8px 0 16px 0',
  },
  goalBox: {
    background: 'rgba(139,92,246,0.08)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '15px',
    color: '#e8e6f0',
    lineHeight: '1.5',
  },
  psychedelicGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  psychedelicBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9ca3af',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  psychedelicActive: {
    background: 'rgba(139,92,246,0.2)',
    border: '1px solid rgba(139,92,246,0.5)',
    color: '#a78bfa',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
  },
  searchInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  addManualBtn: {
    background: 'rgba(139,92,246,0.2)',
    border: '1px solid rgba(139,92,246,0.4)',
    color: '#a78bfa',
    padding: '12px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#1e1b2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginTop: '4px',
    zIndex: 50,
    overflow: 'hidden',
  },
  dropdownHint: {
    padding: '10px 16px',
    fontSize: '13px',
    color: '#6b7280',
  },
  dropdownItem: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#e8e6f0',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  dropdownItemManual: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#8b5cf6',
    cursor: 'pointer',
    fontStyle: 'italic',
  },
  medList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '16px',
  },
  medItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '10px 14px',
  },
  medName: {
    flex: 1,
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: '500',
  },
  dosageInput: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '6px 10px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    width: '180px',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px',
  },
  generateBtn: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    width: '100%',
    letterSpacing: '-0.2px',
  },
  generateBtnDisabled: {
    background: '#4b5563',
    border: 'none',
    color: '#9ca3af',
    padding: '16px 32px',
    borderRadius: '10px',
    cursor: 'not-allowed',
    fontSize: '16px',
    fontWeight: '700',
    width: '100%',
  },
  generatingHint: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    margin: '-16px 0 0 0',
  },
  reportsCol: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '24px',
  },
  noReports: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    padding: '20px 0',
  },
  reportList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  reportItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  reportPsychedelic: {
    flex: 1,
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: '500',
  },
  reportDate: {
    fontSize: '12px',
    color: '#6b7280',
  },
  reportArrow: {
    color: '#4b5563',
  },
}