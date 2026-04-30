import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Search, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const STATI = ['tutti', 'nuovo', 'in_lavorazione', 'inviato_operatore', 'chiuso', 'non_interessato']

const coloreStato = (stato) => {
  switch (stato) {
    case 'nuovo': return 'bg-blue-100 text-blue-700'
    case 'in_lavorazione': return 'bg-yellow-100 text-yellow-700'
    case 'inviato_operatore': return 'bg-purple-100 text-purple-700'
    case 'chiuso': return 'bg-green-100 text-green-700'
    case 'non_interessato': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const Lead = ({ utente }) => {
  const [leads, setLeads] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [filtroStato, setFiltroStato] = useState('tutti')
  const [ricerca, setRicerca] = useState('')
  const [leadSelezionato, setLeadSelezionato] = useState(null)

  useEffect(() => {
    caricaLead()
  }, [])

  const caricaLead = async () => {
    setCaricamento(true)
    let query = supabase
      .from('vw_scheda_operatore')
      .select('*')
      .order('created_at', { ascending: false })

    if (utente.ruolo === 'operatore') {
      query = query.eq('operatore_assegnato', utente.nome_utente)
    }

    const { data, error } = await query
    if (!error) setLeads(data || [])
    setCaricamento(false)
  }

  const aggiornaStato = async (id, nuovoStato) => {
    const { error } = await supabase
      .from('leads')
      .update({ stato: nuovoStato, updated_at: new Date() })
      .eq('id', id)

    if (!error) caricaLead()
  }

  const leadFiltrati = leads.filter(l => {
    const matchStato = filtroStato === 'tutti' || l.stato === filtroStato
    const matchRicerca = !ricerca ||
      l.email?.toLowerCase().includes(ricerca.toLowerCase()) ||
      l.telefono?.includes(ricerca) ||
      l.nome?.toLowerCase().includes(ricerca.toLowerCase()) ||
      l.cognome?.toLowerCase().includes(ricerca.toLowerCase())
    return matchStato && matchRicerca
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Lead & Clienti</h1>
        <button onClick={caricaLead} className="text-sm text-blue-600 hover:underline">
          Aggiorna
        </button>
      </div>

      {/* Filtri */}
      <div className="bg-white rounded-2xl p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
            placeholder="Cerca per nome, email, telefono..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATI.map(s => (
            <button
              key={s}
              onClick={() => setFiltroStato(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${
                filtroStato === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'tutti' ? 'Tutti' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Lista lead */}
      {caricamento ? (
        <div className="text-center py-12 text-slate-400">Caricamento...</div>
      ) : leadFiltrati.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Nessun lead trovato</div>
      ) : (
        <div className="space-y-3">
          {leadFiltrati.map(l => (
            <div
              key={l.id}
              className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setLeadSelezionato(leadSelezionato?.id === l.id ? null : l)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">
                    {l.nome && l.cognome ? `${l.nome} ${l.cognome}` : l.email || 'N/D'}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    {l.telefono && (
                      <a href={`tel:${l.telefono}`} onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                        <Phone className="w-3 h-3" /> {l.telefono}
                      </a>
                    )}
                    {l.email && (
                      <a href={`mailto:${l.email}`} onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:underline">
                        <Mail className="w-3 h-3" /> {l.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${coloreStato(l.stato)}`}>
                    {l.stato?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">
                    {l.created_at ? new Date(l.created_at).toLocaleDateString('it-IT') : ''}
                  </span>
                </div>
              </div>

              {/* Dettaglio espanso */}
              {leadSelezionato?.id === l.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-xs text-slate-400 mb-1">Fornitore attuale</div>
                      <div className="text-sm font-medium">{l.fornitore_attuale || 'N/D'}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-xs text-slate-400 mb-1">Consumo kWh</div>
                      <div className="text-sm font-medium">{l.consumo_annuo_kwh || 'N/D'}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="text-xs text-slate-400 mb-1">Consumo Smc</div>
                      <div className="text-sm font-medium">{l.consumo_annuo_smc || 'N/D'}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3">
                      <div className="text-xs text-green-600 mb-1">Risparmio annuo</div>
                      <div className="text-sm font-bold text-green-700">
                        {l.risparmio_annuo ? `€ ${l.risparmio_annuo}` : 'N/D'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="text-xs text-blue-600 mb-1">Offerta consigliata</div>
                    <div className="text-sm font-medium">{l.fornitore_consigliato} — {l.nome_offerta}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {l.prezzo_kwh ? `€ ${l.prezzo_kwh}/kWh` : ''} {l.prezzo_smc ? `€ ${l.prezzo_smc}/Smc` : ''}
                    </div>
                  </div>

                  {/* Aggiorna stato */}
                  {(utente.ruolo === 'admin' || utente.ruolo === 'operatore') && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Aggiorna stato:</div>
                      <div className="flex flex-wrap gap-2">
                        {['in_lavorazione', 'chiuso', 'non_interessato'].map(s => (
                          <button
                            key={s}
                            onClick={e => { e.stopPropagation(); aggiornaStato(l.id, s) }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${coloreStato(s)}`}
                          >
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Lead
