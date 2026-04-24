export interface SeasonConfig {
  year: string
  hasFreundeQuotes: boolean
  excelFile?: string
}

export const SEASONS: SeasonConfig[] = [
  { year: '2026', hasFreundeQuotes: true, excelFile: 'F1_2026_Freunde_Quotes_Updated.xlsx' },
  { year: '2025', hasFreundeQuotes: false },
  { year: '2024', hasFreundeQuotes: false },
  { year: '2023', hasFreundeQuotes: false },
  { year: '2022', hasFreundeQuotes: false },
  { year: '2021', hasFreundeQuotes: false },
]

export const DEFAULT_SEASON = '2026'

export function getSeasonConfig(year: string): SeasonConfig | undefined {
  return SEASONS.find((s) => s.year === year)
}
