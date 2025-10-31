import Stripe from 'stripe'
import Link from 'next/link'
import ClearCartOnSuccess from '../ClearCartOnSuccess'
import PrintReceiptButton from '../PrintReceiptButton'
import { getVatPercent, splitVatFromGross } from '@/lib/pricing'

type Props = { searchParams?: { [key: string]: string | string[] | undefined } }

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = (searchParams?.session_id as string) || ''
  let total: number | null = null
  let currency: string | null = null
  let items: { description: string; quantity: number; amountSubtotal: number }[] = []

  if (process.env.STRIPE_SECRET_KEY && sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
      })
      total = (session.amount_total ?? null) ? (session.amount_total as number) / 100 : null
      currency = (session.currency ?? null) as string | null
      const li = (session.line_items?.data || []) as any[]
      items = li.map((l) => ({
        description: l.description as string,
        quantity: (l.quantity as number) || 1,
        amountSubtotal: ((l.amount_subtotal as number) || 0) / 100,
      }))
    } catch (e) {
      // ignore – show generic confirmation
    }
  }

  const vatPercent = getVatPercent()
  const vatSplit = total !== null ? splitVatFromGross(total) : null

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      {/* Clear local cart now that payment succeeded */}
      <ClearCartOnSuccess />
      <div className="max-w-3xl mx-auto space-y-6 text-right">
        <h1 className="text-2xl font-semibold">התשלום הושלם בהצלחה</h1>
        {total !== null && currency ? (
          <div className="space-y-2">
            <div className="text-zinc-300">סכום ששולם (כולל מע"מ): {total} {currency.toUpperCase()}</div>
            {vatSplit && (
              <div className="text-sm text-zinc-400">
                סכום לפני מע"מ: {vatSplit.net.toFixed(2)} {currency.toUpperCase()} · מע"מ ({vatPercent}%): {vatSplit.vat.toFixed(2)} {currency.toUpperCase()}
              </div>
            )}
            {items.length > 0 && (
              <div className="border border-zinc-800 rounded-lg">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border-b border-zinc-800 last:border-b-0">
                    <div className="text-zinc-300">{it.description}</div>
                    <div className="text-zinc-400 text-sm">x{it.quantity} — {it.amountSubtotal} {currency.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-zinc-400">העסקה אומתה. ניתן לחזור לחנות.</p>
        )}
        <div className="flex gap-4 justify-end">
          <PrintReceiptButton />
          <Link href="/products" className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">חזרה לחנות</Link>
          <Link href="/" className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700">לדף הבית</Link>
        </div>
      </div>
    </main>
  )
}
