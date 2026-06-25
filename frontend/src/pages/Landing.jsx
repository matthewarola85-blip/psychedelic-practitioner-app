import { useNavigate } from 'react-router-dom'
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>⬡</span>
          <span style={styles.navTitle}>Vessel</span>
        </div>
        <div style={styles.navActions}>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={styles.navSignIn}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={styles.navSignUp}>Get Started</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button style={styles.navSignUp} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>Clinical Decision Support for PAT Practitioners</div>
          <h1 style={styles.heroTitle}>
            The Intelligence Platform for<br />
            <span style={styles.heroAccent}>Psychedelic-Assisted Therapy</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Generate comprehensive treatment intelligence reports — including drug interactions,
            dosing protocols, evidence summaries, and clinical guidance — purpose-built for
            the psychedelic practitioner.
          </p>
          <div style={styles.heroActions}>
            <SignedOut>
              <SignUpButton mode="modal">
                <button style={styles.heroCTA}>Start Free Trial</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button style={styles.heroCTA} onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
            </SignedIn>
            <span style={styles.heroDisclaimer}>No credit card required</span>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.reportCard}>
            <div style={styles.reportHeader}>
              <span style={styles.reportBadge}>Treatment Intelligence Report</span>
            </div>
            <div style={styles.reportSection}>
              <div style={styles.warnBadge}>⚠ CONTRAINDICATED</div>
              <p style={styles.reportText}>Lithium + Psilocybin — Seizure risk. Do not proceed without medication adjustment.</p>
            </div>
            <div style={styles.reportSection}>
              <div style={styles.cautionBadge}>⚡ HIGH CAUTION</div>
              <p style={styles.reportText}>Sertraline 100mg — Blunted efficacy via 5-HT2A downregulation. Consider taper protocol.</p>
            </div>
            <div style={styles.reportSection}>
              <div style={styles.safeBadge}>✓ PROTOCOL</div>
              <p style={styles.reportText}>Psilocybin 25mg synthetic · 1 session · Johns Hopkins model · 3 prep sessions recommended</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Built for how you actually practice</h2>
        <div style={styles.featureGrid}>
          {[
            {
              icon: '⚠',
              title: 'Drug Interaction Engine',
              desc: 'Mechanism-aware interaction checking across all psychedelic compounds and current medications. Ranked by severity — not just "no data available".'
            },
            {
              icon: '📋',
              title: 'Protocol Intelligence',
              desc: 'Evidence-based dosing and session structure recommendations drawn from Johns Hopkins, MAPS, Beckley, and published peer-reviewed research.'
            },
            {
              icon: '🔬',
              title: 'Full Evidence Base',
              desc: 'Beyond FDA labeling. Access the complete body of clinical research for every compound, specific to your client\'s treatment goal.'
            },
            {
              icon: '📁',
              title: 'Client Management',
              desc: 'Track clients, treatment goals, medications, and generated reports in one secure place built for the PAT workflow.'
            }
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Vessel provides clinical decision support for licensed and certified practitioners only.
          Reports synthesize published research and are not a substitute for clinical judgment.
        </p>
        <p style={styles.footerCopy}>© 2026 Vessel · Built for the future of mental healthcare</p>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e8e6f0',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navLogo: {
    fontSize: '24px',
    color: '#8b5cf6',
  },
  navTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  navActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  navSignIn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#e8e6f0',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  navSignUp: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 60px',
    gap: '60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heroContent: {
    flex: 1,
    maxWidth: '560px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)',
    color: '#a78bfa',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '24px',
    letterSpacing: '0.3px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1.15',
    marginBottom: '20px',
    color: '#ffffff',
    letterSpacing: '-1px',
  },
  heroAccent: {
    color: '#8b5cf6',
  },
  heroSubtitle: {
    fontSize: '17px',
    lineHeight: '1.7',
    color: '#9ca3af',
    marginBottom: '36px',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  heroCTA: {
    background: '#8b5cf6',
    border: 'none',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  heroDisclaimer: {
    fontSize: '13px',
    color: '#6b7280',
  },
  heroVisual: {
    flex: 1,
    maxWidth: '480px',
  },
  reportCard: {
    background: '#13111a',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  reportHeader: {
    marginBottom: '20px',
  },
  reportBadge: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  reportSection: {
    marginBottom: '16px',
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  warnBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: '6px',
    letterSpacing: '0.5px',
  },
  cautionBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: '6px',
    letterSpacing: '0.5px',
  },
  safeBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '6px',
    letterSpacing: '0.5px',
  },
  reportText: {
    fontSize: '13px',
    color: '#9ca3af',
    lineHeight: '1.5',
    margin: 0,
  },
  features: {
    padding: '80px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '48px',
    letterSpacing: '-0.5px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  featureCard: {
    background: '#13111a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '28px',
  },
  featureIcon: {
    fontSize: '24px',
    marginBottom: '14px',
  },
  featureTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '14px',
    color: '#9ca3af',
    lineHeight: '1.6',
    margin: 0,
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '40px 60px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto 12px',
    lineHeight: '1.6',
  },
  footerCopy: {
    fontSize: '12px',
    color: '#4b5563',
  },
}