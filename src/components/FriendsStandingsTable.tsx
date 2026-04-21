import type { FreundeStanding } from '../types'

interface Props {
  standings: FreundeStanding[]
  loading: boolean
  error: string | null
}

export function FriendsStandingsTable({ standings, loading, error }: Props) {
  if (loading) {
    return (
      <div className="f1-card p-8 text-center text-gray-400">
        Excel-Datei wird geladen...
      </div>
    )
  }

  if (error) {
    return (
      <div className="f1-card p-8 text-center">
        <p className="text-red-400 font-semibold mb-2">Fehler beim Laden der Excel-Datei</p>
        <p className="text-gray-400 text-sm">{error}</p>
        <p className="text-gray-500 text-xs mt-3">
          Stelle sicher, dass{' '}
          <code className="bg-f1border px-1 rounded">F1_2026_Freunde_Quotes_Updated.xlsx</code>{' '}
          im <code className="bg-f1border px-1 rounded">public/</code> Ordner liegt.
        </p>
      </div>
    )
  }

  if (standings.length === 0) {
    return (
      <div className="f1-card p-8 text-center text-gray-400">
        Keine Daten. Bitte zuerst F1-Daten laden und Excel-Datei prüfen.
      </div>
    )
  }

  const maxFreunde = standings[0]?.freudePoints ?? 1

  return (
    <div className="f1-card overflow-hidden">
      <div className="px-4 py-3 border-b border-f1border flex items-center gap-4">
        <p className="text-xs text-gray-400">
          Freunde Punkte = Fahrerpunkte × Freunde_Quote
        </p>
        <p className="text-xs text-gray-500">
          Höhere Quote = Außenseiter = mehr Punkte bei Erfolg
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-f1border text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-12">Pos</th>
              <th className="px-4 py-3 text-left">Fahrer</th>
              <th className="px-4 py-3 text-right">Quote</th>
              <th className="px-4 py-3 text-right">Echte Pkt.</th>
              <th className="px-4 py-3 text-right font-bold">Freunde Pkt.</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr key={s.driver.driverId} className="border-b border-f1border/50 table-row-hover">
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      s.position === 1
                        ? 'bg-yellow-500 text-black'
                        : s.position === 2
                        ? 'bg-gray-400 text-black'
                        : s.position === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-f1border text-gray-300'
                    }`}
                  >
                    {s.position}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-semibold">
                      {s.driver.givenName} {s.driver.familyName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-32 bg-f1border rounded-full h-1">
                        <div
                          className="bg-f1red h-1 rounded-full transition-all duration-500"
                          style={{ width: `${(s.freudePoints / maxFreunde) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs">{s.driver.constructorName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-amber-400 font-mono text-xs">×{s.freudeQuote.toFixed(2)}</span>
                </td>
                <td className="px-4 py-3 text-right text-gray-400">{s.realPoints}</td>
                <td className="px-4 py-3 text-right font-bold text-white">
                  {s.freudePoints.toLocaleString('de-DE', { maximumFractionDigits: 1 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
