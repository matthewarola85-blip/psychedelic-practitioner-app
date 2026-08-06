import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import NewClient from './pages/NewClient'
import TreatmentPlanner from './pages/TreatmentPlanner'
import ReportView from './pages/ReportView'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import './App.css'

function AuthenticatedApp({ children }) {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['x-user-id'] = user.id
    }
  }, [user])

  return children
}

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        <AuthenticatedApp>
          <Navbar />
          {children}
        </AuthenticatedApp>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/clients/new" element={<ProtectedRoute><NewClient /></ProtectedRoute>} />
        <Route path="/clients/:id/treatment" element={<ProtectedRoute><TreatmentPlanner /></ProtectedRoute>} />
        <Route path="/reports/:id" element={<ProtectedRoute><ReportView /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App