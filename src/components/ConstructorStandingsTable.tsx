import type { ConstructorStanding } from '../types'
import { getTeamColor } from '../utils/colors'

interface Props {
  standings: ConstructorStanding[]
}

export function ConstructorStandingsTable({ standings }: Props) {
  if (standings.length === 0) {
    return (
      <div className="f1-card p-8 text-center text-gray-400">
        Keine Daten verfügbar. Bitte aktualisieren.
      </div>
    )
  }

  const maxPoints = standings[0]?.points ?? 1

  return (
    <div className="f1-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-f1border text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-12">Pos</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-right">Siege</th>
              <th className="px-4 py-3 text-right font-bold">Punkte</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => {
              const color = getTeamColor(s.constructorId)
              return (
                <tr key={s.constructorId} className="border-b border-f1border/50 table-row-hover">
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
                        className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <div className="font-semibold">{s.constructorName}</div>
                        <div className="mt-1 w-40 bg-f1border rounded-full h-1">
                          <div
                            className="h-1 rounded-full transition-all duration-500"
                            style={{
                              width: `${(s.points / maxPoints) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{s.wins}</td>
                  <td className="px-4 py-3 text-right font-bold text-white">{s.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
