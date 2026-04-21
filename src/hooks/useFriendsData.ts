import { useState, useEffect } from 'react'
import type { DriverQuota } from '../types'
import { parseDriverQuotas } from '../utils/excelParser'

interface FriendsState {
  quotas: DriverQuota[]
  loading: boolean
  error: string | null
}

export function useFriendsData() {
  const [state, setState] = useState<FriendsState>({
    quotas: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}F1_2026_Freunde_Quotes_Updated.xlsx`
    parseDriverQuotas(url)
      .then((quotas) => setState({ quotas, loading: false, error: null }))
      .catch((err) =>
        setState({
          quotas: [],
          loading: false,
          error: err instanceof Error ? err.message : 'Excel konnte nicht geladen werden',
        })
      )
  }, [])

  return state
}
