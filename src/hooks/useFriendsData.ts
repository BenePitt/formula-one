import { useState, useEffect } from 'react'
import type { DriverQuota } from '../types'
import { parseDriverQuotas } from '../utils/excelParser'
import { getSeasonConfig } from '../utils/seasons'

interface FriendsState {
  quotas: DriverQuota[]
  hasQuotas: boolean
  loading: boolean
  error: string | null
}

export function useFriendsData(season: string) {
  const [state, setState] = useState<FriendsState>({
    quotas: [],
    hasQuotas: false,
    loading: false,
    error: null,
  })

  useEffect(() => {
    const config = getSeasonConfig(season)

    if (!config?.hasFreundeQuotes || !config.excelFile) {
      setState({ quotas: [], hasQuotas: false, loading: false, error: null })
      return
    }

    setState({ quotas: [], hasQuotas: false, loading: true, error: null })

    const url = `${import.meta.env.BASE_URL}${config.excelFile}`
    parseDriverQuotas(url)
      .then((quotas) => setState({ quotas, hasQuotas: true, loading: false, error: null }))
      .catch((err) =>
        setState({
          quotas: [],
          hasQuotas: false,
          loading: false,
          error: err instanceof Error ? err.message : 'Excel konnte nicht geladen werden',
        })
      )
  }, [season])

  return state
}
