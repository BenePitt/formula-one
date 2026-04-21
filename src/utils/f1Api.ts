import type { DriverStanding, ConstructorStanding, Race } from '../types'

const BASE = 'https://api.jolpi.ca/ergast/f1'

export async function fetchDriverStandings(season = '2026'): Promise<DriverStanding[]> {
  const res = await fetch(`${BASE}/${season}/driverStandings.json`)
  if (!res.ok) throw new Error(`Standings fetch failed: ${res.status}`)
  const data = await res.json()
  const list = data.MRData?.StandingsTable?.StandingsLists?.[0]
  if (!list) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.DriverStandings.map((s: any) => ({
    position: parseInt(s.position),
    points: parseFloat(s.points),
    wins: parseInt(s.wins),
    driver: {
      driverId: s.Driver.driverId,
      code: s.Driver.code ?? '',
      givenName: s.Driver.givenName,
      familyName: s.Driver.familyName,
      nationality: s.Driver.nationality,
      constructorId: s.Constructors[0].constructorId,
      constructorName: s.Constructors[0].name,
    },
  }))
}

export async function fetchConstructorStandings(season = '2026'): Promise<ConstructorStanding[]> {
  const res = await fetch(`${BASE}/${season}/constructorStandings.json`)
  if (!res.ok) throw new Error(`Constructor standings fetch failed: ${res.status}`)
  const data = await res.json()
  const list = data.MRData?.StandingsTable?.StandingsLists?.[0]
  if (!list) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.ConstructorStandings.map((s: any) => ({
    position: parseInt(s.position),
    points: parseFloat(s.points),
    wins: parseInt(s.wins),
    constructorId: s.Constructor.constructorId,
    constructorName: s.Constructor.name,
    nationality: s.Constructor.nationality,
  }))
}

export async function fetchRaces(season = '2026'): Promise<Race[]> {
  const res = await fetch(`${BASE}/${season}/results.json?limit=500`)
  if (!res.ok) throw new Error(`Results fetch failed: ${res.status}`)
  const data = await res.json()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const races = (data.MRData?.RaceTable?.Races ?? []) as any[]
  return races.map((race) => ({
    round: parseInt(race.round),
    raceName: race.raceName,
    date: race.date,
    country: race.Circuit?.Location?.country ?? '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: (race.Results ?? []).map((r: any) => ({
      driverId: r.Driver.driverId,
      driverCode: r.Driver.code ?? '',
      constructorId: r.Constructor?.constructorId ?? '',
      constructorName: r.Constructor?.name ?? '',
      points: parseFloat(r.points),
      position: parseInt(r.position),
    })),
  }))
}
