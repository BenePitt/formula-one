import type { DriverStanding } from '../types'

const CONSTRUCTOR_COLORS: Record<string, string> = {
  red_bull: '#3671C6',
  ferrari: '#E8002D',
  mercedes: '#27F4D2',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  haas: '#B6BABD',
  sauber: '#52E252',
  rb: '#6692FF',
}

function getConstructorColor(constructorId: string): string {
  const key = Object.keys(CONSTRUCTOR_COLORS).find((k) =>
    constructorId.toLowerCase().includes(k.replace('_', ''))
  )
  return key ? CONSTRUCTOR_COLORS[key] : '#888'
}

interface Props {
  standings: DriverStanding[]
}

export function StandingsTable({ standings }: Props) {
  if (standings.length === 0) {
    return (
      <div className="f1-card p-8 text-center text-gray-400">
        Keine Daten verfügbar. Bitte aktualisieren.
      </div>
    )
  }

  return (
    <div className="f1-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-f1border text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-12">Pos</th>
              <th className="px-4 py-3 text-left">Fahrer</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-right">Siege</th>
              <th className="px-4 py-3 text-right font-bold">Punkte</th>
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
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getConstructorColor(s.driver.constructorId) }}
                    />
                    <div>
                      <div className="font-semibold">
                        {s.driver.givenName} {s.driver.familyName}
                      </div>
                      <div className="text-gray-400 text-xs">{s.driver.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">{s.driver.constructorName}</td>
                <td className="px-4 py-3 text-right text-gray-300">{s.wins}</td>
                <td className="px-4 py-3 text-right font-bold text-white">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
