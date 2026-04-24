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
  const PAGE_SIZE = 100

  const firstRes = await fetch(`${BASE}/${season}/results.json?limit=${PAGE_SIZE}&offset=0`)
  if (!firstRes.ok) throw new Error(`Results fetch failed: ${firstRes.status}`)
  const firstData = await firstRes.json()

  const total = parseInt(firstData.MRData?.total ?? '0')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allRaceData: any[] = [...(firstData.MRData?.RaceTable?.Races ?? [])]

  if (total > PAGE_SIZE) {
    const offsets: number[] = []
    for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
      offsets.push(offset)
    }
    const pages = await Promise.all(
      offsets.map((offset) =>
        fetch(`${BASE}/${season}/results.json?limit=${PAGE_SIZE}&offset=${offset}`)
          .then((r) => { if (!r.ok) throw new Error(`Results fetch failed: ${r.status}`); return r.json() })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((d) => (d.MRData?.RaceTable?.Races ?? []) as any[])
      )
    )
    for (const page of pages) allRaceData.push(...page)
  }

  // Merge results for races that span page boundaries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raceMap = new Map<number, any>()
  for (const race of allRaceData) {
    const round = parseInt(race.round)
    if (raceMap.has(round)) {
      raceMap.get(round).Results.push(...(race.Results ?? []))
    } else {
      raceMap.set(round, { ...race, Results: [...(race.Results ?? [])] })
    }
  }

  return [...raceMap.values()]
    .sort((a, b) => parseInt(a.round) - parseInt(b.round))
    .map((race) => ({
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
