export function getVatPercent(): number {
  const env = process.env.NEXT_PUBLIC_VAT_PERCENT
  const n = env ? Number(env) : 17
  return Number.isFinite(n) ? n : 17
}

export function addVat(amount: number): { net: number; vat: number; gross: number } {
  const rate = getVatPercent() / 100
  const net = amount
  const vat = +(net * rate)
  const gross = +(net * (1 + rate))
  return { net, vat, gross }
}

export function splitVatFromGross(gross: number): { net: number; vat: number; gross: number } {
  const rate = getVatPercent() / 100
  const net = +(gross / (1 + rate))
  const vat = +(gross - net)
  return { net, vat, gross }
}

export function formatCurrency(amount: number, currency: 'ILS' | 'USD' | 'EUR'): string {
  try {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

