import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Save } from 'lucide-react'

const Impostazioni = () => {
  const [fornitori, setFornitori] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [salvato, setSalvato] = useState(false)

  useEffect(() => {
    caricaFornitori()
  }, [])

  const caricaFornitori = async () => {
    setCaricamento(true)
    const { data } = await supabase
      .from('fornitori')
      .select('*')
      .order('priorita', { ascending: true })
    if (data) setFornitori(data)
    setCaricamento(false)
  }

  const toggleFornitore = async (id, attivo) => {
    await supabase
      .from('fornitori')
      .update({ attivo: !attivo })
      .eq('id', id)
    caricaFornitori()
  }

  const aggiornaPriorita = async (id, priorita) => {
    await supabase
      .from('fornitori')
      .update({ priorita: parseInt(priorita) })
      .eq('id', id)
  }

  const salvaModifiche = async () => {
    await caricaFornitori()
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Impostazioni</h1>
        <button
          onClick={salvaModifiche}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          <Save className="w-4 h-4" />
          {salvato ? 'Salvato!' : 'Salva'}
        </button>
      </div>

      {/* Gestione fornitori */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Fornitori
        </h2>
        {caricamento ? (
          <div className="text-center py-12 text-slate-400">Caricamento...</div>
        ) : fornitori.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
            Nessun fornitore — aggiungili dal foglio Google Sheets
          </div>
        ) : (
          <div className="space-y-3">
            {fornitori.map(f => (
              <div key={f.id} className="bg-white rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {f.logo_url ? (
                    <img src={f.logo_url} alt={f.nome} className="w-10 h-10 rounded-xl object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">
                      {f.nome?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">{f.nome}</div>
                    <div className="flex gap-2 mt-0.5">
                      {f.fornisce_luce && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Luce</span>}
                      {f.fornisce_gas && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Gas</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Priorità</label>
                    <input
                      type="number"
                      defaultValue={f.priorita}
                      onBlur={e => aggiornaPriorita(f.id, e.target.value)}
                      className="w-16 bg-slate-100 rounded-xl px-2 py-1 text-sm text-center outline-none"
                    />
                  </div>
                  <button
                    onClick={() => toggleFornitore(f.id, f.attivo)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      f.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {f.attivo ? 'Attivo' : 'Disattivo'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Impostazioni
