import { useState, useCallback, useEffect } from 'react'
import type { DriverStanding, ConstructorStanding, Race } from '../types'
import { fetchDriverStandings, fetchConstructorStandings, fetchRaces } from '../utils/f1Api'

interface F1State {
  standings: DriverStanding[]
  constructorStandings: ConstructorStanding[]
  races: Race[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

const emptyState: F1State = {
  standings: [],
  constructorStandings: [],
  races: [],
  loading: false,
  error: null,
  lastUpdated: null,
}

export function useF1Data(season = '2026') {
  const [state, setState] = useState<F1State>(emptyState)

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const [standings, constructorStandings, races] = await Promise.all([
        fetchDriverStandings(season),
        fetchConstructorStandings(season),
        fetchRaces(season),
      ])
      setState({ standings, constructorStandings, races, loading: false, error: null, lastUpdated: new Date() })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Unbekannter Fehler',
      }))
    }
  }, [season])

  useEffect(() => {
    setState(emptyState)
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season])

  return { ...state, refresh }
}
