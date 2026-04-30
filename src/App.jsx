import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [utente, setUtente] = useState(null)
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('crm_utente')
    if (session) setUtente(JSON.parse(session))
    setCaricamento(false)
  }, [])

  const handleLogin = (u) => {
    localStorage.setItem('crm_utente', JSON.stringify(u))
    setUtente(u)
  }

  const handleLogout = () => {
    localStorage.removeItem('crm_utente')
    setUtente(null)
  }

  if (caricamento) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-white text-lg">Caricamento...</div>
    </div>
  )

  if (!utente) return <Login onLogin={handleLogin} />

  return <Dashboard utente={utente} onLogout={handleLogout} />
}

export default App
