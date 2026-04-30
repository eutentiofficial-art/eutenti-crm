import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react'

const Performance = () => {
  const [performance, setPerformance] = useState([])
  const [compensi, setCompensi] = useState([])
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    caricaDati()
  }, [])

  const caricaDati = async () => {
    setCaricamento(true)

    const { data: perf } = await supabase
      .from('vw_performance_operatori')
      .select('*')

    const { data: comp } = await supabase
      .from('compensi_operatori')
      .select('*, admin_pannello(nome_utente), leads(email)')
      .eq('stato', 'in_attesa')
      .order('created_at', { ascending: false })

    if (perf) setPerformance(perf)
    if (comp) setCompensi(comp)
    setCaricamento(false)
  }

  const approvaCompenso = async (id) => {
    await supabase
      .from('compensi_operatori')
      .update({ stato: 'approvato', data_approvazione: new Date() })
      .eq('id', id)
    caricaDati()
  }

  const rifiutaCompenso = async (id) => {
    await supabase
      .from('compensi_operatori')
      .update({ stato: 'rifiutato' })
      .eq('id', id)
    caricaDati()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Performance</h1>

      {caricamento ? (
        <div className="text-center py-12 text-slate-400">Caricamento...</div>
      ) : (
        <>
          {/* Performance operatori */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Operatori
            </h2>
            <div className="space-y-3">
              {performance.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
                  Nessun dato disponibile
                </div>
              ) : performance.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-slate-900">{p.operatore}</div>
                    <div className="text-sm font-bold text-blue-600">{p.percentuale_chiusura}% chiusura</div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-400 mb-1">Assegnati</div>
                      <div className="text-lg font-bold text-slate-900">{p.lead_assegnati}</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-yellow-600 mb-1">In lavorazione</div>
                      <div className="text-lg font-bold text-yellow-700">{p.lead_in_lavorazione}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-green-600 mb-1">Chiusi</div>
                      <div className="text-lg font-bold text-green-700">{p.lead_chiusi}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-red-600 mb-1">Persi</div>
                      <div className="text-lg font-bold text-red-700">{p.lead_persi}</div>
                    </div>
                  </div>
                  {p.fatturato_totale && (
                    <div className="mt-3 bg-green-50 rounded-xl p-3">
                      <div className="text-xs text-green-600 mb-1">Fatturato approvato</div>
                      <div className="text-sm font-bold text-green-700">€ {p.fatturato_totale}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Compensi in attesa di approvazione */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Chiusure da verificare
            </h2>
            {compensi.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
                Nessuna chiusura in attesa
              </div>
            ) : (
              <div className="space-y-3">
                {compensi.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {c.admin_pannello?.nome_utente}
                        </div>
                        <div className="text-sm text-slate-500">
                          Cliente: {c.leads?.email}
                        </div>
                        <div className="text-sm text-slate-500">
                          Data chiusura: {c.data_chiusura ? new Date(c.data_chiusura).toLocaleDateString('it-IT') : 'N/D'}
                        </div>
                        <div className="text-sm font-bold text-green-700 mt-1">
                          Importo: € {c.importo_contratto}
                        </div>
                        {c.note_operatore && (
                          <div className="text-xs text-slate-400 mt-1">Note: {c.note_operatore}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approvaCompenso(c.id)}
                          className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" /> Approva
                        </button>
                        <button
                          onClick={() => rifiutaCompenso(c.id)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Performance
