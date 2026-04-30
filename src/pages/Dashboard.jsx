import React, { useState } from 'react'
import { LogOut, Users, Zap, BarChart2, Settings, FileText } from 'lucide-react'
import Lead from './Lead'
import Offerte from './Offerte'
import Operatori from './Operatori'
import Performance from './Performance'
import Impostazioni from './Impostazioni'

const menu = [
  { id: 'lead', label: 'Lead', icon: Users, ruoli: ['admin', 'operatore'] },
  { id: 'offerte', label: 'Offerte', icon: Zap, ruoli: ['admin'] },
  { id: 'operatori', label: 'Operatori', icon: FileText, ruoli: ['admin'] },
  { id: 'performance', label: 'Performance', icon: BarChart2, ruoli: ['admin'] },
  { id: 'impostazioni', label: 'Impostazioni', icon: Settings, ruoli: ['admin'] },
]

const Dashboard = ({ utente, onLogout }) => {
  const [sezione, setSezione] = useState('lead')

  const menuVisibile = menu.filter(m => m.ruoli.includes(utente.ruolo))

  const renderSezione = () => {
    switch (sezione) {
      case 'lead': return <Lead utente={utente} />
      case 'offerte': return <Offerte />
      case 'operatori': return <Operatori />
      case 'performance': return <Performance />
      case 'impostazioni': return <Impostazioni />
      default: return <Lead utente={utente} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <div className="w-56 bg-slate-900 flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">eUtenti CRM</div>
              <div className="text-slate-400 text-xs capitalize">{utente.ruolo}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuVisibile.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setSezione(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  sezione === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <div className="text-slate-400 text-xs px-3 mb-2">{utente.email}</div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div className="ml-56 flex-1 p-6">
        {renderSezione()}
      </div>

    </div>
  )
}

export default Dashboard
