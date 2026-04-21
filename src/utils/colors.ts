// Official F1 2026 constructor colors
const TEAM_COLORS: Record<string, string> = {
  red_bull: '#3671C6',
  ferrari: '#E8002D',
  mercedes: '#27F4D2',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  haas: '#B6BABD',
  sauber: '#52E252',
  kick_sauber: '#52E252',
  rb: '#6692FF',
  racing_bulls: '#6692FF',
  visa_cash_app_rb: '#6692FF',
  alphatauri: '#6692FF',
  renault: '#FF87BC',
}

const FALLBACK_PALETTE = [
  '#e10600', '#3671C6', '#27F4D2', '#FF8000', '#229971',
  '#FF87BC', '#64C4FF', '#B6BABD', '#52E252', '#6692FF',
]

function normalizeId(s: string): string {
  return s.toLowerCase().replace(/[\s\-]/g, '_')
}

export function getTeamColor(constructorId: string): string {
  const key = normalizeId(constructorId)
  if (TEAM_COLORS[key]) return TEAM_COLORS[key]
  for (const [k, v] of Object.entries(TEAM_COLORS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return '#888888'
}

export function getTeamColorByName(constructorName: string): string {
  return getTeamColor(constructorName)
}

export function fallbackColor(index: number): string {
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]
}
