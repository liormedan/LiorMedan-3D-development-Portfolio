"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useCart } from '@/lib/cart'
import { products, type Product } from '@/lib/products'
import { addVat, formatCurrency, getVatPercent } from '@/lib/pricing'

export default function CartClient() {
  const { items, remove, clear } = useCart()
  const [loading, setLoading] = useState(false)

  type Row = Product & { qty: number; total: number }
  const rows: Row[] = useMemo(() => {
    const mapped = items
      .map((i: { productId: string; qty: number }) => {
        const p = products.find((x) => x.id === i.productId)
        if (!p) return null
        return { ...p, qty: i.qty, total: p.price.amount * i.qty }
      })
      .filter((r: Row | null): r is Row => !!r)
    return mapped
  }, [items])

  const subtotal = rows.reduce((acc, r) => acc + r.total, 0)
  const { vat, gross } = addVat(subtotal)
  const vatPercent = getVatPercent()

  const checkout = async () => {
    if (rows.length === 0 || loading) return
    setLoading(true)
    window.location.href = '/checkout/success?status=demo'
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">הסל שלי</h1>
          <Link href="/products" className="text-sm text-zinc-300 hover:text-white">חזרה לחנות</Link>
        </div>

        {rows.length === 0 ? (
          <div className="text-zinc-400">הסל ריק.</div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between border border-zinc-800 rounded-lg p-4 bg-zinc-900">
                <div className="text-right">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-zinc-400 mt-1">כמות: {r.qty}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-zinc-300">{r.total} {r.price.currency}</div>
                  <button onClick={() => remove(r.id)} className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">הסר</button>
                </div>
              </div>
            ))}
            <div className="space-y-1 border-t border-zinc-800 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">סכום ביניים</span>
                <span>{formatCurrency(subtotal, rows[0]!.price.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">מע"מ ({vatPercent}%)</span>
                <span>{formatCurrency(vat, rows[0]!.price.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>לתשלום (כולל מע"מ)</span>
                <span>{formatCurrency(gross, rows[0]!.price.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={clear} className="text-sm text-zinc-400 hover:text-white">ניקוי הסל</button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={checkout}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
              >
                {loading ? 'מעביר לדמו…' : 'דמו: המשך לתוצאה'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

