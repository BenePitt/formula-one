import type { DriverStanding, DriverQuota, FreundeStanding, Race, ChartPoint } from '../types'

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function findQuota(driver: { driverId: string; code: string; givenName: string; familyName: string }, quotas: DriverQuota[]): number {
  const fullName = normalize(`${driver.givenName} ${driver.familyName}`)
  const surname = normalize(driver.familyName)
  const code = normalize(driver.code)
  const driverId = normalize(driver.driverId)

  for (const q of quotas) {
    const qName = normalize(q.driverName)
    const qSurname = qName.split(' ').pop() ?? qName
    if (
      qName === fullName ||
      qSurname === surname ||
      qSurname === driverId ||
      qSurname === code
    ) {
      return q.freudeQuote
    }
  }
  return 1
}

export function calcFreundeStandings(
  standings: DriverStanding[],
  quotas: DriverQuota[]
): FreundeStanding[] {
  const result = standings.map((s) => {
    const freudeQuote = findQuota(s.driver, quotas)
    return {
      position: 0,
      driver: s.driver,
      realPoints: s.points,
      freudePoints: Math.round(s.points * freudeQuote * 100) / 100,
      freudeQuote,
    }
  })
  result.sort((a, b) => b.freudePoints - a.freudePoints)
  result.forEach((r, i) => { r.position = i + 1 })
  return result
}

export function buildDriverChartData(races: Race[]): { data: ChartPoint[]; keys: string[] } {
  const driverKeys = new Set<string>()
  const cumulative: Record<string, number> = {}

  const data: ChartPoint[] = races.map((race) => {
    for (const r of race.results) {
      driverKeys.add(r.driverCode)
      cumulative[r.driverCode] = (cumulative[r.driverCode] ?? 0) + r.points
    }
    const point: ChartPoint = { raceName: shortName(race.raceName), round: race.round }
    for (const code of driverKeys) {
      point[code] = cumulative[code] ?? 0
    }
    return point
  })

  return { data, keys: [...driverKeys] }
}

export function buildTeamChartData(races: Race[]): { data: ChartPoint[]; keys: string[] } {
  const teamKeys = new Set<string>()
  const cumulative: Record<string, number> = {}

  const data: ChartPoint[] = races.map((race) => {
    for (const r of race.results) {
      teamKeys.add(r.constructorName)
      cumulative[r.constructorName] = (cumulative[r.constructorName] ?? 0) + r.points
    }
    const point: ChartPoint = { raceName: shortName(race.raceName), round: race.round }
    for (const team of teamKeys) {
      point[team] = cumulative[team] ?? 0
    }
    return point
  })

  return { data, keys: [...teamKeys] }
}

export function buildFreundeChartData(races: Race[], quotas: DriverQuota[]): { data: ChartPoint[]; keys: string[] } {
  const driverKeys = new Set<string>()
  const cumulative: Record<string, number> = {}

  const data: ChartPoint[] = races.map((race) => {
    for (const r of race.results) {
      const q = findQuotaByCode(r.driverCode, r.driverId, quotas)
      driverKeys.add(r.driverCode)
      cumulative[r.driverCode] = (cumulative[r.driverCode] ?? 0) + r.points * q
    }
    const point: ChartPoint = { raceName: shortName(race.raceName), round: race.round }
    for (const code of driverKeys) {
      point[code] = Math.round((cumulative[code] ?? 0) * 100) / 100
    }
    return point
  })

  return { data, keys: [...driverKeys] }
}

function findQuotaByCode(code: string, driverId: string, quotas: DriverQuota[]): number {
  const normCode = normalize(code)
  const normId = normalize(driverId)
  for (const q of quotas) {
    const qSurname = normalize(q.driverName).split(' ').pop() ?? ''
    if (qSurname === normCode || qSurname === normId) return q.freudeQuote
  }
  return 1
}

function shortName(name: string): string {
  return name.replace(' Grand Prix', '').replace('Grand Prix', '').trim()
}
