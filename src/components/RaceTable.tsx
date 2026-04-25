import { useMemo } from 'react'
import type { Race, DriverQuota } from '../types'
import { getTeamColor, getTeamColorByName } from '../utils/colors'

interface Props {
  races: Race[]
  view: 'drivers' | 'teams' | 'freunde'
  quotas: DriverQuota[]
}

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function findQuote(code: string, driverId: string, quotas: DriverQuota[]): number {
  const normCode = normalize(code)
  const normId = normalize(driverId)
  for (const q of quotas) {
    const qSurname = normalize(q.driverName).split(' ').pop() ?? ''
    if (qSurname === normCode || qSurname === normId) return q.freudeQuote
  }
  return 1
}

function shortName(name: string) {
  return name.replace(' Grand Prix', '').replace('Grand Prix', '').trim()
}

// ── Shared cell ───────────────────────────────────────────────

function Cell({ pos, pts, color }: { pos?: number; pts: number; color?: string }) {
  if (pts === 0 && pos === undefined) {
    return <span className="text-gray-600">—</span>
  }
  return (
    <span className="flex flex-col items-center leading-tight">
      {pos !== undefined && (
        <span className="text-gray-500 text-[10px]">P{pos}</span>
      )}
      <span className="font-semibold" style={color ? { color } : undefined}>
        {pts % 1 === 0 ? pts : pts.toFixed(2)}
      </span>
    </span>
  )
}

// ── Driver table ──────────────────────────────────────────────

function buildDriverRows(races: Race[]) {
  const map = new Map<string, { driverId: string; constructorId: string; results: Record<number, { pos: number; pts: number }> }>()
  for (const race of races) {
    for (const r of race.results) {
      if (!map.has(r.driverCode)) map.set(r.driverCode, { driverId: r.driverId, constructorId: r.constructorId, results: {} })
      const entry = map.get(r.driverCode)!
      entry.constructorId = r.constructorId
      entry.driverId = r.driverId
      entry.results[race.round] = { pos: r.position, pts: r.points }
    }
  }
  return [...map.entries()]
    .map(([key, d]) => ({
      key,
      driverId: d.driverId,
      constructorId: d.constructorId,
      results: d.results,
      total: Object.values(d.results).reduce((s, r) => s + r.pts, 0),
    }))
    .sort((a, b) => b.total - a.total)
}

function buildTeamRows(races: Race[]) {
  const map = new Map<string, { constructorId: string; results: Record<number, number> }>()
  for (const race of races) {
    for (const r of race.results) {
      if (!map.has(r.constructorName)) map.set(r.constructorName, { constructorId: r.constructorId, results: {} })
      const entry = map.get(r.constructorName)!
      entry.results[race.round] = (entry.results[race.round] ?? 0) + r.points
    }
  }
  return [...map.entries()]
    .map(([key, d]) => ({
      key,
      constructorId: d.constructorId,
      results: d.results,
      total: Object.values(d.results).reduce((s, p) => s + p, 0),
    }))
    .sort((a, b) => b.total - a.total)
}

function buildFreundeRows(races: Race[], quotas: DriverQuota[]) {
  const driverRows = buildDriverRows(races)
  return driverRows
    .map((d) => {
      const quote = findQuote(d.key, d.driverId, quotas)
      const results: Record<number, { pos: number; pts: number; fpts: number }> = {}
      for (const [round, r] of Object.entries(d.results)) {
        const fpts = Math.round(r.pts * quote * 100) / 100
        results[Number(round)] = { pos: r.pos, pts: r.pts, fpts }
      }
      return {
        key: d.key,
        constructorId: d.constructorId,
        results,
        quote,
        total: Math.round(Object.values(results).reduce((s, r) => s + r.fpts, 0) * 100) / 100,
      }
    })
    .sort((a, b) => b.total - a.total)
}

// ── Main component ────────────────────────────────────────────

