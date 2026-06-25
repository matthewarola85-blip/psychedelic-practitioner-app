import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import NewClient from './pages/NewClient'
import TreatmentPlanner from './pages/TreatmentPlanner'
import ReportView from './pages/ReportView'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Navbar />
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/clients"
          element={
            <>
              <SignedIn>
                <Navbar />
                <Clients />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/clients/new"
          element={
            <>
              <SignedIn>
                <Navbar />
                <NewClient />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/clients/:id/treatment"
          element={
            <>
              <SignedIn>
                <Navbar />
                <TreatmentPlanner />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <>
              <SignedIn>
                <Navbar />
                <ReportView />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App