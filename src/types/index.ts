export interface Driver {
  driverId: string
  code: string
  givenName: string
  familyName: string
  nationality: string
  constructorId: string
  constructorName: string
}

export interface DriverStanding {
  position: number
  points: number
  wins: number
  driver: Driver
}

export interface RaceResult {
  driverId: string
  driverCode: string
  constructorId: string
  constructorName: string
  points: number
  position: number
}

export interface Race {
  round: number
  raceName: string
  date: string
  country: string
  results: RaceResult[]
}

export interface DriverQuota {
  driverName: string
  freudeQuote: number
}

export interface FreundeStanding {
  position: number
  driver: Driver
  realPoints: number
  freudePoints: number
  freudeQuote: number
}

export interface ChartPoint {
  raceName: string
  round: number
  [key: string]: string | number
}

export interface ConstructorStanding {
  position: number
  points: number
  wins: number
  constructorId: string
  constructorName: string
  nationality: string
}

export type Tab = 'standings' | 'constructors' | 'friends' | 'chart'
export type ChartView = 'drivers' | 'teams' | 'freunde'