export function RaceTable({ races, view, quotas }: Props) {
  const rounds = useMemo(
    () => races.map((r) => ({ round: r.round, label: shortName(r.raceName) })),
    [races]
  )

  const driverRows = useMemo(() => buildDriverRows(races), [races])
  const teamRows = useMemo(() => buildTeamRows(races), [races])
  const freudeRows = useMemo(() => buildFreundeRows(races, quotas), [races, quotas])

  if (races.length === 0) return null

  return (
    <div className="border-t border-f1border pt-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Rennergebnisse im Detail
      </h3>

      <div className="overflow-x-auto">
        <table className="text-xs border-separate border-spacing-0 w-max min-w-full">
          {/* Header row */}
          <thead>
            <tr>
              {/* Sticky name column */}
              <th className="sticky left-0 z-10 bg-[#15151e] border-b border-f1border px-3 py-1 text-left text-gray-400 font-semibold min-w-[90px]">
                {view === 'teams' ? 'Team' : 'Fahrer'}
              </th>

              {rounds.map(({ round, label }) => (
                <th
                  key={round}
                  className="border-b border-f1border px-1 py-1 text-center text-gray-500 font-medium"
                  style={{ minWidth: 52 }}
                >
                  <span
                    className="block"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      whiteSpace: 'nowrap',
                      fontSize: 10,
                      maxHeight: 90,
                      overflow: 'hidden',
                    }}
                  >
                    {label}
                  </span>
                </th>
              ))}

              <th className="border-b border-f1border px-3 py-1 text-right text-gray-400 font-semibold min-w-[60px] sticky right-0 z-10 bg-[#15151e]">
                {view === 'freunde' ? 'F-Pkt.' : 'Gesamt'}
              </th>
            </tr>
          </thead>

          <tbody>
            {view === 'drivers' &&
              driverRows.map((row, i) => {
                const color = getTeamColor(row.constructorId)
                return (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}>
                    <td className={`sticky left-0 z-10 px-3 py-1.5 font-semibold ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span style={{ color }}>{row.key}</span>
                      </span>
                    </td>
                    {rounds.map(({ round }) => {
                      const r = row.results[round]
                      return (
                        <td key={round} className="px-1 py-1.5 text-center">
                          {r ? <Cell pos={r.pos} pts={r.pts} /> : <span className="text-gray-700">—</span>}
                        </td>
                      )
                    })}
                    <td className={`sticky right-0 z-10 px-3 py-1.5 text-right font-bold ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`} style={{ color }}>
                      {row.total}
                    </td>
                  </tr>
                )
              })}

            {view === 'teams' &&
              teamRows.map((row, i) => {
                const color = getTeamColorByName(row.key)
                return (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}>
                    <td className={`sticky left-0 z-10 px-3 py-1.5 font-semibold ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span style={{ color }}>{row.key}</span>
                      </span>
                    </td>
                    {rounds.map(({ round }) => {
                      const pts = row.results[round]
                      return (
                        <td key={round} className="px-1 py-1.5 text-center">
                          {pts !== undefined && pts > 0
                            ? <span className="font-semibold text-white">{pts}</span>
                            : <span className="text-gray-700">—</span>}
                        </td>
                      )
                    })}
                    <td className={`sticky right-0 z-10 px-3 py-1.5 text-right font-bold ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`} style={{ color }}>
                      {row.total}
                    </td>
                  </tr>
                )
              })}

            {view === 'freunde' &&
              freudeRows.map((row, i) => {
                const color = getTeamColor(row.constructorId)
                return (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}>
                    <td className={`sticky left-0 z-10 px-3 py-1.5 font-semibold ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span style={{ color }}>{row.key}</span>
                        <span className="text-gray-600 font-normal">×{row.quote}</span>
                      </span>
                    </td>
                    {rounds.map(({ round }) => {
                      const r = row.results[round]
                      return (
                        <td key={round} className="px-1 py-1.5 text-center">
                          {r && r.pts > 0
                            ? <Cell pos={r.pos} pts={r.fpts} color="#f59e0b" />
                            : <span className="text-gray-700">—</span>}
                        </td>
                      )
                    })}
                    <td className={`sticky right-0 z-10 px-3 py-1.5 text-right font-bold text-amber-400 ${i % 2 === 0 ? 'bg-[#15151e]' : 'bg-[#1a1a28]'}`}>
                      {row.total % 1 === 0 ? row.total : row.total.toFixed(2)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
