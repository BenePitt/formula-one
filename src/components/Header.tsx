import { SEASONS } from '../utils/seasons'

interface HeaderProps {
  selectedSeason: string
  onSeasonChange: (season: string) => void
  lastUpdated: Date | null
  loading: boolean
  onRefresh: () => void
}

export function Header({ selectedSeason, onSeasonChange, lastUpdated, loading, onRefresh }: HeaderProps) {
  return (
    <header className="bg-f1card border-b border-f1border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-f1red rounded-lg flex items-center justify-center text-xl font-black">
            F1
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Standings</h1>
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Aktualisiert: {lastUpdated.toLocaleString('de-DE')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value)}
            className="bg-f1dark border border-f1border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-f1red cursor-pointer"
          >
            {SEASONS.map((s) => (
              <option key={s.year} value={s.year}>
                {s.year}
              </option>
            ))}
          </select>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="f1-btn"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            {loading ? 'Lädt...' : 'Aktualisieren'}
          </button>
        </div>
      </div>
    </header>
  )
}
