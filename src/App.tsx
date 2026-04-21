import { useEffect, useState } from 'react'
import type { Tab } from './types'
import { useF1Data } from './hooks/useF1Data'
import { useFriendsData } from './hooks/useFriendsData'
import { calcFreundeStandings } from './utils/calculations'
import { Header } from './components/Header'
import { StandingsTable } from './components/StandingsTable'
import { ConstructorStandingsTable } from './components/ConstructorStandingsTable'
import { FriendsStandingsTable } from './components/FriendsStandingsTable'
import { PointsChart } from './components/PointsChart'

const TABS: { id: Tab; label: string }[] = [
  { id: 'standings', label: '🏁 Fahrerstand' },
  { id: 'constructors', label: '🏆 Teamstand' },
  { id: 'friends', label: '🎲 Freunde-Stand' },
  { id: 'chart', label: '📈 Punkteverlauf' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('standings')
  const { standings, constructorStandings, races, loading, error, lastUpdated, refresh } = useF1Data('2026')
  const { quotas, loading: quotasLoading, error: quotasError } = useFriendsData()

  useEffect(() => {
    refresh()
  }, [refresh])

  const freudeStandings = calcFreundeStandings(standings, quotas)

  return (
    <div className="min-h-screen bg-f1dark">
      <Header lastUpdated={lastUpdated} loading={loading} onRefresh={refresh} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
            Fehler beim Laden der F1-Daten: {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 bg-f1card border border-f1border p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`f1-tab ${activeTab === tab.id ? 'f1-tab-active' : 'f1-tab-inactive'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'standings' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Fahrerweltmeisterschaft 2026
              </h2>
              <span className="text-xs text-gray-500">{standings.length} Fahrer</span>
            </div>
            <StandingsTable standings={standings} />
          </div>
        )}

        {activeTab === 'constructors' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Konstrukteursweltmeisterschaft 2026
              </h2>
              <span className="text-xs text-gray-500">{constructorStandings.length} Teams</span>
            </div>
            <ConstructorStandingsTable standings={constructorStandings} />
          </div>
        )}

        {activeTab === 'friends' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Freunde Wettstand 2026
              </h2>
              <span className="text-xs text-gray-500">{freudeStandings.length} Fahrer</span>
            </div>
            <FriendsStandingsTable
              standings={freudeStandings}
              loading={quotasLoading}
              error={quotasError}
            />
          </div>
        )}

        {activeTab === 'chart' && (
          <PointsChart races={races} quotas={quotas} standings={standings} />
        )}

        {loading && standings.length === 0 && (
          <div className="f1-card p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-f1red border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-400">Daten werden geladen...</p>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 mt-4 border-t border-f1border text-center text-xs text-gray-600">
        Privates Projekt &ndash; kein offizielles Produkt von Formula One Management Ltd. oder der FIA.
        F1-Daten bereitgestellt von der{' '}
        <a
          href="https://api.jolpi.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 underline transition-colors"
        >
          Jolpica F1 API
        </a>
        .
      </footer>
    </div>
  )
}
