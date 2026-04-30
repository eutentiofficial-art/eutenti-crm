import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Zap, Eye, EyeOff, Plus } from 'lucide-react'

const Offerte = () => {
  const [offerte, setOfferte] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [filtro, setFiltro] = useState('tutti')

  useEffect(() => {
    caricaOfferte()
  }, [])

  const caricaOfferte = async () => {
    setCaricamento(true)
    const { data, error } = await supabase
      .from('vw_offerte_attive')
      .select('*')
      .order('priorita_visualizzazione', { ascending: true })
    if (!error) setOfferte(data || [])
    setCaricamento(false)
  }

  const toggleVisibile = async (id, visibile) => {
    const { error } = await supabase
      .from('offerte')
      .update({ visibile: !visibile })
      .eq('id', id)
    if (!error) caricaOfferte()
  }

  const offerteFiltrate = offerte.filter(o => {
    if (filtro === 'tutti') return true
    return o.tipo_fornitura === filtro
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Offerte Attive</h1>
        <button onClick={caricaOfferte} className="text-sm text-blue-600 hover:underline">
          Aggiorna
        </button>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-2xl p-4 mb-4 flex gap-2">
        {['tutti', 'luce', 'gas', 'dual'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
              filtro === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'tutti' ? 'Tutte' : f}
          </button>
        ))}
      </div>

      {caricamento ? (
        <div className="text-center py-12 text-slate-400">Caricamento...</div>
      ) : offerteFiltrate.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Nessuna offerta trovata</div>
      ) : (
        <div className="space-y-3">
          {offerteFiltrate.map(o => (
            <div key={o.offerta_id} className="bg-white rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {o.logo_url ? (
                    <img src={o.logo_url} alt={o.fornitore} className="w-10 h-10 rounded-xl object-contain" />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">{o.nome_offerta}</div>
                    <div className="text-sm text-slate-500">{o.fornitore}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    o.tipo_fornitura === 'luce' ? 'bg-yellow-100 text-yellow-700' :
                    o.tipo_fornitura === 'gas' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {o.tipo_fornitura}
                  </span>
                  <button
                    onClick={() => toggleVisibile(o.offerta_id, o.visibile)}
                    className={`p-2 rounded-xl transition-colors ${
                      o.visibile ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {o.visibile ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {o.prezzo_kwh && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Prezzo kWh</div>
                    <div className="text-sm font-bold">€ {o.prezzo_kwh}</div>
                  </div>
                )}
                {o.prezzo_smc && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Prezzo Smc</div>
                    <div className="text-sm font-bold">€ {o.prezzo_smc}</div>
                  </div>
                )}
                {o.quota_fissa_luce_mensile && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Quota fissa luce</div>
                    <div className="text-sm font-bold">€ {o.quota_fissa_luce_mensile}/mese</div>
                  </div>
                )}
                {o.quota_fissa_gas_mensile && (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Quota fissa gas</div>
                    <div className="text-sm font-bold">€ {o.quota_fissa_gas_mensile}/mese</div>
                  </div>
                )}
                {o.importo_fisso && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="text-xs text-green-600 mb-1">Commissione fissa</div>
                    <div className="text-sm font-bold text-green-700">€ {o.importo_fisso}</div>
                  </div>
                )}
                {o.percentuale && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="text-xs text-green-600 mb-1">Commissione %</div>
                    <div className="text-sm font-bold text-green-700">{o.percentuale}%</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Offerte
