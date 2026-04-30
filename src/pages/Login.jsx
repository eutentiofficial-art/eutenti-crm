import React, { useState } from 'react'
import { supabase } from '../supabase'
import { Zap, Eye, EyeOff } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostraPassword, setMostraPassword] = useState(false)
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrore('')
    setCaricamento(true)

    try {
      const { data, error } = await supabase
        .from('admin_pannello')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('bloccato', false)
        .single()

      if (error || !data) {
        setErrore('Credenziali non valide')
        setCaricamento(false)
        return
      }

      if (data.password_hash !== password) {
        setErrore('Credenziali non valide')
        setCaricamento(false)
        return
      }

      onLogin(data)
    } catch (e) {
      setErrore('Errore di connessione')
    } finally {
      setCaricamento(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-white">eUtenti CRM</h1>
          <p className="text-slate-400 text-sm mt-1">Accedi al pannello</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tua@email.it"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={mostraPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setMostraPassword(!mostraPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {mostraPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errore && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {errore}
            </div>
          )}

          <button
            type="submit"
            disabled={caricamento}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {caricamento ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
