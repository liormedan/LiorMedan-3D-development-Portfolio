import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { products } from '@/lib/products'
import { getVatPercent } from '@/lib/pricing'

function getBaseUrl(req: Request) {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, '')
  const { headers } = req as any
  const host = headers.get('x-forwarded-host') || headers.get('host')
  const proto = headers.get('x-forwarded-proto') || 'https'
  return `${proto}://${host}`
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

    const body = await req.json().catch(() => null)
    const items: { productId: string; qty: number }[] | null = body?.items || null
    if (!items || !Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const vatRate = getVatPercent() / 100
    for (const it of items) {
      const p = products.find((x) => x.id === it.productId)
      if (!p) continue
      const gross = p.price.amount * (1 + vatRate)
      const amount = Math.round(gross * 100)
      line_items.push({
        quantity: Math.max(1, Math.floor(it.qty || 1)),
        price_data: {
          currency: p.price.currency.toLowerCase() as any,
          unit_amount: amount,
          product_data: {
            name: p.name,
            metadata: { productId: p.id, slug: p.slug },
          },
        },
      })
    }

    if (line_items.length === 0)
      return NextResponse.json({ error: 'No valid items' }, { status: 400 })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    const base = getBaseUrl(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
