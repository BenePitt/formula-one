import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Race, DriverQuota, DriverStanding, ChartView } from '../types'
import { buildDriverChartData, buildTeamChartData, buildFreundeChartData } from '../utils/calculations'
import { getTeamColor, getTeamColorByName } from '../utils/colors'
import { RaceTable } from './RaceTable'

const ALL_VIEWS: { id: ChartView; label: string }[] = [
  { id: 'drivers', label: 'Alle Fahrer' },
  { id: 'teams', label: 'Teams' },
  { id: 'freunde', label: 'Freunde-Pkt.' },
]

interface Props {
  races: Race[]
  quotas: DriverQuota[]
  standings: DriverStanding[]
  hasQuotas: boolean
}

export function PointsChart({ races, quotas, standings, hasQuotas }: Props) {
  const [view, setView] = useState<ChartView>('drivers')

  const views = ALL_VIEWS.filter((v) => v.id !== 'freunde' || hasQuotas)
  const activeView = view === 'freunde' && !hasQuotas ? 'drivers' : view
  const [hiddenDrivers, setHiddenDrivers] = useState<Set<string>>(new Set())
  const [hiddenTeams, setHiddenTeams] = useState<Set<string>>(new Set())
  const [hiddenFreunde, setHiddenFreunde] = useState<Set<string>>(new Set())

  const driverColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of standings) {
      map[s.driver.code] = getTeamColor(s.driver.constructorId)
    }
    return map
  }, [standings])

  const teamColorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const race of races) {
      for (const r of race.results) {
        if (!map[r.constructorName]) {
          map[r.constructorName] = getTeamColorByName(r.constructorName)
        }
      }
    }
    return map
  }, [races])

  const { data: driverData, keys: driverKeys } = useMemo(() => buildDriverChartData(races), [races])
  const { data: teamData, keys: teamKeys } = useMemo(() => buildTeamChartData(races), [races])
  const { data: freudeData, keys: freudeKeys } = useMemo(
    () => buildFreundeChartData(races, quotas),
    [races, quotas]
  )

  const activeData = activeView === 'drivers' ? driverData : activeView === 'teams' ? teamData : freudeData
  const activeKeys = activeView === 'drivers' ? driverKeys : activeView === 'teams' ? teamKeys : freudeKeys

  const hidden =
    activeView === 'drivers' ? hiddenDrivers : activeView === 'teams' ? hiddenTeams : hiddenFreunde

  const toggle = (key: string) => {
    const setter =
      activeView === 'drivers' ? setHiddenDrivers : activeView === 'teams' ? setHiddenTeams : setHiddenFreunde
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const showAll = () => {
    const setter =
      activeView === 'drivers' ? setHiddenDrivers : activeView === 'teams' ? setHiddenTeams : setHiddenFreunde
    setter(new Set())
  }

  const hideAll = () => {
    const setter =
      activeView === 'drivers' ? setHiddenDrivers : activeView === 'teams' ? setHiddenTeams : setHiddenFreunde
    setter(new Set(activeKeys))
  }

  const getColor = (key: string): string => {
    if (activeView === 'teams') return teamColorMap[key] ?? '#888'
    return driverColorMap[key] ?? '#888'
  }

  const visibleKeys = activeKeys.filter((k) => !hidden.has(k))

  if (races.length === 0) {
    return (
      <div className="f1-card p-8 text-center text-gray-400">
        Keine Renndaten verfügbar. Bitte aktualisieren.
      </div>
    )
  }

  return (
    <div className="f1-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wider">
          Punkteverlauf
        </h2>
        <div className="flex gap-1 bg-f1border p-1 rounded-lg">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                activeView === v.id ? 'bg-f1red text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={activeData} margin={{ top: 5, right: 20, bottom: 80, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f2f3e" />
          <XAxis
            dataKey="raceName"
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={4}
                fill="#9ca3af"
                fontSize={10}
                textAnchor="end"
                transform={`rotate(-45, ${x}, ${y})`}
              >
                {payload.value}
              </text>
            )}
            tickLine={false}
            axisLine={{ stroke: '#2f2f3e' }}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f1f2e',
              border: '1px solid #2f2f3e',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 12,
            }}
          />
          {visibleKeys.map((key) => (
            <Line
              key={key}
              type="linear"
              dataKey={key}
              stroke={getColor(key)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Toggle legend */}
      <div className="border-t border-f1border pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Anzeigen ({visibleKeys.length}/{activeKeys.length})
          </span>
          <div className="flex gap-2">
            <button
              onClick={showAll}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Alle
            </button>
            <span className="text-gray-600">·</span>
            <button
              onClick={hideAll}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Keine
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeKeys.map((key) => {
            const color = getColor(key)
            const isHidden = hidden.has(key)
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                title={key}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  backgroundColor: isHidden ? 'transparent' : color + '22',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: isHidden ? '#2f2f3e' : color,
                  color: isHidden ? '#4b5563' : '#e5e7eb',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isHidden ? '#374151' : color }}
                />
                {key}
              </button>
            )
          })}
        </div>
      </div>

      <RaceTable races={races} view={activeView} quotas={quotas} />
    </div>
  )
}
