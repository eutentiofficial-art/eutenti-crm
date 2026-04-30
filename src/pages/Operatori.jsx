import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { UserPlus, Check, X } from 'lucide-react'

const Operatori = () => {
  const [operatori, setOperatori] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [mostraForm, setMostraForm] = useState(false)
  const [form, setForm] = useState({
    nome_utente: '',
    email: '',
    password_hash: '',
    ruolo: 'operatore',
    attivo: true
  })

  useEffect(() => {
    caricaOperatori()
  }, [])

  const caricaOperatori = async () => {
    setCaricamento(true)
    const { data, error } = await supabase
      .from('admin_pannello')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setOperatori(data || [])
    setCaricamento(false)
  }

  const toggleAttivo = async (id, attivo) => {
    await supabase
      .from('admin_pannello')
      .update({ attivo: !attivo })
      .eq('id', id)
    caricaOperatori()
  }

  const aggiungiOperatore = async () => {
    if (!form.nome_utente || !form.email || !form.password_hash) return
    const { error } = await supabase
      .from('admin_pannello')
      .insert({
        ...form,
        password_hash: btoa(form.password_hash)
      })
    if (!error) {
      setMostraForm(false)
      setForm({ nome_utente: '', email: '', password_hash: '', ruolo: 'operatore', attivo: true })
      caricaOperatori()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Operatori</h1>
        <button
          onClick={() => setMostraForm(!mostraForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Aggiungi
        </button>
      </div>

      {/* Form aggiunta */}
      {mostraForm && (
        <div className="bg-white rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="font-semibold text-slate-900 mb-3">Nuovo operatore</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nome utente</label>
              <input
                value={form.nome_utente}
                onChange={e => setForm({ ...form, nome_utente: e.target.value })}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none"
                placeholder="Mario Rossi"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none"
                placeholder="mario@email.it"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Password</label>
              <input
                type="password"
                value={form.password_hash}
                onChange={e => setForm({ ...form, password_hash: e.target.value })}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ruolo</label>
              <select
                value={form.ruolo}
                onChange={e => setForm({ ...form, ruolo: e.target.value })}
                className="w-full bg-slate-100 rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="operatore">Operatore</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={aggiungiOperatore}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Salva
            </button>
            <button
              onClick={() => setMostraForm(false)}
              className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Lista operatori */}
      {caricamento ? (
        <div className="text-center py-12 text-slate-400">Caricamento...</div>
      ) : (
        <div className="space-y-3">
          {operatori.map(o => (
            <div key={o.id} className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{o.nome_utente}</div>
                <div className="text-sm text-slate-500">{o.email}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                  o.ruolo === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {o.ruolo}
                </span>
              </div>
              <button
                onClick={() => toggleAttivo(o.id, o.attivo)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  o.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {o.attivo ? <><Check className="w-4 h-4" /> Attivo</> : <><X className="w-4 h-4" /> Disattivo</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Operatori
