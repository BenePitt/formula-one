import * as XLSX from 'xlsx'
import type { DriverQuota } from '../types'

// Excel structure: rows = drivers, columns = [Driver, Decimal_Quote, Relative_to_Russell, Freunde_Quote]
export async function parseDriverQuotas(url: string): Promise<DriverQuota[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Excel fetch failed: ${response.status}`)
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

  if (rows.length < 2) return []

  // Find column index for "Freunde_Quote" from header row
  const headers = (rows[0] as unknown[]).map((h) => String(h ?? '').trim().toLowerCase())
  const freudeColIdx = headers.findIndex((h) => h.includes('freunde'))
  const driverColIdx = 0

  if (freudeColIdx === -1) {
    // Fallback: use column index 3 (Freunde_Quote is always 4th column)
    return parseRows(rows.slice(1), driverColIdx, 3)
  }

  return parseRows(rows.slice(1), driverColIdx, freudeColIdx)
}

function parseRows(rows: unknown[][], driverCol: number, quoteCol: number): DriverQuota[] {
  const result: DriverQuota[] = []
  for (const row of rows) {
    const cells = row as unknown[]
    const name = String(cells[driverCol] ?? '').trim()
    const quote = parseFloat(String(cells[quoteCol] ?? '1'))
    if (name && !isNaN(quote)) {
      result.push({ driverName: name, freudeQuote: quote })
    }
  }
  return result
}
